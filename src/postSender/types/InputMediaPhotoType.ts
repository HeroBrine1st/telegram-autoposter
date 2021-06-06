import PhotoType from './mediaTypes/PhotoType';

type InputMediaPhotoType = {
  'type': 'photo';
  'media': PhotoType;
  'caption'?: string;
  'parse_mode'?: 'HTML';
};

export default InputMediaPhotoType;