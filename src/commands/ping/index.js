const {
	SlashCommandBuilder,
	// ButtonStyle,
	// ActionRowBuilder,
	// ButtonBuilder
} = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder().setName(`ping`).setDescription(`TestCommand`),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */

	run: async (client, interaction) => {
		/*const cancel = new ButtonBuilder()
            .setCustomId(`startForm`)
            .setLabel(`Form Test`)
            .setStyle(ButtonStyle.Secondary)

        const row = new ActionRowBuilder()
            .addComponents(cancel)*/
		await interaction.reply({ content: `Pong!`, fetchReply: true });
	},
};
