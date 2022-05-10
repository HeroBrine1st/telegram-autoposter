import PhotoType from '../types/mediaTypes/PhotoType';

import bot from '../../telegram';
import config from '../../config';
import logger from '../../logger';

import textGhunkGenerator from './textChunkGenerator';

async function sendPhoto(photo: PhotoType, text: string, linksText: string) {
  const channel = config.get('channel');
  const posts = [];
  const textChunks = textGhunkGenerator(text, linksText, true);
  let firstPost = true;
  try {
    for (const chunk of textChunks) {
      if (firstPost) {
        posts.push(await bot.sendPhoto(channel, photo, {
          'caption': chunk,
          'parse_mode': 'HTML'
        }));
        firstPost = false;
      } else {
        posts.push(await bot.sendMessage(channel, chunk, {
          'parse_mode': 'HTML',
          'reply_to_message_id': posts[posts.length - 1]['message_id']
        }));
      }
    }
  } catch (e) {
    const params = { photo, text, linksText, posts };
    logger.error(`An error occurred while executing "${sendPhoto.name}" with ${JSON.stringify(params)}.`);
  }
  return posts;
}

export default sendPhoto;