import sendText from './sendText';
import sendPhoto from './sendPhoto';
import sendPhotos from './sendPhotos';

import hasBanWords from '../hasBanWords';
import getLinksText from '../getLinksText';
import parseAttachments from '../parseAttachments';
import prepareText from '../prepareText';
import { exec as ytdl } from 'youtube-dl-exec';
import bot from '../../telegram';
import config from '../../config';
import fs from "fs"


async function sendPost(post) {
  const media = await parseAttachments(post);
  const text = prepareText(post.text);
  const { photos, videos } = media;
  const linksText = getLinksText(media, text);
  if (hasBanWords(text) || hasBanWords(linksText)) return;

  if (photos.length === 0) {
    if (text.length + linksText.length === 0) return;
    sendText(text, linksText);
  } else if (photos.length === 1) {
    sendPhoto(photos[0], text, linksText);
  } else {
    sendPhotos(photos, text, linksText);
  }

  if (videos.length !== 0) {
    for (const video of videos) {
      const channel = config.get('channel');
      try {
        const subprocess = ytdl(video.url)
        const filename = `${new Date().getTime()}.tmp`
        subprocess.stdout.pipe(fs.createWriteStream(filename))
        subprocess.on("exit", (code) => {
          if (code !== 0) {
            bot.sendMessage(channel, `Couldn't download video ${video.url}`).catch(console.error)
            console.error(subprocess.stderr)
          } else {
            bot.sendVideo(channel, filename).catch(console.error)
          }
          fs.unlink(filename, (err) => {
            if (err !== null) console.error(err)
          })
        })
      } catch (e) {
        await bot.sendMessage(channel, `Couldn't download video ${video.url}`)
        console.error(e)
      }
    }
  }
}

export default sendPost;