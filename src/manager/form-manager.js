const { Collection } = require(`discord.js`)
const config = require(`../config/json/registration.json`)

module.exports = class FormManager {

    /**
     * @type {Collection<String, Collection<String, String>>}
    */
    #FORM = new Collection()

    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.client = client
    }

    /** 
     * @param {String} userId
     * @param {{ id, category, response }} data
     */
    add(userId, data) {
        if (this.#FORM.has(userId))
            this.#FORM.get(userId).set(data.id, data.response)
        else this.#FORM.set(userId, new Collection([[`${data.id}|${data.category}`, data.response]]))
    }

    /**
     * @param {String} userId
    */
    delete(userId) {
        this.#FORM.delete(userId)
    }

    /**
     * @param {String} userId
    */
    send(userId) {
        for (const [key, value] of this.#FORM.get(userId)) {
            const key_splited = key.split(`|`)
            const id = key_splited.at(0)
            const category = key_splited.at(1)
            const question = config[category][id].question
            console.log(`Question: ${question}`)
            console.log(`Response: ${value}`)
        }
        this.#FORM.delete(userId)
    }
}