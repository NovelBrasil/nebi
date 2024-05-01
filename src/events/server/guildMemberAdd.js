/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").GuildMember} member
*/
module.exports = async (client, member) => {
    try {
        if (!member) return
        const token = client.tokenApi
        const guildId = client.config.isDevMode() ? process.env.DEV_SERVER_GUILD_ID : process.env.PUBLIC_SERVER_GUILD_ID
        const guild = member.guild
        if (guild.id != guildId) return
        const signHandler = client.handlers.get(`sign`)
        await signHandler.setTopic(token, guild)
    }
    catch { /*empty*/ }
}