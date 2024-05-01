const { deleteAccount } = require(`../../utils/account`)
const { deleteMessage } = require(`../../utils/messageApi`)

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").GuildMember} member
*/
module.exports = async (client, member) => {
    try {
        if (!member) return
        if (member.user.bot) return
        const token = client.tokenApi
        await deleteAccount(member, token)
        await deleteMessage(member, token)
    }
    catch { /*empty*/ }
}