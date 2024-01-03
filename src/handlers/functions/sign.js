const topicJson = require(`../../config/json/topicChannel.json`)
const { convertStringToEmoji } = require(`../../utils/convertEmoji`)

class SignHandler {
    
    constructor(client) {
        this.client = client
    }

    load() {}

    #extractString(template, initChar, finalChar) {
        let i = 0
        let data = []
        do {
            if (template[i] == initChar) {
                for (let j = i + 1; j < template.length; j++) {
                    if (template[j] == finalChar) {
                        data[data.length] = template.slice(i + 1, j)
                        i = j + 1
                        break
                    }
                }
            }
        } while (++i < template.length)
        return data
    }

    /**
     * @param {String} id 
     * @param {Guild} guild
     * @returns {String} 
     */
    getSign(id, guild) {
        const text = topicJson[id]
        let rawText = text.replace(`convert`, ``).replace(`convert`, ``)
        return this.#extractString(rawText, `(`, `)`).map((result) => {
            return String(rawText).replace(
                `(${result})`,
                convertStringToEmoji(this.client, result.replace(`{count}`, guild.memberCount))
            )
        }).join()
    }
}

module.exports = SignHandler