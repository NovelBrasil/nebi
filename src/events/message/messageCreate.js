const { ChannelType } = require(`discord.js`);
const { createAccount, fetchAccount, updateAccount } = require(
	`../../utils/account`,
);
const { fetchBoost } = require("../../commands/admin/boost");

const addXp = (mensagemTamanho = 1) => {
	const xpAleatorio = Math.floor(Math.random() * 9) + 1;
	const xpPerMessage = Math.floor(mensagemTamanho * 0.1);
	const xpGanho = xpAleatorio + xpPerMessage;
	return xpGanho;
};

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} messageCreated
 */
module.exports = async (client, messageCreated) => {
	if (!messageCreated) return;
	if (messageCreated.author.bot) return;
	if (messageCreated.channel.type == ChannelType.DM) return;

	const token = client.tokenApi;
	const member = messageCreated.member;
	try {
		const account = await fetchAccount(member, token);
		if (!account) {
			const joined = member.joinedAt;
			joined.setMonth(joined.getMonth() + 1);

			const today = new Date();

			if (today > joined) await createAccount(member, token);
			return;
		}
		messageCreated.content = messageCreated.content.replace(/(.)\1+/g, "$1");
		if (messageCreated.content.length < 5) return;
		const messages = await messageCreated.channel.messages.fetch({
			limit: 10,
			before: messageCreated.id,
		});
		const lastMessage = messages.find(
			(msg) => msg.author.id === messageCreated.author.id,
		);
		if (lastMessage && lastMessage.content === messageCreated.content) return;
		if (client.addCooldown(member.id, 10)) {
			let boost = 0;
			if (account.boost) {
				const { expireIn, multiplier } = await fetchBoost(
					account.boost,
					token,
					client,
				);
				const date = new Date(expireIn);
				if (date > new Date()) boost = multiplier;
				else await updateAccount(account.id, { boost: null }, token, client);
			}
			const xp_random = addXp(messageCreated.content.length);
			account.xp += xp_random + xp_random * boost;
			await updateAccount(account.id, { xp: account.xp }, token, client);
		}
	} catch (err) {
		console.log(err);
	}
};
