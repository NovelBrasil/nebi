const { SlashCommandBuilder } = require(`discord.js`)
const { createCard } = require(`./card`)
const { AttachmentBuilder } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`profile`)
        .setDescription(`Veja seu profile.`)
        .addSubcommand(sub =>
            sub.setName(`card`)
                .setDescription(`Card com suas informações.`)
                .addUserOption(user =>
                    user.setName(`user`)
                        .setDescription(`Veja o card de outra pessoa`)
                )
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

        if (subcommand.name == `card`) {
            await interaction.deferReply()
            const card = await createCard(member, token)
            const attachment = new AttachmentBuilder(card, { name: `profile.png` })
            return await interaction.followUp({ files: [attachment] })
        }
    },
}