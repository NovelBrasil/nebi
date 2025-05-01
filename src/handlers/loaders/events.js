const { Events } = require(`discord.js`);
const fs = require(`fs`);

const featureFlags = {
	"client/clientReady.js": true,
	"client/interactionCreate.js": true,
	"client/tickEvent.js": true, 
	"custom/buttonExec.js": true, 
	"custom/commandExec.js": true, 
	"custom/errorApi.js": true, 
	"custom/errorCreate.js": true, 
	"message/messageCreate.js": true, 
	"message/messageDelete.js": true, 
	"message/messageUpdate.js": true, 
	"server/guildBanAdd.js": true, 
	"server/guildBanRemove.js": true, 
	"server/guildMemberAdd.js": true, 
	"server/guildMemberRemove.js": true, 
	"server/voiceStateUpdate.js": true,
}

class EventHandler {
	constructor(client) {
		this.client = client;
	}

	load() {
		fs.readdirSync(`./src/events`).forEach((dirs) => {
			const events = fs
				.readdirSync(`./src/events/${dirs}`)
				.filter((files) => files.endsWith(`.js`));

			for (const file of events) {
				const eventFinal = `${dirs}/${file}`
				if (eventFinal in featureFlags && featureFlags[eventFinal] === false) {
					// Skip loading this event
					continue;
				}
				if (!(eventFinal in featureFlags)) {
					console.log(`Event ${eventFinal} not in featureFlags, please add it to the list.`);
				}

				const event = require(`../../events/${dirs}/${file}`);
				const eventName = file.split(`.`)[0];
				const eventUpperCase =
					eventName.charAt(0).toUpperCase() + eventName.slice(1);
				if (Events[eventUpperCase] === undefined)
					this.client
						.on(eventName, event.bind(null, this.client))
						.setMaxListeners(0);
				else
					this.client
						.on(Events[eventUpperCase], event.bind(null, this.client))
						.setMaxListeners(0);
			}
		});
	}
}

module.exports = EventHandler;
