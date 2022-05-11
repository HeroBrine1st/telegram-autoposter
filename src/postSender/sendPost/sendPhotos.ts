import PhotoType from '../types/mediaTypes/PhotoType';
import InputMediaPhotoType from '../types/InputMediaPhotoType';

import bot from '../../telegram';
import config from '../../config';
import logger from '../../logger';

import textGhunkGenerator, {PHOTO_POST_LIMIT} from './textChunkGenerator';

async function sendPhotos(photos: PhotoType[], text: string, linksText: string) {
  const channel = config.get('channel');
  const posts = [];
  const mediaPhotos: InputMediaPhotoType[] = photos.map(photo => ({
    type: 'photo',
    media: photo
  }));
  
  const textChunks = textGhunkGenerator(text, linksText, true);

  try {
    for (const chunk of textChunks) {
      console.log(`Sending chunk ${chunk.length} symbols long`)
      if(chunk.length <= PHOTO_POST_LIMIT) {
        mediaPhotos[0]['caption'] = chunk;
        mediaPhotos[0]['parse_mode'] = 'HTML';
        posts.push(await bot.sendMediaGroup(channel, mediaPhotos));
      } else {
        posts.push(await bot.sendMessage(channel, chunk, {
          'parse_mode': 'HTML',
          // 'reply_to_message_id': posts[posts.length - 1]['message_id']
        }));
      }
    }
  } catch (e) {
    const params = { photos, text, linksText, posts };
    logger.error(`An error occurred while executing "${sendPhotos.name}" with ${JSON.stringify(params)}.`);
    logger.error(e)
  }
  return posts;
}

export default sendPhotos;