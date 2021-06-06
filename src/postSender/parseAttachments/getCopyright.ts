import CopyrightType from '../types/mediaTypes/CopyrightType';

function getCopyright(copyright: any): CopyrightType {
  if (copyright) {
    return {
      title: copyright.name,
      url: copyright.link
    };
  }
}

export default getCopyright;