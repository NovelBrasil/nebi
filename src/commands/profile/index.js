const { SlashCommandBuilder } = require(`discord.js`);
const { createCard } = require(`./card`);
const { AttachmentBuilder } = require(`discord.js`);
const { createAccount, fetchAccount } = require(`../../utils/account`);
const { openMenu } = require(`./badges`);
const { openMenuFlag } = require(`./flags`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`profile`)
		.setDescription(`Veja seu profile.`)
		.addSubcommand((sub) =>
			sub
				.setName(`ver`)
				.setDescription(`Card com suas informações.`)
				.addUserOption((user) =>
					user
						.setName(`user`)
						.setDescription(`O usuário cujo card será mostrado.`),
				),
		)
		.addSubcommand((sub) =>
			sub.setName(`criar`).setDescription(`Crie um profile para si.`),
		)
		.addSubcommand((sub) =>
			sub
				.setName(`carteira`)
				.setDescription(`Veja o quanto há na sua carteira.`),
		)
		.addSubcommand((sub) =>
			sub.setName(`medalhas`).setDescription(`Veja sobre as medalhas.`),
		)
		.addSubcommand((sub) =>
			sub.setName(`bandeiras`).setDescription(`Veja sobre as bandeiras.`),
		)
		.addSubcommand((sub) =>
			sub.setName(`fundos`).setDescription(`Veja sobre os planos de fundo.`),
		),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const { options, user } = interaction;
		const token = client.tokenApi;
		const subcommand = options.data[0];
		const u = options.getUser(`user`) || user;
		const member = await interaction.guild.members.fetch({ user: u });
		if (!member) return;
		await interaction.deferReply();

		if (subcommand.name == `criar`) {
			const response = await createAccount(member, token);
			if (response)
				return await interaction.followUp(`Conta criada com sucesso!`);
		}

		const account = await fetchAccount(member, token);

		if (subcommand.name == `ver`) {
			const card = await createCard(member, token, account);
			const attachment = new AttachmentBuilder(card, { name: `profile.png` });
			return await interaction.followUp({ files: [attachment] });
		}

		switch (subcommand.name) {
			case `carteira`:
				return await interaction.followUp({
					content: `Seu saldo é: \`${account.glows}\` ${account.glows == 1 ? `glow` : `glows`}`,
				});
			case `medalhas`:
				return await openMenu(interaction, account.badges);
			case `bandeiras`:
				return await openMenuFlag(interaction);
			default:
				return await interaction.followUp(`Em desenvolvimento.`);
		}
	},
};
