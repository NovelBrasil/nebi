/**
 * @param {import("discord.js").Client} client
 * @param {String} err
 * @param {String} commandName
 * @param {import("discord.js").Interaction} interaction
 * @param {String} type
 */
module.exports = async (client, err, type) => {
	try {
		client.sendLog(client, `error`, {
			title: `💢・Erro de conexão`,
			description: `Erro de ${type}.`,
			fields: [
				{
					name: `> Erro:`,
					value: `\`\`\`${err.message.replace(/`/g, `'`)}\`\`\``.slice(0, 4096),
				},
			],
		});
		if (type === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
			client.sendLog(client, `default`, {
				title: `🚧・Atualizando o Token`,
				description: `O token de autorização expirou, atualizando...`,
			});
			const oldToken = client.tokenApi;
			const tokenHandler = client.handlers.get(`token`);
			if (tokenHandler) await tokenHandler.update();
			if (oldToken === client.tokenApi)
				return client.sendLog(client, `error`, {
					title: `💢・Falha ao atualizar token`,
					description: `Token não foi atualizado.`,
					fields: [
						{
							name: `> Antigo Token:`,
							value: `\`\`\`${oldToken}\`\`\``.slice(0, 4096),
						},
						{
							name: `> Novo Token:`,
							value: `\`\`\`${client.tokenApi}\`\`\``.slice(0, 4096),
						},
					],
				});
			client.sendLog(client, `success`, {
				title: `Atualizado com sucesso o Token`,
				description: `O token de autorização foi atualizado sem problemas.`,
				fields: [
					{
						name: `> Antigo Token:`,
						value: `\`\`\`${oldToken}\`\`\``.slice(0, 4096),
					},
					{
						name: `> Novo Token:`,
						value: `\`\`\`${client.tokenApi}\`\`\``.slice(0, 4096),
					},
				],
			});
		}
	} catch {
		/*empty*/
	}
};
