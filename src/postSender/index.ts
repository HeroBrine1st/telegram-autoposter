import sendPost from './sendPost';
import logger from '../logger';

async function send(post) {
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