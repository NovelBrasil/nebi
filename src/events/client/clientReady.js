const { ActivityType } = require(`discord.js`);
const FormManager = require(`../../manager/form-manager`);
const EmojiConfig = require(`../../config/emojis`);

/**
 * @param {import("discord.js").Client} client
 */
module.exports = async (client) => {
	const activities = [
		{ type: ActivityType.Playing, name: `meu jogo!` },
		{ type: ActivityType.Listening, name: `NovelCastBR` },
		{ type: ActivityType.Watching, name: `vídeos da Novel Brasil.` },
	];

	// Emoji
	const emoji = new EmojiConfig(client);
	client.config.emoji = emoji;

	const token = client.tokenApi;
	// const guildId = client.config.isDevMode() ? process.env.DEV_SERVER_GUILD_ID : process.env.PUBLIC_SERVER_GUILD_ID
	// const guild = client.guilds.cache.find(f => f.id == guildId)
	// const signHandler = client.handlers.get(`sign`)
	// await signHandler.setTopic(token, guild)

	const guildId = client.config.isDevMode()
		? process.env.DEV_SERVER_GUILD_ID
		: process.env.PUBLIC_SERVER_GUILD_ID;
	const guild = client.guilds.cache.find((f) => f.id == guildId);

	try {
		const signHandler = client.handlers.get(`sign`);
		await signHandler.setTopic(token, guild);
	} catch (error) {
		console.error(error);
	}

	const form_manager = new FormManager(client);
	try {
		await form_manager.loadAsync();
	} catch (err) {
		console.error(err);
	}
	client.formManager = form_manager;

	const randomPresence =
		activities[Math.floor(Math.random() * activities.length)];
	client.user.setPresence({ activities: [randomPresence], status: `online` });
	setInterval(async function () {
		const randomPresence =
			activities[Math.floor(Math.random() * activities.length)];
		client.user.setPresence({ activities: [randomPresence], status: `online` });
	}, 3600 * 1000);

	console.log(`[Event] Ready calling.`);
	console.log(`Token => ${token}`);
};
