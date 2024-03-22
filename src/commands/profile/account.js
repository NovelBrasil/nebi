const { default: axios } = require(`axios`)

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<String>}
*/
const createAccount = async (member, token) => {
    const username = member.displayName
    const userId = member.id
    try {
        const response = await axios.post(`${process.env.NEBI_API_URL}/user`, { userId, username }, {
            headers: {
                Authorization: token
            }
        })
        if (response.status == 201) {
            return response.data.message
        }
    } catch (err) {
        const response = err.response
        if (response.status == 400)
            throw Error(`UserId ou username em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<{ username: String, aboutme: String, background: String, flag: String, balance: { glows: Number }, level: { current: Number, next: Number }, xp: { current: Number, max: Number }, badges: Number[] }>}
*/
const fetchAccount = async (member, token) => {
    const userId = member.id
    try {
        const response = await axios.get(`${process.env.NEBI_API_URL}/user/${userId}`, {
            headers: {
                Authorization: token
            }
        })
        if (response.status == 200) {
            return response.data.data
        }
    } catch (err) {
        const response = err.response
        if (response.status == 400)
            throw Error(`UserId ou username em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}


module.exports = { createAccount, fetchAccount }