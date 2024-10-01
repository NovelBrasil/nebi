const { default: axios } = require(`axios`);

/**
 * @param {{ key: String, value: String }} data
 * @param {String} token
 * @param {import("discord.js").Client} client
 * @returns {Promise<String>}
 */
const addData = async (data, token, client) => {
	try {
		const response = await axios.post(
			`${process.env.NEBI_API_URL}/data`,
			data,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		if (response.status == 201) {
			return response.data.message;
		}
	} catch (err) {
		const response = err.response;
		if (response.status == 401) return client.emit(`errorApi`, err, `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`);
		client.emit(`errorApi`, err, `Adicionar Dados`);
	}
};

/**
 * @param {{ key: String, value: String }} data
 * @param {String} token
 * @returns {Promise<String>}
 */
const updateData = async (data, token, client) => {
	try {
		const response = await axios.put(
			`${process.env.NEBI_API_URL}/data/${data.key}`,
			data,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		return response.data.message;
	} catch (err) {
		const response = err.response;
		if (response.status == 401) return client.emit(`errorApi`, err, `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`);
		client.emit(`errorApi`, err, `Atualizar Dados`);
	}
};

/**
 * @param {String} key
 * @param {String} token
 * @returns {Promise<String | undefined>}
 */
const getData = async (key, token, client) => {
	try {
		const { data } = await axios.get(
			`${process.env.NEBI_API_URL}/data/name/${key}`,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		return data.id;
	} catch (err) {
		const response = err.response;
		if (response.status == 401) return client.emit(`errorApi`, err, `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`);
		client.emit(`errorApi`, err, `Pegar Dados`);
	}
};

module.exports = { addData, updateData, getData };
