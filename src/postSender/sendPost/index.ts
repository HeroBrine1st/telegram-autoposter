
import hasBanWords from '../hasBanWords';
import getLinksText from '../getLinksText';
import parseAttachments from '../parseAttachments';
import prepareText from '../prepareText';
import bot from '../../telegram';
import config from '../../config';
import fs, { promises as fsAsync } from "fs"
import downloadMedia from './downloadMedia';
import textGhunkGenerator, { MEDIA_POST_LIMIT } from './textChunkGenerator';
import logger from '../../logger';
import { InputMedia } from 'node-telegram-bot-api';
import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects';


async function sendPost(post: WallWallpostFull) {
  logger.info(`Sending post ${post.owner_id}_${post.id}`)
  const media = await parseAttachments(post);
  const text = prepareText(post.text);
  const { photos } = media;
  const videos = media.videos.filter(it => (!it.url.includes("youtube") && !it.url.includes("youtu.be")))
  media.videos = media.videos.filter(it => it.url.includes("youtube") || it.url.includes("youtu.be"))
  if (hasBanWords(text)) return;

  const channel = config.get('channel');
  const telegramMedia: InputMedia[] = [];
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

  const linksText = getLinksText(media, text);
  if (hasBanWords(linksText)) return;

  const hasMedia = telegramMedia.length !== 0
  const sendAsGroup = telegramMedia.length >= 2
  const textChunks = textGhunkGenerator(text + linksText, hasMedia);

  try {
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
    const params = { telegramMedia, media, text, linksText, id: post.id };
    logger.error(`An error occurred while executing "${sendPost.name}" with ${JSON.stringify(params)}.`);
    logger.error(JSON.stringify(e))
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