import parseAttachments from './parseAttachments';
import prepareText from './prepareText';
import getLinksText from './getLinksText';
import sendPost from './sendPost';
import logger from '../logger';

async function send(post) {
  if (post['marked_as_ads'] === 1) return;
  if (post['copy_history']?.length > 0) return;
  if (post.attachments?.some(attachment => attachment.type === 'poll')) return;

  const media = await parseAttachments(post.attachments);
  const { photos } = media;
  
  const text = prepareText(post.text);
  let linksText = getLinksText(media, text);
  try {
    return await sendPost(photos, text, linksText);
  } catch (e) {
    logger.error(e);
  }
}

export default send;