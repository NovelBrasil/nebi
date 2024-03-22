const { default: axios } = require(`axios`)
const { fetchAccount } = require(`./account`)

/**
 * @param {import("discord.js").GuildMember} member
 * @param {String} token
 * @returns {Promise<Buffer>}
*/
const createCard = async (member, token) => {
    const username = member.displayName
    const avatar = member.displayAvatarURL({ extension: `png` })
    const joined = member.joinedTimestamp
    const date = new Date(joined)
    const day = date.getDate() >= 10 ? `${date.getDate()}` : `0${date.getDate()}`
    const monthNumber = date.getMonth() + 1
    const month = monthNumber >= 10 ? `${monthNumber}` : `0${monthNumber}`

    try {
        const account = await fetchAccount(member, token)
        const aboutMe = account.aboutme
        const glows = account.balance.glows
        const currExp = account.xp.current
        const targExp = account.xp.max
        const level = account.level.current
        const background = account.background
        const flag = account.flag

        const response = await axios.post(`${process.env.NEBI_API_URL}/profile/${member.id}`, {
            badgesName: [`dev`, `staff`, `nitro`, `verify`],
            avatar,
            username,
            aboutMe,
            level,
            glows,
            currExp,
            targExp,
            rank: 1,
            joinDate: `${day}/${month}`,
            background,
            flag
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
        if (response.status == 400)
            throw Error(`UserId em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

module.exports = { createCard }