const { ActivityType } = require(`discord.js`)
const EmojiConfig = require(`../../config/emojis`)
const { getData } = require(`../../commands/info/dataApi`)

/**
 * @param {import("discord.js").Client} client
*/
module.exports = async (client) => {
    const activities = [
        { type: ActivityType.Playing, name: `meu jogo!` },
        { type: ActivityType.Listening, name: `NovelCastBR` },
        { type: ActivityType.Watching, name: `vídeos da Novel Brasil.` },
    ]

    // Emoji
    const emoji = new EmojiConfig(client)
    client.config.emoji = emoji

    const GENERAL_CHANNELS = [`geral1`, `geral2`]

    const token = client.tokenApi
    const guildId = client.config.isDevMode() ? process.env.DEV_SERVER_GUILD_ID : process.env.PUBLIC_SERVER_GUILD_ID
    const guild = client.guilds.cache.find(f => f.id == guildId)

    try {
        for (const key of GENERAL_CHANNELS) {
            const channelId = await getData(key, token)
            if (channelId) {
                const channel = await guild.channels.fetch(channelId)
                if (channel) {
                    const sign = client.handlers.get(`sign`).getSign(key, guild )
                    channel.setTopic(sign)
                }
            }
        }
    } catch { /* empty */ }

    const randomPresence = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [randomPresence], status: `online` })
    setInterval(async function () {
        const randomPresence = activities[Math.floor(Math.random() * activities.length)]
        client.user.setPresence({ activities: [randomPresence], status: `online` })
    }, 3600*1000)

    console.log(`[Event] Ready calling.`)
    console.log(`Token => ${token}`)
}