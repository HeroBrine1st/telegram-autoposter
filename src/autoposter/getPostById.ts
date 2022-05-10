import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects';
import logger from '../logger';
import vk from '../vk';

// For testing purposes

async function getPostById(postId: string): Promise<WallWallpostFull> {
  try {
    const response = await vk.wall.getById({ 'posts': postId });
    return response[0]
  } catch (e) {
    logger.error(`An error occurred while executing "getPostById" with "postId=${postId}".`);
    throw e;
  }
}

export default getPostById;