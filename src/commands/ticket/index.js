/* eslint-disable no-case-declarations */
const { SlashCommandBuilder, StringSelectMenuBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder } = require(`discord.js`)
const ticket_values = require(`../../config/json/ticket.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ticket`)
        .setDescription(`Gerenciar o embed do ticket.`)
        .addSubcommand(sub =>
            sub.setName(`criar`)
                .setDescription(`Cria o embed no chat que já foi informado no banco de dados.`)
        )
        .addSubcommand(sub =>
            sub.setName(`atualizar`)
                .setDescription(`Atualiza o embed no chat que já foi informado no banco de dados.`)
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
        embed.setDescription(`Boas-vindas à sala de atendimento da comunidade.\nPor aqui você pode reportar bugs, pedir suporte sobre pagamentos ou sobre outro assunto que esteja te deixando sem dormir.\n**Importante**\n> - Não abra tickets somente para testar, pois isso tomará o tempo da equipe.\n- Seu ticket será aberto numa thread privada, somente a equipe terá acesso. Não marque ninguém de fora sem autorização.\n\nSelecione uma das opções abaixo para iniciar o atendimento.`)
        embed.setFooter()

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`ticket`)
                .setPlaceholder(`Selecione uma das opções`)
                .setOptions(ticket_values)
        )

        switch (subcommand.name) {
        case `criar`:
            await interaction.channel.send({ embeds: [embed], components: [row] })
            return await interaction.reply({ content: `O embed e o componente foram criados.`, ephemeral: true })
        case `atualizar`:
            const message = interaction.channel.messages.cache.find(f => f.author.id === client.bot_id)
            if (!message) return await interaction.reply({ content: `Você precisa primeiro gerar a mensagem para então atualizar.`, ephemeral: true })
            await message.edit({ embeds: [embed], components: [row] })
            return await interaction.reply({ content: `O embed e o componente foram atualizados.`, ephemeral: true })
        }
    },
}