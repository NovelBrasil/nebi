const { default: axios } = require(`axios`)

/**
 * @param {{ key: String, value: String }} data
 * @param {String} token
 * @returns {Promise<String>}
*/
const addData = async (data, token) => {
    try {
        const response = await axios.post(`${process.env.NEBI_API_URL}/data`, data, {
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
            throw Error(`Key ou value em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

/**
 * @param {{ key: String, value: String }} data
 * @param {String} token
 * @returns {Promise<String>}
*/
const updateData = async (data, token) => {
    try {
        const response = await axios.put(`${process.env.NEBI_API_URL}/data/${data.key}`, data, {
            headers: {
                Authorization: token
            }
        })
        return response.data.message
    } catch (err) {
        const response = err.response
        if (response.status == 400)
            throw Error(`Key ou value em falta!`)
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

/**
 * @param {String} key
 * @param {String} token
 * @returns {Promise<String | undefined>}
*/
const getData = async (key, token) => {
    try {
        const response = await axios.get(`${process.env.NEBI_API_URL}/data/${key}`, {
            headers: {
                Authorization: token
            }
        })
        return response.data.result.value
    } catch (err) {
        const response = err.response
        console.error(err)
        if (response.status == 400)
            return undefined
        if (response.status == 401)
            throw Error(`Não foi autorizado!`)
        throw Error(`Erro ao fazer conexão.`)
    }
}

module.exports = { addData, updateData, getData }