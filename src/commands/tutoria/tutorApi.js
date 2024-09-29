const { default: axios } = require(`axios`);

/**
 * @param {String} token
 * @returns {Promise<{ tutor: String, roleId: String, tutorId: String, channelId: String }[]>}
 */
const getTutors = async (token) => {
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
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {String} tutor
 * @param {String} token
 * @returns {Promise<{ tutor: String, roleId: String, tutorId: String, channelId: String }>}
 */
const getTutor = async (tutor, token) => {
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
		throw Error(`Erro ao fazer conexão.`);
	}
};

module.exports = { getTutors, getTutor };
