class LogHandler {

    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.client = client
    }

    load() {
        /**
        * @param {import("discord.js").Client} client
        * @param {String} color
        * @param {{ 
        * title: string,
        * description: string,
        * image: string,
        * thumbnail: string,
        * fields: import("discord.js").APIEmbedField[]
        *  }} data
        */
        this.client.sendLog = function (client, color = `default`, data) {
            const forumId = `1216122012020510720`
            const serverGuildId = `1046080828716896297`

            const serverDev = client.guilds.cache.find(f => f.id == serverGuildId)
            if (!serverDev) throw Error(`Servidor de desenvolvedores não encontrado.`)
            const logChannel = serverDev.channels.cache.find(f => f.id == forumId)
            if (!logChannel) throw Error(`Canal de logs não encontrado.`)
            if (!logChannel.isThreadOnly()) throw Error(`Esse canal não é um fórum.`)
            const threads = logChannel.threads
            const timeDate = new Date()
            const month = timeDate.getMonth() < 0 ? `${timeDate.getMonth() + 1}` : `0${timeDate.getMonth() + 1}`
            const name = `${timeDate.getDate()}/${month}/${timeDate.getFullYear()}`
            const embed = client.logEmbed(client.config.getColor(color))
            embed.setTitle(data.title)
            embed.setDescription(data.description)
            if (data.image) {
                embed.setImage(data.image)
            }
            if (data.thumbnail) {
                embed.setThumbnail(data.thumbnail)
            }
            if (data.fields) {
                embed.setFields(data.fields)
            }

            const thread = threads.cache.find(f => f.name == name)
            if (!thread) {
                threads.create({
                    name,
                    message: {
                        embeds: [embed]
                    }
                })
            } else thread.send({
                embeds: [embed]
            })
        }
    }
}

module.exports = LogHandler