const { readJSON, createJSON, updateJSON } = require(`../../utils/fileUtils`)

const axios = require(`axios`).default

module.exports = class TokenHandler {

    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.userId = process.env.NEBI_API_USERID
        this.apiKey = process.env.NEBI_API_KEY
        this.client = client
    }

    async load() {
        this.client.tokenApi = await this.token()
    }

    /**
     * @returns {Promise<String>}
    */
    async #newToken() {
        try {
            const response = await axios.post(`${process.env.NEBI_API_URL}/auth/token/${this.userId}`, {
                key: this.apiKey
            })
            if (response.status == 201)
                return response.data[`token`]
            else return response.data[`message`]
        } catch {
            return `Erro ao tentar criar conexão.`
        }
    }

    /**
     * @param {String} token 
     * @returns {Promise<String | boolean>}
    */
    async #checkToken(token) {
        try {
            const response = await axios.get(`${process.env.NEBI_API_URL}/auth/token`, {
                headers: {
                    Authorization: token
                }
            })
            if (response.status == 200)
                return response.data[`expired`]
            else return response.data[`message`]
        } catch {
            throw Error(`Erro ao tentar criar conexão.`)
        }
    }

    /**
     * @param {String} path
     * @param {Boolean} noToken
     * @returns {Promise<String | undefined}
    */
    async #generateToken(path, noToken = false) {
        try {
            const read = readJSON(path)
            console.log(!read)
            console.log(noToken)

            if (!read && !noToken) {
                const token = await this.#newToken()
                const data = { token }
                createJSON(path, data)
                return token
            }

            if (read && noToken) {
                const token = await this.#newToken()
                const newData = { token }
                updateJSON(path, newData)
                return token
            } else {
                const oldToken = read[`token`]
                if (!oldToken) return await this.#generateToken(path, true)
                const expired = await this.#checkToken(oldToken)
                if (expired) {
                    console.log(expired)
                    return await this.#generateToken(path, true)
                }
                return oldToken
            }
        } catch { return undefined }
    }

    /**
     * @returns {Promise<String | undefined}
    */
    async token() {
        const path = `./src/config/json/token.json`
        try {
            return await this.#generateToken(path)
        } catch { return undefined }
    }

}