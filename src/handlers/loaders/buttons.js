const fs = require(`fs`);

const featureFlags = {
	"acceptTermsButton.js": true,
	"approveButton.js": true,
	"openTicket.js": true,
	"startFormButton.js": true,
}

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
				if (file in featureFlags && featureFlags[file] === false) {
					// Skip loading this button
					continue;
				}
				if (!(file in featureFlags)) {
					console.log(`Button ${file} not in featureFlags, please add it to the list.`);
				}
				const path_final = `${process.cwd()}/${buttons_path}/${file}`;
				const button = require(path_final);
				if (!button.customId) continue;
				this.client.buttons.set(button.customId, button);
			}
		}
	}
}

module.exports = ButtonsHandler;
