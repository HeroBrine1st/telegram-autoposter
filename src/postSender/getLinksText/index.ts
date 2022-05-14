import MediaType from '../types/mediaTypes/MediaType';

import pipe from '../../utils/pipe';
import curry from '../../utils/curry';

import addLinks from './addLinks';
import addVideos from './addVideos';
import addDocs from './addDocs';
import addGifs from './addGifs';
import addCopyright from './addCopyright';
import addGroup from './addGroup';

function getLinksText(media: MediaType, text: string): string {
  const { links, docs, gifs, copyright, group, videos } = media;

  const curriedAddLinks = curry(addLinks)(links, text);
  const curriedAddVideos = curry(addVideos)(videos, text);
  const curriedAddDocs = curry(addDocs)(docs, text);
  const curriedAddGifs = curry(addGifs)(gifs, text);
  const curriedAddCopyright = curry(addCopyright)(copyright);
  const curriedAddGroup = curry(addGroup)(group);

  const result = pipe(
    curriedAddLinks,
    curriedAddVideos,
    curriedAddDocs,
    curriedAddGifs,
    curriedAddCopyright,
    curriedAddGroup
  )('');
  
  return result;
}

export default getLinksText;