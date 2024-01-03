const { EmbedBuilder } = require(`discord.js`)

class EmbedHandler {
    /**
    * @param {Client} client
    */
    constructor(client) {
        this.client = client
    }

    load() {
        this.client.templateEmbed = this.#templateEmbed()
    }

    #templateEmbed() {
        return new EmbedBuilder()
            .setColor(this.client.config.getColor(`default`))
            .setFooter({
                text: `Novel Brasil © 2020 - ${new Date().getFullYear()}`,
                iconURL: this.client.config.getIconNB()
            })
            .setTimestamp()
    }
}

module.exports = EmbedHandler