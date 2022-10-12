import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import logger from './logger';

const bot = new TelegramBot(config.get('tokens.telegram'), { polling: true });

bot.on("message", async (msg) => {
    if (msg.chat.id === config.get("adminChatId")) // Do not echo
        return
    let user: string
    if(msg.from != null && msg.from.username != null) {
        user = "@" + msg.from.username
    } else {
        user = "unknown user"
        if (msg.from != null) 
            user += ` (id: ${msg.from.id})`
    }

    logger.info("Got post suggestion from " + user)
    await bot.sendMessage(config.get("adminChatId"), `Suggested post by ${user}:`)
    const sentMsg = await bot.copyMessage(config.get("adminChatId"), msg.chat.id, msg.message_id)
    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: "Accept :white_checkmark:",
                        callback_data: "bruh no data here"
                    }
                ]
            ]
        },
        {
            chat_id: config.get("adminChatId"),
            message_id: sentMsg.message_id
        }
    )
})

bot.on("callback_query", async (query) => {
    if (!query.message) {
        logger.debug(`Ignored event ${query.id} as it has no message attached`)
        return
    }
    await bot.copyMessage(config.get("channel"), query.message.chat.id, query.message!.message_id)
    await bot.answerCallbackQuery(query.id)
})

export default bot;