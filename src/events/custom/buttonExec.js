/**
 * @param {import("discord.js").Client} client
 * @param {String} commandName
 * @param {import("discord.js").Interaction} interaction
*/
module.exports = async (client, commandName, interaction) => {
    try {
        if (!interaction) return
        const author = interaction.user
        const thumbnail = author.displayAvatarURL({ extension: `png`, size: 128 })
        client.sendLog(client, `success`, {
            title: `🛠・Executado`,
            description: `Botão executado.`,
            thumbnail,
            fields: [
                {
                    name: `> Botão`,
                    value: `- ${commandName}`
                },
                {
                    name: `> Executado por`,
                    value: `- ${author} (${author.tag})`
                },
                {
                    name: `> Executado em`,
                    value: `- ${interaction.channel} (${interaction.channel.name})`
                }
            ]
        })
    }
    catch { /*empty*/ }
}