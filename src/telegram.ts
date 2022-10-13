import TelegramBot, { Message } from 'node-telegram-bot-api';
import config from './config';
import logger from './logger';

const bot = new TelegramBot(config.get('tokens.telegram'), { polling: true });

bot.on("message", async (msg) => {
    if (msg.chat.id === config.get("adminChatId")) // Do not echo
        return
    if(config.get("adminChatId") === 0) // Disable
        return

    try {
        if (!msg.from)
        await bot.sendMessage(config.get("adminChatId"), "Got post suggestion by unknown user (could not get ID of author):")
        const sentMsg = await bot.copyMessage(config.get("adminChatId"), msg.chat.id, msg.message_id)
        await bot.editMessageReplyMarkup(
            {
                inline_keyboard: [
                    [
                        {
                            text: "Accept",
                            callback_data: `${(msg.from ? msg.from.id : 0)}`
                        }
                    ],
                    (msg.from ? [
                        {
                            text: "Show post author",
                            url: `tg://user?id=${msg.from.id}`
                        }
                    ] : [
                        
                    ])
                ]
            },
            {
                chat_id: config.get("adminChatId"),
                message_id: sentMsg.message_id
            }
        )
    } catch(e) {
        logger.error("An error occurred while processing suggestion from user:")
        logger.error(e)
        try { // This framework is not tolerant to errors so an inner try is here..
            await bot.sendMessage(msg.chat.id, "An error occurred while processing your message.")
        } catch(e2) {
            logger.error("Another error occurred while trying to tell user about error above:")
            logger.error(e2)
        }
    }
})

bot.on("callback_query", async (query) => {
    const authorId = +query.data
    if (!query.message) {
        logger.debug(`Ignored event ${query.id} as it has no message attached`)
        return
    }
    if(authorId == NaN) {
        logger.debug(`Ignored event ${query.id} as it is forged`)
        return
    }
    try {
        const msg = await bot.copyMessage(config.get("channel"), query.message.chat.id, query.message!.message_id)
        const chat = await bot.getChat(config.get("channel"))
        await bot.editMessageReplyMarkup({
            inline_keyboard: [
                (chat.username ? [{
                    text: "Show message in channel",
                    url: `https://t.me/${chat.username}/${msg.message_id}`
                    }] : []),
                (authorId != 0 ? [{
                    text: "Show post author",
                    url: `tg://user?id=${authorId}`
                }] : [])
            ]
        },
            {
                chat_id: query.message.chat.id,
                message_id: query.message!.message_id
            }
        )
        await bot.answerCallbackQuery(query.id)
    } catch(e) {
        logger.error("An error occurred while sending approved message to channel:")
        logger.error(e)
        try {
            await bot.answerCallbackQuery(query.id, {
                text: "An error occurred while sending message to channel. You should manually check whether it is sent.",
                show_alert: true
            })
        } catch(e2) {
            logger.error("Another error occurred while trying to tell user about error above:")
            logger.error(e2)
            logger.error("Usually it can be ignored if bot is just started")
        }
    }
})

export default bot;