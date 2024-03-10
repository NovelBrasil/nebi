/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} oldMessage
 * @param {import("discord.js").Message} newMessage
*/
module.exports = async (client, oldMessage, newMessage) => {
    try {
        if (!oldMessage.content || !newMessage.content) return
        if (oldMessage.content === newMessage.content) return
        if (oldMessage.author.bot) return
        const author = newMessage.author
        const thumbnail = author.avatarURL({ extension: `png`, size: 128 })
        client.sendLog(client, `default`, {
            title: `💬・Mensagem Atualizada`,
            description: `Uma mensagem foi atualizada.`,
            thumbnail,
            fields: [
                {
                    name: `> Autor`,
                    value: `- ${author} (${author.tag})`
                },
                {
                    name: `> Canal`,
                    value: `- ${newMessage.channel} (${newMessage.channel.name})`
                },
                {
                    name: `> Mensagem`,
                    value: `- [Ir até a Mensagem](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`
                },
                {
                    name: `> Mensagem Anterior`,
                    value: `\`\`\`${oldMessage.content.replace(/`/g, `'`)}\`\`\``.slice(0, 4096)
                },
                {
                    name: `> Mensagem Nova`,
                    value: `\`\`\`${newMessage.content.replace(/`/g, `'`)}\`\`\``.slice(0, 4096)
                }
            ]
        })
    }
    catch { /*empty*/ }
}