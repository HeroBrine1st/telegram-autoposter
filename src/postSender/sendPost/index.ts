import PhotoType from '../types/mediaTypes/PhotoType';

import sendText from './sendText';
import sendPhoto from './sendPhoto';
import sendPhotos from './sendPhotos';

import hasBanWords from '../hasBanWords';

async function sendPost(
  photos: PhotoType[] = [],
  text: string,
  linksText: string
) {
  if (text.length + linksText.length === 0) return;
  if (hasBanWords(text) || hasBanWords(linksText)) return;

  if (photos.length === 0) {
    return sendText(text, linksText);
  } else if (photos.length === 1) {
    return sendPhoto(photos[0], text, linksText);
  } else {
    return sendPhotos(photos, text, linksText);
  }
}

export default sendPost;