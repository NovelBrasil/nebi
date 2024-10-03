const { default: axios } = require(`axios`);

/**
 * @param {import("discord.js").GuildMember} member
 * @param {import("axios").AxiosInstance} instance
 * @returns {Promise<String>}
 */
const createMessage = async (member, instance) => {
	const userid = member.id;
	const client = member.client;
	try {
		const response = await instance.post(`/`, {
			userid,
			count: 0,
			last: Date.now(),
		});
		return response.status == 201;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Criar Mensagem`);
	}
};

/**
 * @param {String} userId
 * @param {import("axios").AxiosInstance} instance
 * @returns {Promise<Boolean>}
 */
const putMessage = async (userId, data, instance, client) => {
	try {
		const response = await instance.put(`/${userId}`, data);
		return response.status == 204;
	} catch (err) {
		const response = err.response;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Atualizar Mensagem`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {import("axios").AxiosInstance | String} instance
 * @returns {Promise<{ message: String, count: number, last: number }>}
 */
const getMessage = async (member, instance) => {
	const userId = member.id;
	const client = member.client;
	try {
		const response =
			typeof instance == "string"
				? await axios.get(
						`${process.env.NEBI_API_URL}/message/userid/${userId}`,
						{
							headers: {
								Authorization: instance,
							},
						},
					)
				: await instance.get(`/userid/${userId}`);
		return response.data;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Mensagem`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 */
const addMessage = async (member, token) => {
	const client = member.client;
	try {
		const instance = axios.create({
			baseURL: `${process.env.NEBI_API_URL}/message`,
			headers: {
				Authorization: token,
				"Content-Type": `application/json`,
			},
		});

		const get = await getMessage(member, instance, client);
		if (!get || !Object.keys(get).length) {
			await createMessage(member, instance, client);
		} else
			await putMessage(
				get.id,
				{ count: get.count + 1, last: Date.now() },
				instance,
				client,
			);
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Criar Mensagem`);
	}
};

/**
 * @param {String} userId
 * @param {String} token
 * @returns {Promise<Boolean>}
 */
const deleteMessage = async (userId, token, client) => {
	try {
		const response = await axios.delete(
			`${process.env.NEBI_API_URL}/messages/${userId}`,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		return response.status == 204;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Deletar Mensagem`);
	}
};

module.exports = { addMessage, getMessage, deleteMessage };
