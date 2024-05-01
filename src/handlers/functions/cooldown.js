class CooldownHandler {
    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.client = client
    }

    #COOLDOWN = new Map()

    load() {
        this.client.addCooldown = this.addCooldown
    }

    /**
    * @param {String} userId
    * @param {number} delay
    * @param {Boolean}
    */
    addCooldown(userId, delay) {
        if (this.#COOLDOWN.has(userId))
            if (Date.now() < this.#COOLDOWN.get(userId))
                return false
        const date = new Date()
        date.setSeconds(date.getSeconds() + delay)
        this.#COOLDOWN.set(userId, date.getDate())
        return true
    }

}

module.exports = CooldownHandler