const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`embed`)
        .setDescription(`Crie um embed novo.`)
        .addSubcommand(subcommand => subcommand
            .setName(`builder`)
            .setDescription(`Construa um embed usando nosso tools.`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`json`)
            .setDescription(`Construa um embed usando um JSON.`)
            .addStringOption(option => option.setName(`json`).setRequired(true))
        ).setDMPermission(false).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    ,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        
        await interaction.reply({ content: `Pong!`, fetchReply: true })
    },
}