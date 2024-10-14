import { Client, CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

const {
	SlashCommandBuilder,
	// ButtonStyle,
	// ActionRowBuilder,
	// ButtonBuilder
} = require(`discord.js`);
const { fetchAccount, updateAccount } = require("../../utils/account");
const { fetchBoost } = require("../admin/boost");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`boost`)
		.setDescription(`Veja seu profile.`)
		.addSubcommand((sub: SlashCommandSubcommandBuilder) =>
			sub
				.setName(`resgatar`)
				.setDescription(`Resgatar um boost.`)
				.addStringOption((option) =>
					option
						.setName(`id`)
						.setDescription(`O id de regaste do boost.`)
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub.setName(`status`).setDescription(`Veja quanto tempo de boost resta.`),
		),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */

	run: async (client: Client, interaction: CommandInteraction) => {
		const { options, member } = interaction;
		const token = client.tokenApi;
		const subcommand = options.data[0];

		const reply = await interaction.deferReply({ ephemeral: true });
		if (!reply) throw new Error(`Erro ao responder interação.`);

		const account = await fetchAccount(member, token);

		switch (subcommand.name) {
			case `resgatar`: {
				if (account.boost)
					return await interaction.followUp({
						content: `Você já possui boost ativo.`,
					});
				const id = options.getString(`id`);
				const boost = await fetchBoost(
					account.boost,
					token,
					interaction.client,
				);
				if (!boost)
					return await interaction.followUp({
						content: `Boost não encontrado.`,
					});
				const { activeBy } = boost;
				if (activeBy !== account.id)
					return await interaction.followUp({
						content: `Você não pode resgatar o boost de outro usuário`,
					});
				await updateAccount(account.id, { boost: id }, token, client);
				return await interaction.followUp({
					content: `Você resgatou o boost de id: \`${id}\``,
				});
			}
			case `status`: {
				if (!account.boost)
					return await interaction.followUp({
						content: `Você não possui boost ativo.`,
					});
				const { expireIn } = await fetchBoost(
					account.boost,
					token,
					interaction.client,
				);
				const expireInSeconds = Math.round(new Date(expireIn).getTime() / 1000);
				return await interaction.followUp({
					content: `Seu boost expira em <t:${expireInSeconds}:R>.`,
				});
			}
		}
	},
};
