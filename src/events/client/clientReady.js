const { ActivityType } = require(`discord.js`)

/**
 * @param {import("discord.js").Client} client
*/
module.exports = async (client) => {
    const activities = [
        { type: ActivityType.Playing, name: `meu jogo!` },
        { type: ActivityType.Listening, name: `NovelCastBR` },
        { type: ActivityType.Watching, name: `vídeos da Novel Brasil.` },
    ]
    console.log(`[Event] Ready calling.`)
    const randomPresence = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [randomPresence], status: `online` })
    setInterval(async function () {
        const randomPresence = activities[Math.floor(Math.random() * activities.length)]
        client.user.setPresence({ activities: [randomPresence], status: `online` })
    }, 3600*1000)
}