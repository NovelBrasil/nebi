const { Client, Partials, GatewayIntentBits, Collection } = require(`discord.js`)
const chalk = require(`chalk`)
const fs = require(`fs`)
const DiscordConfig = require(`./config/bot`)
const EmojiConfig = require(`./config/emojis`)
const FormManager = require(`./manager/form-manager`)
require(`dotenv`).config(`./.env`)

// const fs = require('fs')

const client = new Client({
    allowedMentions: {
        parse: [
            `users`,
            `roles`
        ],
        repliedUser: true
    },
    autoReconnect: true,
    disabledEvents: [
        `TYPING_START`
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildScheduledEvent
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent
    ],
    restTimeOffset: 0
})

// Config
const config = new DiscordConfig()
config.setDevMode(true)
client.config = config

// Emoji
const emoji = new EmojiConfig(client)
client.config.emoji = emoji

const token = config.isDevMode() ? process.env.DISCORD_TEST_TOKEN : process.env.DISCORD_MAIN_TOKEN

client.commands = new Collection()
client.buttons = new Collection()
client.handlers = new Collection()

// Load handlers
fs.readdirSync(`./src/handlers`).forEach((dir) => {
    fs.readdirSync(`./src/handlers/${dir}`).forEach(async (handler) => {
        const Handler = require(`./handlers/${dir}/${handler}`)
        const HandlerInstance = new Handler(client)
        await HandlerInstance.load()
        client.handlers.set(handler.replace(`.js`, ``), HandlerInstance)
    })
})

client.formManager = new FormManager(client)

client.login(token)

console.log(`\u001b[0m`)
console.log(chalk.yellow(`© Novel Brasil | 2020 - ${new Date().getFullYear()}`))
console.log(chalk.yellow(`All rights reserved`))
console.log(`\u001b[0m`)