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
        const subprocess = await ytdl(video.url)
        if (subprocess.exitCode !== 0) {
          await bot.sendMessage(channel, `Couldn't download video ${video.url}`)
          console.error(subprocess.stderr)
        } else await bot.sendVideo(channel, subprocess.stdout)
      } catch (e) {
        await bot.sendMessage(channel, `Couldn't download video ${video.url}`)
        console.error(e)
      }
    }
  }
}

export default sendPost;