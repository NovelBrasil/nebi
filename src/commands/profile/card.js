const { default: axios } = require(`axios`)
const { fetchAccount } = require(`./account`)
const { numberDecimal } = require(`../../utils/numberFormat`)

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<Buffer>}
*/
const createCard = async (member, token) => {
    const avatar = member.displayAvatarURL({ extension: `png` })
    const joined = member.joinedTimestamp
    const date = new Date(joined)
    const day = numberDecimal(date.getDate())
    const monthNumber = date.getMonth() + 1
    const month = numberDecimal(monthNumber)

    try {
        const account = await fetchAccount(member, token)

        const response = await axios.post(`${process.env.NEBI_API_URL}/profile/${member.id}`, {
            ...account,
            avatar,
            badgesName: [`dev`, `staff`, `nitro`, `verify`],
            joinDate: `${day}/${month}`,
        }, {
            headers: {
                Authorization: token
            }
        })
        if (response.status == 201) {
            const result = response.data.result
            const buffer = Buffer.from(result, `base64`)
            return buffer
        }
    } catch (err) {
        const response = err.response
        if (!response)
            throw Error(err)
        if (response.status == 400)
            throw Error(`UserId em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

module.exports = { createCard }