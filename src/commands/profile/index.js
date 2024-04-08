const { SlashCommandBuilder } = require(`discord.js`)
const { createCard } = require(`./card`)
const { AttachmentBuilder } = require(`discord.js`)
const { createAccount, fetchAccount } = require(`./account`)
const { openMenu } = require(`./badges`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`profile`)
        .setDescription(`Veja seu profile.`)
        .addSubcommand(sub =>
            sub.setName(`ver`)
                .setDescription(`Card com suas informações.`)
                .addUserOption(user =>
                    user.setName(`user`)
                        .setDescription(`O usuário cujo card será mostrado.`)
                )
        )
        .addSubcommand(sub =>
            sub.setName(`criar`)
                .setDescription(`Crie um profile para si.`)
        )
        .addSubcommand(sub =>
            sub.setName(`carteira`)
                .setDescription(`Veja o quanto há na sua carteira.`)
        )
        .addSubcommand(sub =>
            sub.setName(`medalhas`)
                .setDescription(`Gerencie suas medalhas.`)
        )
    ,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const { options, user } = interaction
        const token = client.tokenApi
        const subcommand = options.data[0]
        const u = options.getUser(`user`) || user
        const member = await client.guilds.cache.map(async g => await g.members.fetch({ user: u })).at(0)
        if (!member) return
        await interaction.deferReply()

        if (subcommand.name == `criar`) {
            const response = await createAccount(member, token)
            return await interaction.followUp(response)
        }

        const account = await fetchAccount(member, token)

        if (subcommand.name == `ver`) {
            const card = await createCard(member, token, account)
            const attachment = new AttachmentBuilder(card, { name: `profile.png` })
            return await interaction.followUp({ files: [attachment] })
        }

        if (subcommand.name == `carteira`) {
            return await interaction.followUp({ content: `Seu saldo é: \`${account.balance.glows}\` ${account.balance.glows == 1 ? `glow` : `glows`}` })
        }

        if (subcommand.name == `medalhas`) {
            return await openMenu(interaction, account.badges)
        }
    },
}