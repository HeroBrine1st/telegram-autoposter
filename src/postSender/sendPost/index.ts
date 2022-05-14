
import hasBanWords from '../hasBanWords';
import getLinksText from '../getLinksText';
import parseAttachments from '../parseAttachments';
import prepareText from '../prepareText';
import bot from '../../telegram';
import config from '../../config';
import fs from "fs"
import downloadMedia from './downloadMedia';
import textGhunkGenerator, { MEDIA_POST_LIMIT } from './textChunkGenerator';
import logger from '../../logger';
import { InputMedia } from 'node-telegram-bot-api';
import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects';


async function sendPost(post: WallWallpostFull) {
  console.log(`Sending post ${post.id}`)
  const media = await parseAttachments(post);
  const text = prepareText(post.text);
  const { photos } = media;
  const videos = media.videos.filter(it => (!it.url.includes("youtube") && !it.url.includes("youtu.be")))
  const linksText = getLinksText(media, text);
  if (hasBanWords(text) || hasBanWords(linksText)) return;

  const channel = config.get('channel');
  const telegramMedia: InputMedia[] = photos.map(photo => ({
    type: 'photo',
    media: photo
  }));

  let errorText = "\n\n"
  for (const video of videos) {
    try {
      telegramMedia.push({
        "type": "video",
        "media": await downloadMedia(video.url)
      })
    } catch (e) {
      logger.error(`Couldn't download video ${video.url}`)
      errorText += `Couldn't download video ${video.url}`
    }
  }

  const hasMedia = telegramMedia.length !== 0
  const sendAsGroup = telegramMedia.length >= 2
  const textChunks = textGhunkGenerator(text + linksText + errorText, hasMedia);

  try {
    for (const chunk of textChunks) {
      console.log(`Sending chunk ${chunk.length} symbols long`)
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
    const params = { photos, text, linksText };
    logger.error(`An error occurred while executing "${sendPost.name}" with ${JSON.stringify(params)}.`);
    logger.error(e)
  } finally {
    for (const video of telegramMedia.filter(it => it.type === "video")) {
      fs.unlink(video.media, (err) => {
        if (err !== null) logger.error(err); else logger.debug("Deleted temporary file")
      })
    }
  }
}

export default sendPost;1