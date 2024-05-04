const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { getTutor } = require(`./tutorApi`)
const { addStudent, updateStudentTutor, existStudent } = require(`./studentApi`)
const { getData } = require(`../info/dataApi`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`tutoria`)
        .setDescription(`Comando da tutoria`)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`adicionar`)
                .setDescription(`Adicione um novo tutorando.`)
                .addUserOption((option) =>
                    option
                        .setName(`tutorando`)
                        .setDescription(`O user do novo tutorando. Pode usar o id.`)
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option.setName(`tutor`).setDescription(`O tutor do novo tutorando.`)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`alterar`)
                .setDescription(`Altere o tutor de um tutorando.`)
                .addUserOption((option) =>
                    option
                        .setName(`tutorando`)
                        .setDescription(`O user do tutorando. Pode usar o id.`)
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option.setName(`tutor`).setDescription(`O novo tutor do tutorando.`)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`remover`)
                .setDescription(`Remova o tutorando da tutoria.`)
                .addUserOption((option) =>
                    option
                        .setName(`tutorando`)
                        .setDescription(`O user do tutorando. Pode usar o id.`)
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.CreatePrivateThreads)
    ,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        const token = client.tokenApi
        const { options, guild } = interaction
        const subcommand = options.data[0]

        const target = options.getUser(`tutorando`)
        const has = await existStudent(target.id, token)
        const member = await client.guilds.cache.map(async g => await g.members.fetch({ user: target })).at(0)

        let Tutor = `SemTutor`
        let roleId = undefined

        const studentId = await getData(`student`, token)
        if (studentId == undefined) throw Error(`Não foi possível encontrar o id de tutorando.`)
        const studentRole = guild.roles.cache.find((role) => role.id == studentId)

        const classFId = await getData(`classeF`, token)
        if (classFId == undefined) throw Error(`Não foi possível encontrar o id da classe F.`)
        const classFRole = guild.roles.cache.find((role) => role.id == classFId)

        const noClassId = await getData(`noClass`, token)
        if (noClassId == undefined) throw Error(`Não foi possível encontrar o id da classe ?.`)
        const noClassRole = guild.roles.cache.find((role) => role.id == noClassId)

        await interaction.deferReply()

        if (subcommand.name == `adicionar`) {
            const tutorUser = options.getUser(`tutor`)
            if (tutorUser) {
                const tutorData = await getTutor(tutorUser.id, token)
                if (!tutorData.tutor) return await interaction.followUp(`O tutor \`${tutorUser.username}\` não está registrado.`)
                Tutor = tutorData.tutor
                roleId = tutorData.roleId
            }
            if (roleId && !member.roles.cache.has(roleId))
                await member.roles.add(roleId)
            if (!member.roles.cache.has(studentId))
                await member.roles.add(studentRole)

            for (const role of member.roles.cache.values()) {
                if (role.name.includes(`Classe`) && !role.name.includes(`F`)) {
                    await member.roles.remove(role)
                }
            }

            if (!member.roles.cache.has(classFId))
                await member.roles.add(classFRole)

            /* ADD PLANILHA */
            if (has) {
                await updateStudentTutor(target.id, { tutor: Tutor }, token)

                const old_tutor = has.tutor
                const tutorData = await getTutor(old_tutor, token)
                if (member.roles.cache.has(tutorData.roleId))
                    await member.roles.remove(tutorData.roleId)
            } else await addStudent(target.id, { AtualUsername: target.username, Nickname: member.nickname, Tutor }, token)
            return await interaction.followUp(`O \`${target.username}\` foi adicionado como tutorando de **${Tutor}**.`)
        }

        if (subcommand.name == `alterar`) {
            if (!has) return await interaction.followUp(`O tutorando \`${target.username}\` não está registrado.`)

            const old_tutor = has.tutor
            const tutorData = await getTutor(old_tutor, token)
            if (member.roles.cache.has(tutorData.roleId))
                await member.roles.remove(tutorData.roleId)

            const tutorUser = options.getUser(`tutor`)
            if (tutorUser) {
                const tutorData = await getTutor(tutorUser.id, token)
                if (!tutorData.tutor) return await interaction.followUp(`O tutor \`${tutorUser.username}\` não está registrado.`)
                Tutor = tutorData.tutor
                roleId = tutorData.roleId
            }

            if (roleId && !member.roles.cache.has(roleId))
                await member.roles.add(roleId)

            await updateStudentTutor(target.id, { tutor: Tutor }, token)
            return await interaction.followUp(`O \`${target.username}\` foi alterado para **${Tutor}**.`)
        }

        if (subcommand.name == `remover`) {
            if (!has) return await interaction.followUp(`O tutorando \`${target.username}\` não está registrado.`)

            const old_tutor = has.tutor
            const tutorData = await getTutor(old_tutor, token)
            if (member.roles.cache.has(tutorData.roleId))
                await member.roles.remove(tutorData.roleId)

            for (const role of member.roles.cache.values()) {
                if (role.name.includes(`Classe`) && !role.name.includes(`?`))
                    await member.roles.remove(role)
                else if (role.name.includes(`Tutorando`))
                    await member.roles.remove(role)
            }

            if (!member.roles.cache.has(noClassId))
                await member.roles.add(noClassRole)

            await updateStudentTutor(target.id, { tutor: `Inativo` }, token)
            return await interaction.followUp(`O \`${target.username}\` foi removido da tutoria.`)
        }
    },
}