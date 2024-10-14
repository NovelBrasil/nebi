/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").User} user
 */
module.exports = async (client, _, user) => {
	try {
		if (!user) return;
		if (user.bot) return;

		const thumbnail = user.avatarURL({ extension: `png`, size: 128 });

		client.sendLog(client, `default`, {
			title: `🛑・Usuário Banido`,
			description: `Um usuário foi banido.`,
			thumbnail,
			fields: [
				{
					name: `> Usuário`,
					value: `- ${user} (${user.tag})`,
				},
			],
		});
	} catch {
		/*empty*/
	}
};
