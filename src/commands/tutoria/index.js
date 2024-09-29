const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonStyle,
	ButtonBuilder,
} = require(`discord.js`);
const { getTutor } = require(`./tutorApi`);
const { addStudent, updateStudentTutor, existStudent } = require(
	`./studentApi`,
);
const { checkRole } = require(`../../utils/discordUtils`);

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
						.setRequired(true),
				)
				.addUserOption((option) =>
					option.setName(`tutor`).setDescription(`O tutor do novo tutorando.`),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName(`alterar`)
				.setDescription(`Altere o tutor de um tutorando.`)
				.addUserOption((option) =>
					option
						.setName(`tutorando`)
						.setDescription(`O user do tutorando. Pode usar o id.`)
						.setRequired(true),
				)
				.addUserOption((option) =>
					option.setName(`tutor`).setDescription(`O novo tutor do tutorando.`),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName(`remover`)
				.setDescription(`Remova o tutorando da tutoria.`)
				.addUserOption((option) =>
					option
						.setName(`tutorando`)
						.setDescription(`O user do tutorando. Pode usar o id.`)
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */

	run: async (client, interaction) => {
		const token = client.tokenApi;
		const { options } = interaction;
		const subcommand = options.data[0];

		const target = options.getUser(`tutorando`);
		const studentIfExist = await existStudent(target.id, token);
		const member = await client.guilds.cache
			.map(async (g) => await g.members.fetch({ user: target }))
			.at(0);

		let Tutor = `SemTutor`;
		let roleId = undefined;

		const studentRole = await checkRole(client, `student`);
		const classFRole = await checkRole(client, `classeF`);
		const noClassRole = await checkRole(client, `noClass`);

		await interaction.deferReply();

		if (subcommand.name == `adicionar`) {
			const tutorUser = options.getUser(`tutor`);
			if (tutorUser) {
				const tutorData = await getTutor(tutorUser.id, token);
				if (!tutorData.tutor)
					return await interaction.followUp(
						`O tutor \`${tutorUser.username}\` não está registrado.`,
					);
				Tutor = tutorData.tutor;
				roleId = tutorData.roleId;
			}
			if (roleId && !member.roles.cache.has(roleId))
				await member.roles.add(roleId);
			if (!member.roles.cache.has(studentRole.id))
				await member.roles.add(studentRole);

			let remove_all = true;
			if (
				member.roles.cache.some(
					(role) =>
						role.name.includes(`Classe`) &&
						!role.name.includes(`F`) &&
						!role.name.includes(`?`),
				)
			) {
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`remove-yes`)
						.setEmoji({ id: `1051884168977584139`, name: `ready` })
						.setLabel(`Sim`)
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId(`remove-no`)
						.setEmoji({ id: `1051884167782219776`, name: `error` })
						.setLabel(`Não`)
						.setStyle(ButtonStyle.Danger),
				);
				const message = await interaction.channel.send({
					content: `Deseja remover todas as classes desse usuário?`,
					components: [row],
				});
				try {
					const filter = (interaction) =>
						interaction.customId.split(`-`)[0] === `remove`;
					const button = await message.awaitMessageComponent({
						filter,
						time: 600_000,
						errors: [`time`],
					});
					await message.delete();
					const value = button.customId.split(`-`)[1];
					remove_all = value === `yes` ? true : false;
				} catch (err) {
					await message.delete();
				}
			}

			for (const role of member.roles.cache.values()) {
				if (remove_all) {
					if (role.name.includes(`Classe`) && !role.name.includes(`F`))
						await member.roles.remove(role);
				} else if (role.name.includes(`Classe ?`)) {
					await member.roles.remove(role);
				}
			}

			if (!member.roles.cache.has(classFRole.id))
				await member.roles.add(classFRole);

			/* ADD PLANILHA */
			if (studentIfExist) {
				await updateStudentTutor(target.id, { tutor: Tutor }, token);

				const old_tutor = studentIfExist.tutor;
				const tutorData = await getTutor(old_tutor, token);
				if (member.roles.cache.has(tutorData.roleId))
					await member.roles.remove(tutorData.roleId);
			} else
				await addStudent(
					target.id,
					{ AtualUsername: target.username, Nickname: member.nickname, Tutor },
					token,
				);
			return await interaction.followUp(
				`O \`${target.username}\` foi adicionado como tutorando de **${Tutor}**.`,
			);
		}

		if (subcommand.name == `alterar`) {
			if (!studentIfExist)
				return await interaction.followUp(
					`O tutorando \`${target.username}\` não está registrado.`,
				);

			const old_tutor = studentIfExist.tutor;
			const tutorData = await getTutor(old_tutor, token);
			if (member.roles.cache.has(tutorData.roleId))
				await member.roles.remove(tutorData.roleId);

			const tutorUser = options.getUser(`tutor`);
			if (tutorUser) {
				const tutorData = await getTutor(tutorUser.id, token);
				if (!tutorData.tutor)
					return await interaction.followUp(
						`O tutor \`${tutorUser.username}\` não está registrado.`,
					);
				Tutor = tutorData.tutor;
				roleId = tutorData.roleId;
			}

			if (roleId && !member.roles.cache.has(roleId))
				await member.roles.add(roleId);

			await updateStudentTutor(target.id, { tutor: Tutor }, token);
			return await interaction.followUp(
				`O \`${target.username}\` foi alterado para **${Tutor}**.`,
			);
		}

		if (subcommand.name == `remover`) {
			if (!studentIfExist)
				return await interaction.followUp(
					`O tutorando \`${target.username}\` não está registrado.`,
				);

			const old_tutor = studentIfExist.tutor;
			const tutorData = await getTutor(old_tutor, token);
			if (member.roles.cache.has(tutorData.roleId))
				await member.roles.remove(tutorData.roleId);

			for (const role of member.roles.cache.values()) {
				if (role.name.includes(`Classe`) && !role.name.includes(`?`))
					await member.roles.remove(role);
				else if (role.name.includes(`Tutorando`))
					await member.roles.remove(role);
			}

			if (!member.roles.cache.has(noClassRole.id))
				await member.roles.add(noClassRole);

			await updateStudentTutor(target.id, { tutor: `Inativo` }, token);
			return await interaction.followUp(
				`O \`${target.username}\` foi removido da tutoria.`,
			);
		}
	},
};
