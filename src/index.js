const { Client, Partials, GatewayIntentBits } = require(`discord.js`)
const chalk = require(`chalk`)
const DiscordConfig = require(`./config/bot`)
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

const token = config.isDevMode() ? process.env.DISCORD_TEST_TOKEN : process.env.DISCORD_MAIN_TOKEN

client.login(token)

console.clear()
console.log(`\u001b[0m`)
console.log(chalk.yellow(`© Novel Brasil | 2020 - ${new Date().getFullYear()}`))
console.log(chalk.yellow(`All rights reserved`))
console.log(`\u001b[0m`)