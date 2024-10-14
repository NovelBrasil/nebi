class CooldownHandler {
	/**
	 * @param {import("discord.js").Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	load() {
		const COOLDOWN = new Map();
		this.client.addCooldown = function (userId, delay) {
			if (COOLDOWN.has(userId))
				if (new Date() < COOLDOWN.get(userId)) return false;
			const date = new Date();
			date.setSeconds(date.getSeconds() + delay);
			COOLDOWN.set(userId, date);
			return true;
		};
	}
}

module.exports = CooldownHandler;
