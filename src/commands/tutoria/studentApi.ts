const { default: axios } = require(`axios`);

/**
 * @param {String} userId
 * @param {{ AtualUsername: String, Nickname: String, Tutor: String }} data
 * @param {String} token
 * @returns {Promise<void>}
 */
const addStudent = async (userId, data, token, client) => {
	try {
		await axios.post(`${process.env.NEBI_API_URL}/student/${userId}`, data, {
			headers: {
				Authorization: token,
			},
		});
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
 * @param {String} userId
 * @param {{ tutor: String }} data
 * @param {String} token
 * @returns {Promise<void>}
 */
const updateStudentTutor = async (userId, data, token, client) => {
	try {
		await axios.put(
			`${process.env.NEBI_API_URL}/student/${userId}/data`,
			data,
			{
				headers: {
					Authorization: token,
				},
			},
		);
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
 * @param {String} userId
 * @param {{ tutor: String }} data
 * @param {String} token
 * @returns {Promise<{ id: String, name: String, tutor: String }>}
 */
const existStudent = async (userId, token, client) => {
	try {
		const { data } = await axios.get(
			`${process.env.NEBI_API_URL}/student/${userId}`,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		return data;
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

module.exports = { addStudent, updateStudentTutor, existStudent };
