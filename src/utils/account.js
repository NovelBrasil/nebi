const { axios } = require("../services/api");

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<String>}
 */
const createAccount = async (member, token) => {
	const client = member.client;
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
		const response = await axios.post(`/user`, payload, {
			headers: {
				Authorization: token,
			},
		});
		if (response.status == 201) return true;
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Criar Conta`);
	}
};

/**
 * @param {String} token
 * @returns {Promise<{ username: String, aboutMe: String, background: String, flag: String, balance: { glows: Number }, level: { current: Number, next: Number }, xp: { current: Number, max: Number }, badges: { enabled: boolean, name: string }[] }[] | undefined>}
 */
const ranking = async (token, client) => {
	try {
		const {
			data: { position: rank, ...rest },
			status,
		} = await axios.get(`/user/ranking`, {
			headers: {
				Authorization: token,
			},
		});
		if (status === 204) return undefined;
		return { ...rest, rank };
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Conta`);
	}
};

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<{ username: String, aboutMe: String, background: String, flag: String, balance: { glows: Number }, level: { current: Number, next: Number }, xp: { current: Number, max: Number }, badges: { enabled: boolean, name: string }[] } | undefined>}
 */
const fetchAccount = async (member, token) => {
	const client = member.client;
	const userId = member.id;
	try {
		const {
			data: { position: rank, ...rest },
			status,
		} = await axios.get(`/user/${userId}/ranking`, {
			headers: {
				Authorization: token,
			},
		});
		if (status === 204) return undefined;
		return { ...rest, rank };
	} catch (err) {
		const response = err.response;
		if (!response) return;
		if (response.status == 401)
			return client.emit(
				`errorApi`,
				err,
				`FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`,
			);
		client.emit(`errorApi`, err, `Pegar Conta`);
	}
};

/**
 * @param {String} userId
 * @param {{ username: String, aboutme: String, background: String, flag: String, glows: Number, level: Number, xp: Number, badges: { enabled: boolean, name: string }[] }} account
 * @param {String} token
 * @returns {Promise<String>}
 */
const updateAccount = async (userId, account, token, client) => {
	try {
		if (!userId) throw new Error(`userId is required`);
		const response = await axios.put(`/user/${userId}`, account, {
			headers: {
				Authorization: token,
			},
		});
		if (response.status == 200) {
			return response.data.message;
		}
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
		client.emit(`errorApi`, err, `Atualizar Conta`);
	}
};

/**
 * @param {String} userId
 * @param {String} token
 * @returns {Promise<Boolean>}
 */
const deleteAccount = async (userId, token, client) => {
	try {
		const response = await axios.delete(`/user/${userId}`, {
			headers: {
				Authorization: token,
			},
		});
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
		client.emit(`errorApi`, err, `Deletar Conta`);
	}
};

module.exports = {
	createAccount,
	fetchAccount,
	updateAccount,
	deleteAccount,
	ranking,
};
