/* eslint-disable no-case-declarations */
const { SlashCommandBuilder } = require(`discord.js`)
const { fetchAccount, updateAccount } = require(`../../utils/account`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`bandeira`)
        .setDescription(
            `Gerencie sua bandeira.`
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`trocar`)
                .setDescription(`Troque qual bandeira aparecerá.`)
                .addStringOption((option) =>
                    option
                        .setName(`code`)
                        .setDescription(`O code da país. Exemplo: br, en.`)
                        .setRequired(true)
                )
        ),

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const { options, member } = interaction
        const token = client.tokenApi

        const flagCode = options.get(`code`).value

        const subcommand = options.data[0]

        const account = await fetchAccount(member, token)
        if (!account.flag == flagCode) return await interaction.reply({ content: `Trocar a para atual? Isso não é possível.`, ephemeral: true })

        const flags = interaction.client.config.flags.getFlags()
        const searchFlag = flags.get(flagCode)
        if (!searchFlag) return await interaction.reply({ content: `Esse código não existe!`, ephemeral: true })

        switch (subcommand.name) {
        case `trocar`:
            await updateAccount(member, { flag: flagCode }, token)
            return await interaction.reply({ content: `Você habilitou a medalha ${searchFlag}!`, ephemeral: true })
        }
    },
}