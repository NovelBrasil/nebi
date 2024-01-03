const { Events } = require(`discord.js`)
const fs = require(`fs`)

class EventHandler {
    constructor(client) {
        this.client = client
    }

    load() {
        fs.readdirSync(`./src/events`).forEach(dirs => {
            const events = fs.readdirSync(`./src/events/${dirs}`).filter(files => files.endsWith(`.js`))
    
            for (const file of events) {
                const event = require(`../../events/${dirs}/${file}`)
                const eventName = file.split(`.`)[0]
                const eventUpperCase = eventName.charAt(0).toUpperCase() + eventName.slice(1)
                if (Events[eventUpperCase] === undefined)
                    this.client.on(eventName, event.bind(null, this.client)).setMaxListeners(0)
                else this.client.on(Events[eventUpperCase], event.bind(null, this.client)).setMaxListeners(0)
            }
        })
    }
}

module.exports = EventHandler