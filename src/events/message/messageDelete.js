/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} oldMessage
*/
module.exports = async (client, messageDeleted) => {
    try {
        if (!messageDeleted) return
        if (messageDeleted.author.bot) return

        const author = messageDeleted.author
        const thumbnail = author.avatarURL({ extension: `png`, size: 128 })

        let content = messageDeleted.content
        if (!content) content = `Nenhum texto encontrado.`
        if (messageDeleted.attachments.size > 0) content = messageDeleted.attachments.first()?.url

        client.sendLog(client, `default`, {
            title: `💬・Mensagem Deletada`,
            description: `Uma mensagem foi deletada.`,
            thumbnail,
            fields: [
                {
                    name: `> Autor`,
                    value: `- ${author} (${author.tag})`
                },
                {
                    name: `> Canal`,
                    value: `- ${messageDeleted.channel} (${messageDeleted.channel.name})`
                },
                {
                    name: `> Mensagem`,
                    value: `\`\`\`${content.replace(/`/g, `'`)}\`\`\``.slice(0, 4096)
                }
            ]
        })
    }
    catch { /*empty*/ }
}