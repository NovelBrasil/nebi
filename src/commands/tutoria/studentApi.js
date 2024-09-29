const { default: axios } = require(`axios`);

/**
 * @param {String} userId
 * @param {{ AtualUsername: String, Nickname: String, Tutor: String }} data
 * @param {String} token
 * @returns {Promise<void>}
 */
const addStudent = async (userId, data, token) => {
	try {
		await axios.post(`${process.env.NEBI_API_URL}/student/${userId}`, data, {
			headers: {
				Authorization: token,
			},
		});
	} catch (err) {
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {String} userId
 * @param {{ tutor: String }} data
 * @param {String} token
 * @returns {Promise<void>}
 */
const updateStudentTutor = async (userId, data, token) => {
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
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {String} userId
 * @param {{ tutor: String }} data
 * @param {String} token
 * @returns {Promise<{ id: String, name: String, tutor: String }>}
 */
const existStudent = async (userId, token) => {
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
		console.log(err);
		throw Error(`Erro ao fazer conexão.`);
	}
};

module.exports = { addStudent, updateStudentTutor, existStudent };
