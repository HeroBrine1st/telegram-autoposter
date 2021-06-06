import bot from '../../telegram';
import config from '../../config';
import logger from '../../logger';
import textGhunkGenerator from './textChunkGenerator';

async function sendText(text: string, linksText: string) {
  const channel = config.get('channel');
  const posts = [];
  const textChunks = textGhunkGenerator(text, linksText);
  let firstPost = true;
  try {
    for (let chunk of textChunks) {
      if (firstPost) {
        posts.push(await bot.sendMessage(channel, chunk, {
          'parse_mode': 'HTML'
        }));
      } else {
        posts.push(await bot.sendMessage(channel, chunk, {
          'parse_mode': 'HTML',
          'reply_to_message_id': posts[posts.length - 1]['message_id']
        }));
      }
    }
  } catch (e) {
    const params = { text, linksText, posts };
    logger.error(`An error occurred while executing "${sendText.name}" with ${JSON.stringify(params)}.`);
  }
  return posts;
}

export default sendText;