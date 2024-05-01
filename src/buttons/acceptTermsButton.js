const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
} = require(`discord.js`)
const form = require(`../../config/form.json`)
require(`dotenv`).config()
  
let purpleHex = `#D000BA`
  
async function sendMessage(interaction, question, { type, customId, options }) {
    let msg = undefined
    let check = undefined
    if (type == `writer`) {
        msg = await interaction.user.send({ content: `**${question}**` })
        check = await awaitMessage(msg.channel)
    } else {
        let optionsWithEmoji = []
        if (options == undefined) {
            return undefined
        }
        //Variável "v" são os valores que tem no array "options"
        for (const v of options) {
            optionsWithEmoji.push({
                label: v.label,
                value: v.value,
                emoji: undefined,
            })
        }
  
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(`Selecione só uma opção`)
                .setOptions(optionsWithEmoji)
        )
        msg = await interaction.user.send({
            content: `**${question}**`,
            components: [row],
        })
        check = await awaitComponent(msg, customId)
    }
    return check
}
  
async function awaitMessage(channel) {
    const filter = (msg) => msg.content != ``
    const sendedMessage = channel
        .awaitMessages({ max: 1, time: 600_000, errors: [`time`], filter })
        .then(async (msg) => {
            const msgFirst = await msg.first()
            const response = { content: undefined, message: msgFirst }
  
            const m = msgFirst.content
            if (m != undefined) response.content = m
  
            return response
        })
        .catch(console.error)
    return sendedMessage
}
  
async function awaitComponent(message, customId) {
    const filter = (interaction) => interaction.customId === customId
    const interactionResult = message
        .awaitMessageComponent({
            filter,
            time: 600_000,
            errors: [`time`],
        })
        .catch(console.error)
    return interactionResult
}
  
const addCacheAndNextQuestion = (userId, responseCache) => {
    addResponse(userId, responseCache)
}
  
const whileResponses = async (interaction, userId, classification) => {
    let index = 0
    while (true) {
        const f = form[index]
        if (f == undefined) break
        if (f.classification != classification) {
            index++
            continue
        }
        const response = await sendMessage(interaction, f.question, {
            type: f.type,
            customId: f.customId,
            options: f.options,
        })
  
        let responseCache = ``
  
        if (response == undefined) return undefined
  
        if (response instanceof StringSelectMenuInteraction) {
            await response.update({ fetchReply: true })
            const value = response.values[0]
            responseCache = value
        } else {
            responseCache = response.content
        }
  
        addCacheAndNextQuestion(userId, {"index": f.index, "response":responseCache})
  
        index++
    }
    return false
}
  
module.exports = {
    customId: `acceptTerms`,
    async execute(interaction, client) {
        const user = interaction.user
        const userId = user.id
  
        const guild = client.guilds.cache.find(
            (guild) => guild.id == `726290600332230686`
        )
  
        await interaction.deferUpdate().then(async () => {
            let embed = new EmbedBuilder()
                .setColor(purpleHex)
                .setTitle(`Dados do Tutorando`)
            interaction.user.send({ embeds: [embed] })
  
            console.log(userId)
            let whileRes = await whileResponses(interaction, userId, `data`)
            if (whileRes == undefined) {
                return interaction.user.send(
                    `Você demorou muito para responder! Sua matrícula foi cancelada.`
                )
            }
  
            const tutoriaPlus = new EmbedBuilder()
                .setColor(purpleHex)
                .setTitle(`Tutorando+`)
                .setDescription(
                    `Com apenas R$5, você pode se tornar um Tutorando+ dentro da Novel Brasil. Tutorando+ é só uma forma de ajudar o servidor a fazer mais eventos, mais divulgação, novos membros, para a melhora do ambiente do server. \n\nAlém de ajudar o servidor, com essa assinatura mensal você pode garantir os seguintes bônus: \n\n> O tutorando+ tem uma aula extra por semana! Você pode pedir mais uma aula para o seu tutor, basta marcar com ele; \n> Cadeira em roteirismo dentro do currículo em todas as Classes (apesar de tocarmos levemente no assunto "roteiro" no currículo comum, não tem a mesma profundidade da cadeira liberada para o tutorando+).\n\n**Deseja ser um tutorando+?**`
                )
            const next = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`stepTwoForm-yes`)
                    .setEmoji({ id: `1051884168977584139`, name: `ready` })
                    .setLabel(`Sim`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`stepTwoForm-nop`)
                    .setEmoji({ id: `1051884167782219776`, name: `error` })
                    .setLabel(`Não`)
                    .setStyle(ButtonStyle.Danger)
            )
            const msgNext = await interaction.user.send({
                embeds: [tutoriaPlus],
                components: [next],
            })
            const filter = (interaction) =>
                interaction.customId.split(`-`)[0] === `stepTwoForm`
            const interactionResult = await msgNext
                .awaitMessageComponent({
                    filter,
                    time: 600_000,
                    errors: [`time`],
                })
                .catch(console.error)
            if (interactionResult == undefined)
                return interaction.user.send(
                    `Você demorou muito para responder! Sua matrícula foi cancelada.`
                )
            await interactionResult.update({ fetchReply: true })
            const responseStepTwoForm = interactionResult.customId.split(`-`)[1]
            addResponse(userId, {index:4, response:responseStepTwoForm === `yes` ? `Sim` : `Não`})
  
            embed = new EmbedBuilder()
                .setColor(purpleHex)
                .setTitle(`Perguntas para avaliação de conhecimento`)
            interaction.user.send({ embeds: [embed] })
            whileRes = await whileResponses(interaction, userId, `knowledge`)
            if (whileRes == undefined) {
                return interaction.user.send(
                    `Você demorou muito para responder! Sua matrícula foi cancelada.`
                )
            }
  
            //TODO: Enviar formulário
  
            console.log(userId)
            await sendForm(userId, guild)
        })
    },
}
  