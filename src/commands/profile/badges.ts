import { Client } from "discord.js";

const { DiscordEmbedMenu, DiscordEmbedMenuPage } = require(
	`@novelbrasil/discord.js-embed-menu`,
);
const { ButtonBuilder, EmbedBuilder, ButtonStyle } = require(`discord.js`);

/**
 * @returns {import("@novelbrasil/discord.js-embed-menu").DiscordEmbedMenuPage}
 */
function getMainPage() {
	const embed = new EmbedBuilder({
		title: `Menu das Medalhas`,
		description: `Escolha uma ação:`,
		fields: [
			{
				name: `📜 Suas Medalhas`,
				value: `Veja e altere suas medalhas.`,
				inline: true,
			},
			{
				name: `❌ Fechar`,
				value: `Fechará o menu.`,
				inline: true,
			},
		],
		author: {
			name: `Informações Profile`,
			iconURL: `https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif`,
		},
	});
	const buttons = {
		"ur-badges": {
			action: `ur-badges`,
			button: new ButtonBuilder()
				.setCustomId(`ur-badges`)
				.setLabel(`Suas Medalhas`)
				.setEmoji(`📜`)
				.setStyle(ButtonStyle.Primary),
		},
		delete: {
			action: `delete`,
			button: new ButtonBuilder()
				.setCustomId(`delete`)
				.setLabel(`Fechar`)
				.setEmoji(`❌`)
				.setStyle(ButtonStyle.Secondary),
		},
	};
	return new DiscordEmbedMenuPage(`main`, embed, undefined, 0, buttons);
}

/**
 * @param {import("discord.js").Client} client
 * @param {{ enabled: boolean, name: string }[]} badges
 * @returns {import("@novelbrasil/discord.js-embed-menu").DiscordEmbedMenuPage}
 */
function getYourBadgesPage(client: Client, badges: {enabled: boolean, name: string}[] = []) {
	const activies = badges
		.filter((b) => b.enabled)
		.map((b) => client.config.emoji.getEmoji(b.name));
	const disabled = badges
		.filter((b) => !b.enabled)
		.map((b) => client.config.emoji.getEmoji(`disable_${b.name}`));

	const embed = new EmbedBuilder({
		title: `Suas Medalhas`,
		description: `**Legendas:**\n↪ Habilitadas: \`\`\`Aparecerá as suas medalhas que estão habilitadas, se tiver alguma.\`\`\`\n↪ Desabilitadas: \`\`\`Aparecerá as suas medalhas que estão desabilitadas, se tiver alguma.\`\`\`\n**Comandos:**\n↪ Habilitar -> \`/medalha habilitar <id>\`\n↪ Desabilitar -> \`/medalha desabilitar <id>\`\n\n${badges.length == 0 ? `\n**Você não tem medalhas.**` : ``}`,
		fields:
			badges.length > 0
				? [
						{
							name: `Habilitadas`,
							value:
								activies.length > 0
									? activies.join(` `)
									: `**Você está com todas medalhas desabilitadas.**`,
							inline: false,
						},
						{
							name: `Desabilitadas`,
							value:
								disabled.length > 0
									? disabled.join(` `)
									: `**Você está com todas medalhas habilitadas.**`,
							inline: false,
						},
					]
				: [],
		author: {
			name: `Informações Profile`,
			iconURL: `https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif`,
		},
	});
	const buttons = {
		main: {
			action: `main`,
			button: new ButtonBuilder()
				.setCustomId(`main`)
				.setLabel(`Voltar`)
				.setEmoji(`⬅️`)
				.setStyle(ButtonStyle.Primary),
		},
		delete: {
			action: `delete`,
			button: new ButtonBuilder()
				.setCustomId(`delete`)
				.setLabel(`Fechar`)
				.setEmoji(`❌`)
				.setStyle(ButtonStyle.Secondary),
		},
	};
	return new DiscordEmbedMenuPage(`ur-badges`, embed, undefined, 1, buttons);
}

/**
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {{ enabled: boolean, name: string }[]} badges
 */
async function openMenu(interaction: Client, badges: { enabled: boolean, name: string }[]) {
	const mainPage = getMainPage();
	const yourBadgesPage = getYourBadgesPage(interaction.client, badges);

	const menu = new DiscordEmbedMenu(interaction, [mainPage, yourBadgesPage]);
	await menu.start({ followUp: true });
}

module.exports = { openMenu };
