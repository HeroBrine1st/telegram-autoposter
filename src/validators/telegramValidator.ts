import bot from '../telegram';
import config from '../config';
import logger from '../logger';

(async () => {
  if (!config.get('tokens.telegram')) {
    logger.error('Telegram bot token is not specified.');
    process.kill(process.pid, 'SIGINT');
  }
  
  try {
    await bot.getMe();
  } catch (e) {
    logger.error('Telegram bot token is incorrect.');
    process.kill(process.pid, 'SIGINT');
  }
  
  try {
    const channel = await bot.getChat(config.get('channel'));
    config.set('channel', channel.id);
  } catch (e) {
    logger.error('Invalid channel specified or the bot is not a member of this channel.');
    process.kill(process.pid, 'SIGINT');
  }
})();