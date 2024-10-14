import { CommandInteraction } from "discord.js";

const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require(`discord.js`);
const { fetchAccount, updateAccount } = require("../../utils/account");

/**
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function changeAboutme(interaction: CommandInteraction) {
	const {
		member,
		client: { tokenApi: token },
	} = interaction;
	const account = await fetchAccount(member, token);
	if (!account) throw new Error(`Conta não encontrada!`);
	const modal = new ModalBuilder()
		.setCustomId(`aboutme`)
		.setTitle("Alterar sobre mim");

	const aboutme = new TextInputBuilder()
		.setCustomId("aboutme")
		.setLabel("O que quer que saibam sobre você?")
		.setPlaceholder("Fale sobre o que gosta, quem você é, etc.")
		.setMinLength(5)
		.setMaxLength(100)
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph);

	const row = new ActionRowBuilder().addComponents(aboutme);

	modal.addComponents(row);

	await interaction.showModal(modal);

	const filter = (i) =>
		i.customId === `aboutme` && i.user.id === interaction.user.id;
	try {
		const response = await interaction.awaitModalSubmit({
			filter,
			time: 60_000,
		});
		const aboutme = response.fields.getTextInputValue("aboutme");
		updateAccount(account.id, { aboutme }, token);
		await response.reply({
			content: `Você mudou seu sobre mim!`,
			ephemeral: true,
		});
	} catch (_err) {
		return;
	}
}

module.exports = { changeAboutme };
