const { EmbedBuilder, ActionRowBuilder, ChannelType, TextInputBuilder, TextInputStyle, ModalBuilder, ThreadAutoArchiveDuration } = require(`discord.js`)

// eslint-disable-next-line no-unused-vars
module.exports = {
    customId: `open-ticket`,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    run: async (client, interaction) => {
        const { user } = interaction

        await interaction.deferReply({ ephemeral: true })

        const modal = new ModalBuilder()
            .setCustomId(`ticket-modal`)
            .setTitle(`Atendimento`)

        const title_input = new TextInputBuilder()
            .setCustomId(`titleInput`)
            .setLabel(`Qual o problema?`)
            .setStyle(TextInputStyle.Short)
        
        modal.addComponents(new ActionRowBuilder().addComponents(title_input))

        await interaction.showModal(modal)

        const filter = (interaction) => interaction.customId === `ticket-modal`
        const modal_interaction = await interaction.awaitModalSubmit({ filter, time: 15_000, errors: [`time`] })
        const title = modal_interaction.fields.getTextInputValue(`titleInput`)
        const thread = await interaction.channel.threads.create({
            name: title,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            type: ChannelType.PrivateThread,
            reason: `Ticket criado por ${interaction.user.username}`,
        })

        const embed = new EmbedBuilder()
        embed.setTitle(title)
        embed.setDescription(`Você abriu um ticket. Por meio desse tópico você poderá conversar com um membro da equipe para te ajudar com quaisquer dúvidas ou problemas. Esse tópico será arquivado após **uma semana de inatividade**.`)
        embed.setAuthor({
            name: user.displayName,
            iconURL: user.displayAvatarURL()
        })
        embed.setTimestamp()

        const message = await thread.send({
            content: `<@${user.id}> support_id`,
            embeds: [embed]
        })

        interaction.followUp(`Seu ticket foi aberto! (Clique aqui)[${message.url}] para ir até lá ou na thread que apareceu abaixo nesse chat.`)
    },
}