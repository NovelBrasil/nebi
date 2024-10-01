const { readJSON, createJSON, updateJSON } = require(`../../utils/fileUtils`);

const axios = require(`axios`).default;

module.exports = class TokenHandler {
	/**
	 * @param {import("discord.js").Client} client
	 */
	constructor(client) {
		this.userId = process.env.NEBI_API_USERID;
		this.apiKey = process.env.NEBI_API_KEY;
		this.client = client;
	}

	async load() {
		this.client.tokenApi = await this.token();
	}

	async update() {
		this.client.tokenApi = await this.token(true);
	}

	/**
	 * @returns {Promise<String>}
	 */
	async #newToken() {
		try {
			const response = await axios.post(
				`${process.env.NEBI_API_URL}/auth/signup`,
				{
					userid: this.userId,
					apiKey: this.apiKey,
				},
			);
			return response.data[`token`];
		} catch (err) {
			console.error(err);
			return `Erro ao tentar criar conexão.`;
		}
	}

	/**
	 * @param {String} path
	 * @param {Boolean} noToken
	 * @returns {Promise<String | undefined}
	 */
	async #generateToken(path) {
		try {
			const read = readJSON(path);

			if (!Object.keys(read).length) {
				const token = await this.#newToken();
				const data = { token };
				createJSON(path, data);
				return token;
			}

			if (Object.keys(read).length) {
				return read[`token`];
			}
		} catch (err) {
			console.error(err);
			return undefined;
		}
	}

	/**
	 * @returns {Promise<String | undefined}
	 */
	async token(update = false) {
		const path = `./src/config/json/token.json`;
		try {
			if (update) {
				const token = await this.#newToken();
				const newData = { token };
				updateJSON(path, newData);
				return token;
			}
			return await this.#generateToken(path);
		} catch (err) {
			console.error(err);
			return undefined;
		}
	}
};
