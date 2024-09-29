// eslint-disable-next-line no-unused-vars
const FormManager = require(`../manager/form-manager`);

module.exports = {
	customId: `acceptTerms`,

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").ButtonInteraction} interaction
	 */
	run: async (client, interaction) => {
		/**
		 * @type {FormManager}
		 */
		const form_manager = client.formManager;
		const userId = interaction.user.id;
		await interaction.deferUpdate();
		if (form_manager.has(userId))
			return await interaction.reply(`Você já aceitou os termos.`);
		try {
			await form_manager.start(interaction);
		} catch (error) {
			form_manager.delete(userId);
			console.error(error);
			if (error.message)
				return await interaction.user.send({ content: error.message });
			else
				return await interaction.user.send({
					content: `Você não respondeu o questionário a tempo.`,
				});
		}
	},
};
