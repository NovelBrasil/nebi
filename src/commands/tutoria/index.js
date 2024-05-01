const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { getTutor } = require(`./tutorApi`)
const { addStudent, updateStudentTutor, existStudent } = require(`./studentApi`)

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
        const { options } = interaction
        const subcommand = options.data[0]

        const target = options.getUser(`tutorando`)
        const has = await existStudent(target.id, token)

        if (subcommand.name == `adicionar`) {
            const tutorUser = options.getUser(`tutor`)
            let Tutor = `SemTutor`
            if (tutorUser) {
                const tutorData = await getTutor(tutorUser.id, token)
                if (!tutorData.tutor) return await interaction.reply(`O tutor \`${tutorUser.username}\` não está registrado.`)
                Tutor = tutorData.tutor
            }
            const member = await client.guilds.cache.map(async g => await g.members.fetch({ user: target })).at(0)
            if (has) await updateStudentTutor(target.id, { tutor: Tutor }, token)
            else await addStudent(target.id, { AtualUsername: target.username, Nickname: member.nickname, Tutor }, token)
            return await interaction.reply(`O \`${target.username}\` foi adicionado como tutorando de **${Tutor}**.`)
        }

        if (subcommand.name == `alterar`) {
            if (!has) return await interaction.reply(`O tutorando \`${target.username}\` não está registrado.`)
            const tutorUser = options.getUser(`tutor`)
            let tutor = `SemTutor`
            if (tutorUser) {
                const tutorData = await getTutor(tutorUser.id, token)
                if (!tutorData.tutor) return await interaction.reply(`O tutor \`${tutorUser.username}\` não está registrado.`)
                tutor = tutorData.tutor
            }
            await updateStudentTutor(target.id, { tutor }, token)
            return await interaction.reply(`O \`${target.username}\` foi alterado para **${tutor}**.`)
        }

        if (subcommand.name == `remover`) {
            if (!has) return await interaction.reply(`O tutorando \`${target.username}\` não está registrado.`)
            await updateStudentTutor(target.id, { tutor: `Inativo` }, token)
            return await interaction.reply(`O \`${target.username}\` foi removido da tutoria.`)
        }
    },
}