const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const { fetchAccount, updateAccount } = require(`../../utils/account`);
const ms = require("ms");
const { createBoost, deleteBoost } = require("./boost");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`admin`)
		.setDescription(`Veja seu profile.`)
		.addSubcommand((sub) =>
			sub
				.setName(`boost`)
				.setDescription(`Gerenciar boost.`)
				.addStringOption((option) =>
					option
						.setName(`action`)
						.setDescription(`Ação a ser realizada. Ações: add e remove`)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName(`id`)
						.setDescription(`O id de regaste do boost.`)
						.setRequired(false),
				)
				.addStringOption((option) =>
					option
						.setName(`tempo`)
						.setDescription(
							`O tempo deverá ser número + tipo, por exemplo: 1s, 1m, 1h, 1d.`,
						)
						.setRequired(false),
				)
				.addIntegerOption((option) =>
					option
						.setName(`multiplier`)
						.setDescription(`O multiplicador do XP.`)
						.setRequired(false),
				),
		)
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
		const action = options.getString(`action`);
		if (subcommand.name == `boost`) {
			// NÃO ESQUECER DE FAZER PRA VERIFICAR SE AS OPÇÕES EXISTEM
			if (action === "add") {
				const multiplier = options.getInteger(`multiplier`);
				if (multiplier < 1) {
					return await interaction.reply({
						content: `O multiplicador deve ser maior que 1.`,
						ephemeral: true,
					});
				}
				const time = ms(options.getString(`tempo`));
				if (!time) {
					return await interaction.reply({
						content: `O tempo inserido é inválido.`,
						ephemeral: true,
					});
				}
				const boost = await createBoost({ multiplier, time }, token, client);
				return await interaction.reply({
					content: `Você criou um boost de ${multiplier}x por ${time}. O id de resgate do boost é: \`${boost.id}\``,
					ephemeral: true,
				});
			} else if (action === "remove") {
				const id = options.getString(`id`);
				if (!id) {
					return await interaction.reply({
						content: `Você deve inserir o id de regaste do boost.`,
						ephemeral: true,
					});
				}
				await deleteBoost(id, token, client);
				return await interaction.reply({
					content: `Você removeu o boost de id: \`${id}\``,
					ephemeral: true,
				});
			}
		}
		const u = options.getUser(`user`);
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
