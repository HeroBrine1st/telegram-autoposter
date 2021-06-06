import PhotoType from '../types/mediaTypes/PhotoType';

async function getPhoto(photo: any): Promise<PhotoType> {
  const sizes = photo.sizes;
  const types = ['w', 'z', 'y', 'x', 'r', 'q', 'p', 'o', 'm', 's'];
  for (let type of types) {
    for (let size of sizes) {
      if (size.type === type) {
        return size.url;
      }
    }
  }
}

export default getPhoto;