import sendPost from './sendPost';
import logger from '../logger';
import { WallWallpostFull } from 'vk-io/lib/api/schemas/objects';

async function send(post: WallWallpostFull) {
  if (post['marked_as_ads'] === 1) return;
  if (post['copy_history']?.length > 0) return;
  if (post.attachments?.some(attachment => attachment.type === 'poll')) return;

  try {
    await sendPost(post);
  } catch (e) {
    logger.error(e);
  }
}

export default send;