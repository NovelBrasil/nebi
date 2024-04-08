class EmojiConfig {
    #EMOJIS = new Map()

    /**
     * @param {import("discord.js").Client} client  
     */
    constructor(client) {
        client.emojis.cache.forEach(emoji => {
            this.#EMOJIS.set(emoji.name, `<:${emoji.identifier}>`)
        })
    }

    /**
     * @param {String} name
     * @returns {String}
     */
    getEmoji(name) {
        return this.#EMOJIS.get(name)
    }
}

module.exports = EmojiConfig