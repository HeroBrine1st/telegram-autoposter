import GroupType from '../types/mediaTypes/GroupType';

function addGroup(group: GroupType, linksText: string) {
  if (group) {
    linksText += '\n';
    linksText += `\nПост в <b><a href="${group.url}">${group.title}</a></b>`;
  }
  return linksText;
}

export default addGroup;