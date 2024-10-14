import { Client } from "discord.js";

class EmojiConfig {
	#EMOJIS = new Map();

	/**
	 * @param {import("discord.js").Client} client
	 */
	constructor(client: Client) {
		client.emojis.cache.forEach((emoji) => {
			this.#EMOJIS.set(emoji.name, `<:${emoji.identifier}>`);
		});
	}

	/**
	 * @param {String} name
	 * @returns {String}
	 */
	getEmoji(name: string) {
		return this.#EMOJIS.get(name);
	}
}

module.exports = EmojiConfig;
