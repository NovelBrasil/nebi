import { Client, CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const { getData, addData, updateData } = require(`./dataApi`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`set`)
		.setDescription(
			`Armazenar informações cruciais para o funcionamento do bot.`,
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand
				.setName(`cargo`)
				.setDescription(`Adicionar um cargo ao armazenamento.`)
				.addStringOption((option) =>
					option
						.setName(`chave`)
						.setDescription(`A chave que armazenará a informação.`)
						.setRequired(true),
				)
				.addRoleOption((option) =>
					option
						.setName(`valor`)
						.setDescription(
							`A informação, no caso, o cargo que deseja armazenar.`,
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
			subcommand
				.setName(`canal`)
				.setDescription(`Adicionar um canal ao armazenamento.`)
				.addStringOption((option) =>
					option
						.setName(`chave`)
						.setDescription(`A chave que armazenará a informação.`)
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName(`valor`)
						.setDescription(
							`A informação, no caso, o canal que deseja armazenar.`,
						)
						.setRequired(true),
				),
		),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */

	run: async  (client: Client, interaction: CommandInteraction) => {
		const { options } = interaction;
		const token = client.tokenApi;
		const subcommand = options.data[0];
		const optionGet = options.get(`valor`);
		const key = options.get(`chave`).value;

		const value =
			subcommand.name == `canal` ? optionGet.channel.id : optionGet.role.id;
		const data = await getData(key, token, client);
		if (data) await updateData({ key, value }, token, client);
		else
			await addData(
				{
					id: value,
					guildid: interaction.guildId,
					name: key,
					category: subcommand.name,
				},
				token,
				client,
			);

		let markResult = `<#${value}> foi`;
		if (subcommand.name == `cargo`) {
			markResult = `<@&${value}> foi`;
		}

		interaction.reply({
			content: `O ${markResult} adicionado no banco de dados!`,
			ephemeral: true,
		});
	},
};
