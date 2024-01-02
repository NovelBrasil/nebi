class DiscordConfig {
    #DEV_MODE = false
    #COLORS = new Map()

    constructor() {
        this.#COLORS.set(`default`, `FF6432`)
        this.#COLORS.set(`error`, `FF3232`)
        this.#COLORS.set(`success`, `32FF38`)
    }

    setDevMode(bool) {
        this.#DEV_MODE = bool
    }

    isDevMode() {
        return this.#DEV_MODE
    }

    getColor(key) {
        return this.#COLORS.get(key)
    }

}

module.exports = DiscordConfig