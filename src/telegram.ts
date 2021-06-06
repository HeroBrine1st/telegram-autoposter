import TelegramBot from 'node-telegram-bot-api';
import config from './config';

const bot = new TelegramBot(config.get('tokens.telegram'), { polling: true });

export default bot;