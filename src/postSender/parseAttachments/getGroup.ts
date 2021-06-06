import vk from '../../vk';
import GroupType from '../types/mediaTypes/GroupType';

const groupCache = {};

async function getGroup(post: any): Promise<GroupType> {
  const id = post['owner_id'];

  if (!(id in groupCache)) {
    const groups = await vk.groups.getById({
      'group_id': Math.abs(id) + ''
    });
    const group = groups[0];
    groupCache[id] = {
      title: group.name,
      url: `https://vk.com/wall${post['owner_id']}_${post['id']}`
    };
  }
  
  return groupCache[id];
}

export default getGroup;