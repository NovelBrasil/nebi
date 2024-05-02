/* eslint-disable no-case-declarations */
const { ButtonBuilder } = require(`discord.js`)
const config = require(`../config/json/registration.json`)
const { Collection, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle } = require(`discord.js`)

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
            this.#FORM.get(userId).set(`${data.id}|${data.category}`, data.response)
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
            const data = config[category][id]
            const question = data.question
            const response = data.type === `select` ? data.options.find(f => f.value === value) : value
            console.log(`Question: ${question}`)
            console.log(`Response: ${response}`)
        }
        this.#FORM.delete(userId)
    }

    /**
     * @param {import("discord.js").ButtonInteraction} interaction
    */
    async start(interaction) {
        const client = interaction.client
        for (const [category, id_map] of Object.entries(config)) {
            const title = category === `data` ? `Dados do Tutorando` : `Perguntas para avaliação de conhecimento`
            const embed = new EmbedBuilder().setColor(client.config.getColor(`form`)).setTitle(title)
            await interaction.user.send({ embeds: [embed] })
            for (const id of Object.keys(id_map)) {
                const response = await this.#sendQuestion(interaction, { category, id, text: title })
                this.add(interaction.user.id, { category, id, response })
            }
        }
        this.send(interaction.user.id)
    }

    // PRIVATE METHODS

    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {{ category: String, id: String, text: String }} data
    */
    async #sendQuestion(interaction, { category, id, text }) {
        const data = config[category][id]
        const client = interaction.client

        if (!data) throw Error(`Algo está errado na configuração da matrícula. Reporte isso para um membro da equipe de TI. Sentimentos muito pelo transtorno.`)
        
        const embed = new EmbedBuilder().setColor(client.config.getColor(`form`))
            .setTitle(data.question)
            .setFooter({ text })
            .setTimestamp()
        if (data.description)
            embed.setDescription(data.description)

        switch (data.type) {
        case `writer`:
        {
            const message = await interaction.user.send({ embeds: [embed] })
            const response = await this.#await(message.channel)
            return response.at(0).content
        } // Using keys to solve statement repetition problem
        case `button`:
        {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`${id}-yes`)
                    .setEmoji({ id: `1051884168977584139`, name: `ready` })
                    .setLabel(`Sim`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`${id}-no`)
                    .setEmoji({ id: `1051884167782219776`, name: `error` })
                    .setLabel(`Não`)
                    .setStyle(ButtonStyle.Danger)
            )
            const message = await interaction.user.send({ embeds: [embed], components: [row] })
            const response = await this.#await(message.channel, id, true)
            await response.update({ fetchReply: true })
            return response.customId.split(`-`)[1]
        } // Using keys to solve statement repetition problem
        case `select`:
            const optionsWithEmoji = []
            for (const v of data.options) {
                optionsWithEmoji.push({
                    label: v.label,
                    value: v.value,
                    emoji: undefined,
                })
            }
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(`Selecione só uma opção`)
                    .setOptions(optionsWithEmoji)
            )
            const message = await interaction.user.send({ embeds: [embed], components: [row] })
            const response = await this.#await(message.channel, id)
            await response.update({ fetchReply: true })
            return response.values.at(0)
        default:
            throw Error(`O tipo não foi encontrado. Reporte isso para um membro da equipe de TI. Sentimentos muito pelo transtorno.`)
        }
    }

    /**
     * @param {import("discord.js").Channel} channel
     * @param {String?} customId
     * @param {boolean?} button
    */
    async #await(channel, customId, button) {
        if (!channel.isDMBased()) return

        const filter = !customId ? 
            (msg) => msg.content != `` : 
            (interaction) => (!button ? interaction.customId : interaction.customId.split(`-`)[0]) === customId

        const result = !customId ? await channel.awaitMessages({ max: 1, time: 600_000, errors: [`time`], filter })
            : await channel.awaitMessageComponent({ filter, time: 600_000, errors: [`time`] })
        
        return result
    }
}