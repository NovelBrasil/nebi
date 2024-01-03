class DiscordConfig {
    #DEV_MODE = false
    #ICON_NB = `https://cdn.discordapp.com/attachments/1191805530277150772/1191805623612997812/1613491164437.png?ex=65a6c67b&is=6594517b&hm=e10d7d293370d969484ad7f2f79f5a19a052894ab44ddd559716a1ac0fda8b1f&`
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

    getIconNB() {
        return this.#ICON_NB
    }

}

module.exports = DiscordConfig