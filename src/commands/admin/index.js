const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const { fetchAccount, updateAccount } = require(`../../utils/account`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`admin`)
		.setDescription(`Veja seu profile.`)
		.addSubcommand((sub) =>
			sub
				.setName(`glows`)
				.setDescription(`Gerenciar glows.`)
				.addStringOption((option) =>
					option
						.setName(`action`)
						.setDescription(`Ação a ser realizada. Ações: add e remove`)
						.setRequired(true),
				)
				.addUserOption((option) =>
					option
						.setName(`user`)
						.setDescription(`Usuário a ser adicionado/removido os glows.`)
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName(`amount`)
						.setDescription(`Quantidade de glows a ser adicionada/removida.`)
						.setRequired(true),
				),
		)
		.addSubcommand((sub) =>
			sub
				.setName(`medalhas`)
				.setDescription(`Gerenciar medalhas.`)
				.addStringOption((option) =>
					option
						.setName(`action`)
						.setDescription(`Ação a ser realizada. Ações: add e remove`)
						.setRequired(true),
				)
				.addUserOption((option) =>
					option
						.setName(`user`)
						.setDescription(`Usuário a ser adicionado/removido a medalha.`)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName(`medalha`)
						.setDescription(
							`O nome da medalha, se houver dúvida do nameid dela, chame alguém da TI.`,
						)
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const { options } = interaction;
		const token = client.tokenApi;
		const subcommand = options.data[0];
		const u = options.getUser(`user`);
		const action = options.getString(`action`);
		const guild =
			interaction.guild ??
			interaction.client.guilds.cache.get(interaction.guildId);
		const member = await guild?.members.fetch({ user: u });
		if (!member) return;

		const reply = await interaction.deferReply({ ephemeral: true });
		if (!reply) throw new Error(`Erro ao responder interação.`);

		const account = await fetchAccount(member, token);

		switch (subcommand.name) {
			case `glows`: {
				let glows = account.glows;
				const amount = options.getInteger(`amount`);
				if (action == `add`) {
					glows += amount;
				} else {
					glows -= amount;
				}
				await updateAccount(account.id, { glows }, token, client);
				return await interaction.followUp({
					content: `O saldo de <@${member.user.id}> foi alterado. Agora seu saldo é: \`${glows} G$\``,
					ephemeral: true,
				});
			}
			case `medalhas`: {
				let medalhas = account.badges ?? [];
				const medalha = options.getString(`medalha`);
				if (action == `add`) {
					medalhas.push({
						enabled: true,
						name: medalha,
					});
				} else {
					medalhas = medalhas.filter((med) => med.name != medalha);
				}
				await updateAccount(account.id, { badges: medalhas }, token, client);
				return await interaction.followUp({
					content: `Você alterou as medalhas de <@${member.user.id}>.`,
					ephemeral: true,
				});
			}
			default:
				return await interaction.followUp(`Em desenvolvimento.`);
		}
	},
};
