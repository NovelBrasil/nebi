/* eslint-disable no-case-declarations */
const { ButtonBuilder } = require(`discord.js`)
const config = require(`../config/json/registration.json`)
const { Collection, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonStyle } = require(`discord.js`)
const { getData } = require(`../commands/info/dataApi`)

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
     * @returns {Boolean}
    */
    has(userId) {
        return this.#FORM.has(userId)
    }

    /**
     * @param {String} userId
    */
    delete(userId) {
        this.#FORM.delete(userId)
    }

    /**
     * @param {import("discord.js").ButtonInteraction} interaction
    */
    async send(interaction) {
        const token = this.client.tokenApi
        const form_forum_id = await getData(`forum`, token)
        const guildId = this.client.config.isDevMode() ? process.env.DEV_SERVER_GUILD_ID : process.env.PUBLIC_SERVER_GUILD_ID
        const clientId = this.client.config.isDevMode() ? process.env.DISCORD_TEST_ID : process.env.DISCORD_MAIN_ID
        const guild = this.client.guilds.cache.find(f => f.id === guildId)
        const forum_channel = await guild.channels.fetch(form_forum_id)
        if (forum_channel == undefined) {
            throw Error(`Forum Channel is undefined!`)
        }
        const purple_color = this.client.config.getColor(`form`)
        const user = await guild.members.fetch({ user: interaction.user, force: true })
        if (user == undefined) throw Error(`User is undefined!`)

        const default_tag = [
            forum_channel.availableTags.find((r) => r.name === `Aberto`).id
        ]

        const userId = interaction.user.id
        const tutorando_plus = this.#FORM.get(userId).get(`tutorando|data`) === `yes`
        if (tutorando_plus)
            default_tag.push(forum_channel.availableTags.find((r) => r.name === `Tutorando+`).id)

        const essential_embeds = [
            new EmbedBuilder()
                .setColor(purple_color)
                .setTitle(`Dados do Tutorando`)
                .setDescription(
                    `**User ID**: ${userId}
                    **Idade**: ${this.#getResponseById(userId, `age`)}
                    **Melhores horários**: ${this.#getResponseById(userId, `hour`)}
                    **Tutorando+**: ${this.#getResponseById(userId, `tutorando`)}`
                ),
            new EmbedBuilder().setColor(purple_color).setTitle(`Perguntas Essenciais`)
        ]
        const essential_ids = [`inspiration`, `writing`, `message`, `public`, `objective`]

        const knowledge_ids = []

        for (const [key, value] of this.#FORM.get(userId)) {
            const key_splited = key.split(`|`)
            const id = key_splited.at(0)
            const category = key_splited.at(1)
            if (category === `data`) continue
            const data = config[category][id]
            const question = data.question
            const response = data.type === `select` ? data.options.find(f => f.value === value) : value
            const embed = new EmbedBuilder()
                .setColor(purple_color)
                .setTitle(`${question}`)
                .setDescription(
                    `> ${response}`
                )
            if (essential_ids.includes(id))
                essential_embeds.push(embed)
            knowledge_ids.push(id)
        }

        const thread = await forum_channel.threads.create({
            name: `${interaction.user.username}`,
            message: {
                content: `<@!${interaction.user.id}>`,
                embeds: essential_embeds,
            },
            appliedTags: default_tag,
        })

        const msg_URL = thread.messages.cache
            .filter((msg) => msg.author.id === clientId)
            .map((msg) => msg.url)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`formAccept`)
                .setEmoji({ id: `1051884168977584139`, name: `ready` })
                .setLabel(`Aprovar`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setURL(`${msg_URL.at(0)}`)
                .setLabel(`⬆ Clique para ir ao topo!`)
                .setStyle(ButtonStyle.Link)
        )

        for (let index = 0; index < knowledge_ids.length; index++) {
            const id = knowledge_ids[index]
            const data = config[`knowledge`][id]
            const question = data.question
            const response = this.#getResponseById(userId, id)
            const embed = new EmbedBuilder()
                .setColor(purple_color)
                .setTitle(`${index+1}. ${question}`)
                .setDescription(
                    `> ${response}`
                )
            await thread.send({
                embeds: [embed],
                components: index === (knowledge_ids.length - 1) ? [row] : []
            })
        }

        this.#FORM.delete(interaction.user.id)
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
                console.log(this.#getResponseById(interaction.user.id, id))
            }
        }
        await this.send(interaction)
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

    /**
     * @param {String} userId 
     * @param {String} id
     * @returns {String}
    */
    #getResponseById(userId, id) {
        if (!this.#FORM.has(userId)) return null
        return this.#FORM.get(userId).find((_, k) => k.split(`|`)[0] === id)
    }
}