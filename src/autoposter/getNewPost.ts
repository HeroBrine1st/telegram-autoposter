import logger from '../logger';
import vk from '../vk';

const lastPosts = {};

async function getNewPost(groupId: number) {
  try {
    const response = await vk.wall.get({ 'owner_id': -groupId, 'count': 2 });
    if (response.count === 0) {
      lastPosts[groupId] = 0;
      return;
    }

    let currentPost = response.items[0];
    if (response.count > 1 && currentPost['is_pinned']) {
      currentPost = response.items[1];
    }

    const lastPost = lastPosts[groupId];
    if (lastPost === currentPost.id) return;

    lastPosts[groupId] = currentPost.id;
    if (lastPost === undefined) return;

    return currentPost;
  } catch (e) {
    logger.error(`An error occurred while executing "getNewPost" with "groupId = ${groupId}".`);
  }
}

export default getNewPost;