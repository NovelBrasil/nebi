/* eslint-disable no-case-declarations */
const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const { ranking } = require(`../../utils/account`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`ranking`)
		.setDescription(`Veja os dez mais vagabundos do servidor.`),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const token = client.tokenApi;

		const reply = await interaction.deferReply();
		if (!reply) throw new Error(`Erro ao responder interação.`);

		const response = await ranking(token, client);

		const embed = new EmbedBuilder();
		embed.setTitle(`Os dez melhores de XP`);
		embed.setDescription(
			Object.values(response)
				.filter((f) => f)
				.map((user, index) => {
					return `**${index + 1}º** - ${user.username} - ${user.xp} XP - Level ${user.level}`;
				})
				.join(`\n`),
		);
		embed.setTimestamp();

		await interaction.followUp({ embeds: [embed] });
	},
};
