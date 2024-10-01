const { getData } = require(`../../commands/info/dataApi`);
const topicJson = require(`../../config/json/topicChannel.json`);
const { convertStringToEmoji } = require(`../../utils/convertEmoji`);

class SignHandler {
	#GENERAL_CHANNELS = [`geral1`, `geral2`];

	constructor(client) {
		this.client = client;
	}

	// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
	load() {}

	#extractString(template, initChar, finalChar) {
		let i = 0;
		let data = [];
		do {
			if (template[i] == initChar) {
				for (let j = i + 1; j < template.length; j++) {
					if (template[j] == finalChar) {
						data[data.length] = template.slice(i + 1, j);
						i = j + 1;
						break;
					}
				}
			}
		} while (++i < template.length);
		return data;
	}

	/**
	 * @param {String} id
	 * @param {import("discord.js").Guild} guild
	 * @returns {String}
	 */
	#getSign(id, guild) {
		const text = topicJson[id];
		let rawText = text.replace(`convert`, ``).replace(`convert`, ``);
		const extractedText = this.#extractString(rawText, `(`, `)`);
		if (!extractedText.length) return rawText;
		return extractedText
			.map((result) => {
				return String(rawText).replace(
					`(${result})`,
					convertStringToEmoji(
						this.client,
						result.replace(`{count}`, guild.memberCount),
					),
				);
			})
			.join();
	}

	/**
	 * @param {String} token
	 * @param {import("discord.js").Guild} guild
	 * @returns {Promise<void>}
	 */
	async setTopic(token, guild) {
		try {
			for (const key of this.#GENERAL_CHANNELS) {
				const channelId = await getData(key, token, this.client);
				if (channelId) {
					const channel = await guild.channels.fetch(channelId);
					if (channel) {
						const sign = this.#getSign(key, guild);
						channel.setTopic(sign);
					}
				}
			}
		} catch {
			/* empty */
		}
	}
}

module.exports = SignHandler;
