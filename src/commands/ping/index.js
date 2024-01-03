const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`TestCommand`)
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        await interaction.reply({ content: `Pong!`, fetchReply: true })
    },
}