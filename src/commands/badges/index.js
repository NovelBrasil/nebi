/* eslint-disable no-case-declarations */
const { SlashCommandBuilder } = require(`discord.js`);
const { fetchAccount, updateAccount } = require(`../../utils/account`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`medalha`)
		.setDescription(`Gerencie suas medalhas.`)
		.addSubcommand((subcommand) =>
			subcommand
				.setName(`habilitar`)
				.setDescription(`Habilite uma medalha sua.`)
				.addStringOption((option) =>
					option
						.setName(`id`)
						.setDescription(`O id da medalha. Exemplo: nitro.`)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName(`desabilitar`)
				.setDescription(`Desabilite uma medalha sua.`)
				.addStringOption((option) =>
					option
						.setName(`id`)
						.setDescription(`O id da medalha. Exemplo: nitro.`)
						.setRequired(true),
				),
		),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const { options, member } = interaction;
		const token = client.tokenApi;

		const badgeId = options.get(`id`).value;

		const subcommand = options.data[0];

		const account = await fetchAccount(member, token);

		const chooseBadge = account.badges.find((b) => b.name == badgeId);
		if (!chooseBadge)
			return await interaction.reply({
				content: `Você não tem essa medalha!`,
				ephemeral: true,
			});

		switch (subcommand.name) {
			case `habilitar`:
				if (chooseBadge.enabled)
					return await interaction.reply({
						content: `Essa medalha já está habilitada!`,
						ephemeral: true,
					});
				account.badges.at(account.badges.indexOf(chooseBadge)).enabled = true;
				await updateAccount(
					account.id,
					{ badges: account.badges.sort() },
					token,
					client,
				);
				return await interaction.reply({
					content: `Você habilitou a medalha ${chooseBadge.name}!`,
					ephemeral: true,
				});
			case `desabilitar`:
				if (!chooseBadge.enabled)
					return await interaction.reply({
						content: `Essa medalha já está desabilitada!`,
						ephemeral: true,
					});
				account.badges.at(account.badges.indexOf(chooseBadge)).enabled = false;
				await updateAccount(
					account.id,
					{ badges: account.badges.sort() },
					token,
					client,
				);
				return await interaction.reply({
					content: `Você desabilitou a medalha ${chooseBadge.name}!`,
					ephemeral: true,
				});
		}
	},
};
