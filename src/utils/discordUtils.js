const { getData } = require(`../commands/info/dataApi`)

/**
 * @param {import("discord.js").Client} client
 * @param {String} id
 * @returns {Promise<import("discord.js").Role>}
*/
async function checkRole(client, id) {
    const token = client.tokenApi
    const guild = client.guilds.cache.find(f => f.id === client.guild_id)
    const role_id = await getData(id, token)
    if (role_id == undefined) throw Error(`Não foi possível encontrar o id de ${id}.`)
    return guild.roles.cache.find((role) => role.id == role_id)
}

module.exports = { checkRole }