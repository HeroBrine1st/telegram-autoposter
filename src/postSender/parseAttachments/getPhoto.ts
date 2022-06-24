import PhotoType from '../types/mediaTypes/PhotoType';

function getPhoto(photo: any): PhotoType {
  // Copy, sort and get last
  return photo.sizes.slice().sort((a: any, b: any) => a.width - b.width).pop().url
}

export default getPhoto;