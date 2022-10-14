import hasBanWords from '../hasBanWords';
import getLinksText from '../getLinksText';
import parseAttachments from '../parseAttachments';
import prepareText from '../prepareText';
import bot from '../../telegram';
import config from '../../config';
import fs, { link, promises as fsAsync } from "fs"
import downloadMedia from './downloadMedia';
import textGhunkGenerator, { MEDIA_POST_LIMIT, TEXT_POST_LIMIT } from './textChunkGenerator';
import logger from '../../logger';
import { InputMedia } from 'node-telegram-bot-api';
import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects';
import fetch from 'node-fetch'
import getPhoto from '../parseAttachments/getPhoto';

const LONG_POST_REGEX = /^(([^\n.?!]{1,150}))\n/ // flags aren't required
const LONG_POST_PARSER_REGEX = /^([^\n.?!]+)\n|^(.+)/gm
// These can be one, but javascript regexes have state so there should be no "g" flag if used once on a string
const URL_REGEX = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gm
const DOMAIN_REGEX = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
const telegraphToken: string = config.get('tokens.telegraph')


async function sendPost(post: WallWallpostFull) {
  logger.info(`Sending post ${post.owner_id}_${post.id}`)
  const media = await parseAttachments(post);
  const text = prepareText(post.text);
  const { photos, links } = media;
  const videos = media.videos.filter(it => (!it.url.includes("youtube") && !it.url.includes("youtu.be")))
  if (hasBanWords(text)) return;

  const match = text.match(LONG_POST_REGEX)
  const isLongpost = match !== null && telegraphToken.length > 0 && (
    (videos.length + photos.length) > 0
      ? text.length > MEDIA_POST_LIMIT :
      text.length > TEXT_POST_LIMIT)
  const title = match && match[1]

  const channel = config.get('channel');
  const telegramMedia: InputMedia[] = [];
  if (!isLongpost || !config.get("useTelegraph")) {
    media.videos = media.videos.filter(it => it.url.includes("youtube") || it.url.includes("youtu.be"))
    for (const photo of photos) {
      telegramMedia.push({
        type: 'photo',
        media: await downloadMedia(photo)
      })
    }

    for (const video of videos) {
      try {
        const filename = await downloadMedia(video.url)
        if ((await fsAsync.stat(filename)).size > 50 * 1000 * 1000) {
          logger.info('Video size exceeded 50 MB')
          media.videos.push(video)
          fs.unlink(filename, (err) => {
            if (err !== null) logger.error(err); else logger.debug("Deleted temporary file")
          })
        } else {
          telegramMedia.push({
            "type": "video",
            "media": filename
          })
        }
      } catch (e) {
        logger.error(`Couldn't download video ${video.url}; Ignoring whole post`)
        return
      }
    }
  }

  const linksText = getLinksText(media, text);
  if (hasBanWords(linksText)) return;

  const hasMedia = telegramMedia.length !== 0
  const sendAsGroup = telegramMedia.length >= 2
  const textChunks = textGhunkGenerator(text + linksText, hasMedia);

  try {
    if (isLongpost && config.get("useTelegraph")) {
      // Send as telegraph post
      const link = links[0] || `https://vk.com/wall${post.owner_id}_${post.id}`
      const domain = DOMAIN_REGEX.exec(link)[1]
      const res = await fetch(
        "https://api.telegra.ph/createPage/",
        {
          body: JSON.stringify({
            access_token: telegraphToken,
            title: title,
            author_name: domain,
            author_url: link,
            content: JSON.stringify([
              // Get photos if any, else get photo of first link if any
              ...(photos.length > 0 ? photos : post.attachments
                .filter(v => v.type === "link")
                .filter(v => v.link.photo != undefined)
                .map(v => getPhoto(v.link.photo))
              ).slice(0, 1)
                .map(v => ({
                  tag: "img",
                  attrs: {
                    "src": v
                  }
                })),
              ...[...(text + linksText).substring(text.indexOf("\n") + 1).matchAll(LONG_POST_PARSER_REGEX)].flatMap((v) => {
                if (v[2] !== undefined) {
                  return v[2].split(URL_REGEX).map((v) => {
                    if (v.match(URL_REGEX) != null) {
                      return {
                        tag: "a",
                        attrs: {
                          "href": v
                        },
                        children: [v]
                      }
                    } else {
                      return {
                        tag: "p",
                        children: [v]
                      }
                    }
                  })
                } else {
                  return [{
                    tag: "h4",
                    children: [v[1]]
                  }]
                }
              }),
            ])
          }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        }
      )
      const json = await res.json()
      if (!json.ok) {
        throw new Error(json.error)
      }
      console.log(json.result.url)
      await bot.sendMessage(channel, json.result.url)
      return
    }
    for (const chunk of textChunks) {
      logger.info(`Sending chunk ${chunk.length} symbols long`)
      if (chunk.length <= MEDIA_POST_LIMIT && hasMedia) {
        if (sendAsGroup) {
          telegramMedia[0]['caption'] = chunk;
          telegramMedia[0]['parse_mode'] = 'HTML';
          await bot.sendMediaGroup(channel, telegramMedia)
        } else {
          const file = telegramMedia[0]
          switch (file.type) {
            case "photo": {
              await bot.sendPhoto(channel, file.media, {
                'caption': chunk,
                'parse_mode': 'HTML'
              })
              break
            }
            case "video": {
              await bot.sendVideo(channel, file.media, {
                'caption': chunk,
                'parse_mode': 'HTML'
              })
              break
            }
            default: {
              logger.warn(`Runtime error: got invalid media type ${file["type"]}`)
            }
          }
        }
      } else {
        await bot.sendMessage(channel, chunk, {
          'parse_mode': 'HTML',
        })
      }
    }
  } catch (e) {
    const params = {
      telegramMedia,
      media,
      // text,
      // linksText, 
      isLongpost,
      id: post.id
    };
    logger.error(`An error occurred while executing "${sendPost.name}" with ${JSON.stringify(params)}.`);
    logger.error(JSON.stringify(e))
    logger.error(e.stack);
  } finally {
    for (const media of telegramMedia) {
      if (await fsAsync.access(media.media).then(() => true).catch(() => false)) // Check if file exists
        fs.unlink(media.media, (err) => {
          if (err !== null) logger.error(err); else logger.debug("Deleted temporary file")
        })
    }
  }
}

export default sendPost;