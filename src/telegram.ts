import TelegramBot, { Message } from 'node-telegram-bot-api';
import config from './config';
import logger from './logger';

const bot = new TelegramBot(config.get('tokens.telegram'), { polling: true });

bot.on("message", async (msg) => {
    if (msg.chat.id === config.get("adminChatId")) // Do not echo
        return
    if(config.get("adminChatId") === 0) // Disable
        return
    if(msg.text && msg.text.startsWith("/start"))
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
                            callback_data: `accept;${(msg.from ? msg.from.id : 0)}`
                        }
                    ],
                    [
                        {
                            text: "Deny and remove (user won't be notified)",
                            callback_data: `deny`
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
        await bot.sendMessage(msg.chat.id, "Спасибо за активность! Ваш пост принят на рассмотрение.", {
            reply_to_message_id: msg.message_id
        })
    } catch(e) {
        logger.error("An error occurred while processing suggestion from user:")
        logger.error(e)
        try { // This framework is not tolerant to errors so an inner try is here..
            await bot.sendMessage(msg.chat.id, "Произошла ошибка при обработке вашего поста. Попробуйте позже или попробуйте предложить другой пост.")
        } catch(e2) {
            logger.error("Another error occurred while trying to tell user about error above:")
            logger.error(e2)
        }
    }
})

bot.on("callback_query", async (query) => {
    
    if (!query.message) {
        logger.debug(`Ignored event ${query.id} as it has no message attached`)
        return
    }

    if(query.message.chat.id != config.get("adminChatId"))
        return
    const data = query.data.split(";")
    switch(data[0]) { // Button type
        case "accept": {
            try {
                const authorId = +data[1]
                if(authorId == NaN) {
                    logger.debug(`Ignored event ${query.id} as it is forged (${query.data})`)
                    return
                }
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
            break
        }
        case "deny": {
            try {
                await bot.deleteMessage(query.message.chat.id, `${query.message.message_id}`)
                await bot.answerCallbackQuery(query.id)
            } catch(e) {
                logger.error("An error occurred deleting denied message:")
                logger.error(e)
                try {
                    await bot.answerCallbackQuery(query.id, {
                        text: "An error occurred deleting denied message",
                        show_alert: true
                    })
                } catch(e2) {
                    logger.error("Another error occurred while trying to tell user about error above:")
                    logger.error(e2)
                }
            }
        }
    }
    
})

export default bot;