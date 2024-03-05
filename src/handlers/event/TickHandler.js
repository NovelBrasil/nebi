module.exports = class TickHandler {

    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.client = client
        this.lastSecond = Date.now()
        this.lastMinute = Date.now()
    }

    load() {
        setInterval(() => {
            this.client.emit(`tickEvent`, `tick`, Date.now())
            if (this.lastSecond + 1000 <= Date.now()) {
                this.client.emit(`tickEvent`, `second`, Date.now())
                this.lastSecond = Date.now()
            }
            if (this.lastMinute + 60000 <= Date.now()) {
                this.client.emit(`tickEvent`, `minute`, Date.now())
                this.lastMinute = Date.now()
            }
        }, 1)
    }
}