import GifType from '../types/mediaTypes/GifType';

async function getGif(gif: any): Promise<GifType> {
  return {
    title: gif.title,
    url: gif.url
  };
}

export default getGif;