import CopyrightType from '../types/mediaTypes/CopyrightType';

function addCopyright(copyright: CopyrightType, linksText: string) {
  if (copyright) {
    linksText += '\n';
    linksText += `\n<i>Источник: <a href="${copyright.url}">${copyright.title}</a></i>`;
  }
  return linksText;
}

export default addCopyright;