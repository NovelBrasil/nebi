const { EmbedBuilder } = require(`discord.js`)

/**
 * @param {import("discord.js").Client} client
 * @param {String} err
 * @param {String} commandName
 * @param {import("discord.js").Interaction} interaction
*/
module.exports = async (client, err, commandName, interaction) => {
    try {
        if (!interaction) return
        const author = interaction.user
        const thumbnail = author.displayAvatarURL({ extension: `png`, size: 128 })
        client.sendLog(client, `error`, {
            title: `💢・Erro`,
            description: `Erro em algum comando.`,
            thumbnail,
            fields: [
                {
                    name: `> Comando`,
                    value: `- ${commandName}`
                },
                {
                    name: `> Executado por`,
                    value: `- ${author} (${author.tag})`
                },
                {
                    name: `> Executado em`,
                    value: `- ${interaction.channel} (${interaction.channel.name})`
                },
                {
                    name: `> Erro:`,
                    value: `\`\`\`${err.message.replace(/`/g, `'`)}\`\`\``.slice(0, 4096)
                }
            ]
        })
        interaction.followUp({ embeds: [
            new EmbedBuilder({
                description: `${client.config.emoji.getEmoji(`error`)} | **${err.message}**`,
            }).setColor(client.config.getColor(`error`))
        ], ephemeral: true })
    }
    catch { /*empty*/ }
}