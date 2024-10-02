const { default: axios } = require(`axios`);

class FlagsConfig {
	#FLAGS = new Map();

	/**
	 * @param {import("discord.js").Client} client
	 */

	// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
	constructor() {}

	/**
	 * @param {String} name
	 * @returns {String}
	 */
	async load() {
		const response = await axios.get(`https://restcountries.com/v3.1/all`);
		if (response.status == 200) {
			for (const data of response.data) {
				const flag = String(data.flags.png)
					.replace(`https://`, ``)
					.split(`/`)[2]
					.replace(`.png`, ``);
				const emoji = String(data.flag);
				if (emoji) {
					this.#FLAGS.set(flag, emoji);
				}
			}
			this.#FLAGS.set(`xm`, `<:flag_xm:1174062877007679528>`);
		}
	}

	/**
	 * @param {String} name
	 * @returns {String}
	 */
	getFlag(name) {
		return this.#FLAGS.get(name);
	}

	/**
	 * @returns {Map}
	 */
	getFlags() {
		return this.#FLAGS;
	}
}

module.exports = FlagsConfig;
