import PhotoType from './PhotoType';
import LinkType from './LinkType';
import VideoType from './VideoType';
import DocType from './DocType';
import GifType from './GifType';
import CopyrightType from './CopyrightType';
import GroupType from './GroupType';

type MediaType = {
  photos: PhotoType[];
  videos: VideoType[];
  links: LinkType[];
  docs: DocType[];
  gifs: GifType[];
  copyright: CopyrightType;
  group: GroupType;
};

export default MediaType;