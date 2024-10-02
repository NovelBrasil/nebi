const { ChannelType } = require(`discord.js`);
const { createAccount, fetchAccount, updateAccount } = require(
	`../../utils/account`,
);
const { addMessage, getMessage, deleteMessage } = require(
	`../../utils/messageApi`,
);

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
			else {
				const messages = await getMessage(member, token);
				if (messages && messages.count >= 30) {
					await createAccount(member, token);
					await deleteMessage(messages.id, token, client);
				}
				await addMessage(member, token);
			}
			return;
		}
		const cooldown = client.addCooldown(member.id, 10);
		if (cooldown) {
			const xp_random = Math.floor(Math.random() * 9) + 1;
			const current_xp = account.xp;
			const new_xp = current_xp + xp_random;
			await updateAccount(
				account.id,
				{ xp: new_xp, level: account.level },
				token,
				client,
			);
		}
	} catch (err) {
		console.log(err);
	}
};
