const { default: axios } = require(`axios`);

/**
 * @param {String} token
 * @returns {Promise<{ tutor: String, roleId: String, tutorId: String, channelId: String }[]>}
 */
const getTutors = async (token, client) => {
	try {
		const response = await axios.get(`${process.env.NEBI_API_URL}/tutor/all`, {
			headers: {
				Authorization: token,
			},
		});
		if (response.status == 200) {
			return response.data;
		}
	} catch (err) {
		const response = err.response;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Dados`);
	}
};

/**
 * @param {String} tutor
 * @param {String} token
 * @returns {Promise<{ tutor: String, roleId: String, tutorId: String, channelId: String }>}
 */
const getTutor = async (tutor, token, client) => {
	try {
		const response = await axios.get(
			`${process.env.NEBI_API_URL}/tutor/${tutor}`,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		if (response.status == 200) {
			return response.data;
		}
	} catch (err) {
		const response = err.response;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Dados`);
	}
};

module.exports = { getTutors, getTutor };
