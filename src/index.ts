process.env.NTBA_FIX_319 = '1';

import './validators/telegramValidator';
import './validators/vkValidator';

import './autoposter';

import logger from './logger';

logger.info('The bot is running.');

let firstKill = true;
async function killProcess() {
  if (!firstKill) return;
  logger.info('The bot has stopped.');
  firstKill = false;
  process.exit();
}

process.on('exit', killProcess);
process.on('SIGINT', killProcess);