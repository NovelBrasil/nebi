const { ChannelType } = require(`discord.js`)
const { createAccount, fetchAccount, updateAccount } = require(`../../utils/account`)
const { addMessage, getMessage } = require(`../../utils/messageApi`)

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} messageCreated
*/
module.exports = async (client, messageCreated) => {
    if (!messageCreated) return
    if (messageCreated.author.bot) return
    if (messageCreated.channel.type == ChannelType.DM) return

    const token = client.tokenApi

    const member = messageCreated.member
    try {
        const account = await fetchAccount(member, token)
        const cooldown = client.addCooldown(member.id, 5)
        if (cooldown) {
            const xp_random = Math.floor(Math.random() * 9) + 1
            const current_xp = account.xp.current_raw
            const new_xp = current_xp + xp_random
            await updateAccount(member, { xp: new_xp }, token)
        }
    }
    catch {
        const joined = member.joinedAt
        joined.setMonth(joined.getMonth() + 1)

        const today = Date.now()

        if (today > joined.getTime()) await createAccount(member, token)
        else {
            const messages = await getMessage(member, token)
            if (messages.count >= 30) await createAccount(member, token)
        }
    }

    await addMessage(member, token)
}