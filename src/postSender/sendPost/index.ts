import sendText from './sendText';
import sendPhoto from './sendPhoto';
import sendPhotos from './sendPhotos';

import hasBanWords from '../hasBanWords';
import getLinksText from '../getLinksText';
import parseAttachments from '../parseAttachments';
import prepareText from '../prepareText';
import bot from '../../telegram';
import config from '../../config';
import fs from "fs"
import spawn from 'await-spawn';


async function sendPost(post) {
  const media = await parseAttachments(post);
  const text = prepareText(post.text);
  const { photos, videos } = media;
  const linksText = getLinksText(media, text);
  if (hasBanWords(text) || hasBanWords(linksText)) return;

  if (photos.length === 0) {
    if (text.length + linksText.length === 0) return;
    await sendText(text, linksText);
  } else if (photos.length === 1) {
    await sendPhoto(photos[0], text, linksText);
  } else {
    await sendPhotos(photos, text, linksText);
  }

  if (videos.length !== 0) {
    console.log("Downloading videos")
    for (const video of videos) {
      const channel = config.get('channel');
      if(video.url.includes("youtube") || video.url.includes("youtu.be")) {
        // console.log(`Sending video ${video.url}`)
        // await bot.sendMessage(channel, video.url)
        continue
      }
      console.log(`Downloading video ${video.url}`)
      try {
        const binary = config.get("youtube-dl-binary")
        const filename = `${new Date().getTime()}.tmp`
        console.log(`Downloading video to ${filename} with binary ${binary}`)
        await spawn(binary, ["-o", filename, video.url], {
          "stdio": "inherit"
        })
        console.log("Downloaded video from VK")
        await bot.sendVideo(channel, filename)
        console.log("Uploaded to Telegram")
        fs.unlink(filename, (err) => {
          if (err !== null) console.error(err); else console.log("Deleted temporary file")
        })
      } catch (e) {
        await bot.sendMessage(channel, `Couldn't download video ${video.url}`)
        console.error(e)
      }
    }
    
  }
}

export default sendPost;