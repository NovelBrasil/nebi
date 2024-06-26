// eslint-disable-next-line no-unused-vars
const { ActionRowBuilder } = require(`discord.js`)
const { existStudent, addStudent } = require(`../commands/tutoria/studentApi`)
const { getTutors, getTutor } = require(`../commands/tutoria/tutorApi`)
const { StringSelectMenuBuilder } = require(`discord.js`)
const { checkRole } = require(`../utils/discordUtils`)

module.exports = {
    customId: `formAccept`,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    run: async (client, interaction) => {
        const {guild, channel} = interaction
        const token = client.tokenApi

        const studentRole = await checkRole(client, `student`)
        const classFRole = await checkRole(client, `classeF`)

        const target = guild.members.cache.find(
            (member) => member.user.username == channel.name
        )
        if (!target) {
            throw Error(`Usuário não encontrado. Verifique se o nome do fórum é de uma pessoa real ou se ainda está no servidor.`)
        }

        const studentIfExist = await existStudent(target.user.id, token)
        if (studentIfExist) return await interaction.reply({ content: `Esse usuário já fez parte da tutoria. Use o comando para o adicionar novamente.`, ephemeral: true })

        await interaction.deferReply()

        const tutores = (await getTutors(token)).map(tutor => {
            return {
                label: tutor.tutor,
                value: tutor.tutorId
            }
        })

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`select-tutor`)
                .setPlaceholder(`Selecione o tutor!`)
                .addOptions(tutores)
        )

        const message = await interaction.followUp({ content: `Qual será o tutor de <@${target.id}>?`, components: [row] })
        const filter = (interaction) => interaction.customId === `select-tutor`
        try {
            const result = await message.awaitMessageComponent({ filter, time: 600_000, errors: [`time`] })
            await result.update({ fetchReply: true })
            const tutorId = result.values.at(0)
            const tutor_data = await getTutor(tutorId, token)
            await addStudent(target.id, { AtualUsername: target.user.username, Nickname: target.nickname, Tutor: tutor_data.tutor }, token)

            const roleId = tutor_data.roleId
            if (roleId && !target.roles.cache.has(roleId))
                await target.roles.add(roleId)

            if (!target.roles.cache.has(classFRole.id))
                await target.roles.add(classFRole)

            if (!target.roles.cache.has(studentRole.id))
                await target.roles.add(studentRole)

            await message.channel.send(`${target.nickname} foi aprovado com sucesso.`)
        } catch (error) {
            await message.delete()
        }
    },
}
  