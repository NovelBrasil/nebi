const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`TestCommand`)
    ,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.reply({ content: `Pong!`, fetchReply: true })
    },
}