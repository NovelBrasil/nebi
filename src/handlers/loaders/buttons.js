const fs = require(`fs`);

class ButtonsHandler {
	/**
	 * @param {import("discord.js").Client} client
	 */
	constructor(client) {
		this.client = client;
	}

	async load() {
		const buttons_path = `src/buttons`;
		const button_files = fs
			.readdirSync(`./${buttons_path}`)
			.filter((files) => files.endsWith(`.js`));
		if (button_files) {
			for (const file of button_files) {
				const path_final = `${process.cwd()}/${buttons_path}/${file}`;
				const button = require(path_final);
				if (!button.customId) continue;
				this.client.buttons.set(button.customId, button);
			}
		}
	}
}

module.exports = ButtonsHandler;
