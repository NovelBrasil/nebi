const { default: axios } = require(`axios`);

/**
 * @param {{ time: number, multiplier: number }} payload
 * @param {String} token
 * @param {import("discord.js").Client} client
 * @returns {Promise<{ id: string, time: number, multiplier: number }>}
 */
const createBoost = async (payload, token, client) => {
	try {
		const response = await axios.post(
			`${process.env.NEBI_API_URL}/boost`,
			payload,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		if (response.status == 201) return response.data;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Criar Boost`);
	}
};

/**
 * @param {String} id
 * @param {String} token
 * @param {import("discord.js").Client} client
 * @returns {Promise<{ id: String, time: number, multiplier: number, expireIn: number, activeBy: string } | undefined>}
 */
const fetchBoost = async (id, token, client) => {
	try {
		const client = axios.create({
			baseURL: `${process.env.NEBI_API_URL}/boost`,
			headers: {
				Authorization: token,
			},
		});
		const { data, status } = await client.get(`/${id}`);
		if (status === 204) return undefined;
		return data;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Boost`);
	}
};

/**
 * @param {String} id
 * @param {{ expireIn: number, activeBy: String }} boost
 * @param {String} token
 * @param {import("discord.js").Client} client
 * @returns {Promise<String>}
 */
const updateBoost = async (id, boost, token, client) => {
	try {
		if (!id) throw new Error(`id is required`);
		await axios.put(`${process.env.NEBI_API_URL}/boost/${id}`, boost, {
			headers: {
				Authorization: token,
			},
		});
	} catch (err) {
		if (err.response) {
			const response = err.response;
			if (response.status == 401)
				return client.emit(
					`errorApi`,
					err,
					`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
				);
		}
		client.emit(`errorApi`, err, `Atualizar Boost`);
	}
};

/**
 * @param {String} id
 * @param {String} token
 * @param {import("discord.js").Client} client
 * @returns {Promise<Boolean>}
 */
const deleteBoost = async (id, token, client) => {
	try {
		const response = await axios.delete(
			`${process.env.NEBI_API_URL}/user/${id}`,
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
		client.emit(`errorApi`, err, `Deletar Boost`);
	}
};

module.exports = {
	createBoost,
	fetchBoost,
	updateBoost,
	deleteBoost,
};
