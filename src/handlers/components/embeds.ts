const { EmbedBuilder } = require(`discord.js`);

class EmbedHandler {
	/**
	 * @param {import("discord.js").Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	load() {
		/**
		 * @returns {import("discord.js").EmbedBuilder}
		 */
		this.client.logEmbed = function (color) {
			return new EmbedBuilder().setColor(color).setTimestamp();
		};
	}
}

module.exports = EmbedHandler;
