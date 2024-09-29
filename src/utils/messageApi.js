const { default: axios } = require(`axios`);

/**
 * @param {import("discord.js").GuildMember} member
 * @param {import("axios").AxiosInstance} instance
 * @returns {Promise<String>}
 */
const createMessage = async (member, instance) => {
	const userid = member.id;
	try {
		const response = await instance.post(`/`, {
			userid,
			count: 0,
			last: Date.now(),
		});
		return response.status == 201;
	} catch (err) {
		const response = err.response;
		if (response.status == 400) throw Error(`${response.data.message}`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {import("axios").AxiosInstance} instance
 * @returns {Promise<Boolean>}
 */
const putMessage = async (userId, data, instance) => {
	try {
		const response = await instance.put(`/${userId}`, data);
		return response.status == 204;
	} catch (err) {
		const response = err.response;
		if (response.status == 400) throw Error(`${response.data.message}`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {import("axios").AxiosInstance | String} instance
 * @returns {Promise<{ message: String, count: number, last: number }>}
 */
const getMessage = async (member, instance) => {
	const userId = member.id;
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
	} catch (_err) {
		return undefined;
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 */
const addMessage = async (member, token) => {
	try {
		const client = axios.create({
			baseURL: `${process.env.NEBI_API_URL}/message`,
			headers: {
				Authorization: token,
				"Content-Type": `application/json`,
			},
		});

		const get = await getMessage(member, client);
		if (!Object.keys(get).length) {
			await createMessage(member, client);
		} else
			await putMessage(
				get.id,
				{ count: get.count + 1, last: Date.now() },
				client,
			);
	} catch (err) {
		console.log(err);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<Boolean>}
 */
const deleteMessage = async (member, token) => {
	const userId = member.id;
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
		console.log(err);
		if (response.status == 400) throw Error(`UserId ou username em falta!`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

module.exports = { addMessage, getMessage, deleteMessage };
