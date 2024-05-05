/* eslint-disable no-case-declarations */
const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ticket`)
        .setDescription(`Gerenciar o embed do ticket.`)
        .addSubcommand(sub =>
            sub.setName(`criar`)
                .setDescription(`Cria o embed no chat que o comando for executado.`)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const { options } = interaction
        const subcommand = options.data[0]

        const embed = new EmbedBuilder()
        embed.setTitle(`Atendimento da Novel Brasil`)
        embed.setDescription(`Boas-vindas à sala de atendimento da comunidade.\nPor aqui você pode reportar bugs, pedir suporte sobre pagamentos ou sobre outro assunto que esteja te deixando sem dormir.\n\n**Importante**\n> - Não abra tickets somente para testar, pois isso tomará o tempo da equipe.\n> - Seu ticket será aberto numa thread privada, somente a equipe terá acesso. Não marque ninguém de fora sem autorização.\n\nClique no botão abaixo para abrir um ticket.`)
        embed.setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`ticket`)
                .setLabel(`Abrir Ticket`)
                .setStyle(ButtonStyle.Success)
        )

        switch (subcommand.name) {
        case `criar`:
            await interaction.channel.send({ embeds: [embed], components: [row] })
            return await interaction.reply({ content: `O embed e o componente foram criados.`, ephemeral: true })
        }
    },
}