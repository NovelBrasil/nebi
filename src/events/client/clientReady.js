const { ActivityType } = require(`discord.js`)
const EmojiConfig = require(`../../config/emojis`)

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

    console.log(`[Event] Ready calling.`)
    console.log(`[Token] ${client.tokenApi}`)
    const randomPresence = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [randomPresence], status: `online` })
    setInterval(async function () {
        const randomPresence = activities[Math.floor(Math.random() * activities.length)]
        client.user.setPresence({ activities: [randomPresence], status: `online` })
    }, 3600*1000)
}