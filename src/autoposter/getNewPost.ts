import logger from '../logger';
import vk from '../vk';

const lastPosts = {};

async function getNewPost(groupId: number) {
  try {
    const response = await vk.wall.get({ 'owner_id': groupId, 'count': 2 });
    let currentPost = response['items'][0];
    if (currentPost['is_pinned']) {
      currentPost = response['items'][1];
    }
  
    const lastPost = lastPosts[groupId];
    if (lastPost === currentPost['id']) return;
    lastPosts[groupId] = currentPost['id'];
    if (!lastPost) return;

    return currentPost;
  } catch (e) {
    logger.error(`An error occurred while executing "getNewPost" with "groupId = ${groupId}".`);
  }
}

export default getNewPost;