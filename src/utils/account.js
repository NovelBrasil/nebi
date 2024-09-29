const { default: axios } = require(`axios`);

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<String>}
 */
const createAccount = async (member, token) => {
	const username = member.displayName;
	const userid = member.id;
	try {
		const payload = {
			aboutme: `Aqui onde ficará o sobre mim`,
			background: `default`,
			badges: [],
			flag: `br`,
			glows: 0,
			level: 1,
			username: username,
			userid: userid,
			xp: 0,
		};
		const response = await axios.post(
			`${process.env.NEBI_API_URL}/user`,
			payload,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		if (response.status == 201) return true;
	} catch (err) {
		const response = err.response;
		if (response.status == 400) throw Error(`${response.data.message}`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<{ username: String, aboutMe: String, background: String, flag: String, balance: { glows: Number }, level: { current: Number, next: Number }, xp: { current: Number, max: Number }, badges: { enabled: boolean, name: string }[] } | undefined>}
 */
const fetchAccount = async (member, token) => {
	const userId = member.id;
	try {
		const client = axios.create({
			baseURL: `${process.env.NEBI_API_URL}/user`,
			headers: {
				Authorization: token,
			},
		});
		const {
			data: { position: rank, ...rest },
		} = await client.get(`/${userId}/ranking`);
		return { ...rest, rank };
	} catch (err) {
		const response = err.response;
		if (response.status == 400)
			throw Error(`${response.data.message} | ${response.data.id}`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {{ username: String, aboutMe: String, background: String, flag: String, glows: Number, level: Number, xp: Number, badges: { enabled: boolean, name: string }[] }} account
 * @param {String} token
 * @returns {Promise<String>}
 */
const updateAccount = async (userId, account, token) => {
	try {
		const response = await axios.put(
			`${process.env.NEBI_API_URL}/user/${userId}`,
			account,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		if (response.status == 200) {
			return response.data.message;
		}
	} catch (err) {
		const response = err.response;
		console.log(response);
		if (response.status == 400) throw Error(`UserId ou username em falta!`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<Boolean>}
 */
const deleteAccount = async (member, token) => {
	const userId = member.id;
	try {
		const response = await axios.delete(
			`${process.env.NEBI_API_URL}/user/${userId}`,
			{
				headers: {
					Authorization: token,
				},
			},
		);
		return response.status == 204;
	} catch (err) {
		const response = err.response;
		if (response.status == 400) throw Error(`UserId ou username em falta!`);
		if (response.status == 401) throw Error(`Não foi autorizado!`);
		throw Error(`Erro ao fazer conexão.`);
	}
};

module.exports = { createAccount, fetchAccount, updateAccount, deleteAccount };
