// eslint-disable-next-line no-unused-vars
const { ActionRowBuilder } = require(`discord.js`);
const { existStudent, addStudent } = require(`../commands/tutoria/studentApi`);
const { getTutors, getTutor } = require(`../commands/tutoria/tutorApi`);
const { StringSelectMenuBuilder } = require(`discord.js`);
const { checkRole } = require(`../utils/discordUtils`);

module.exports = {
	customId: `formAccept`,

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").ButtonInteraction} interaction
	 */
	run: async (client, interaction) => {
		try {
			const { guild, channel } = interaction;
			const token = client.tokenApi;

			const studentRole = await checkRole(client, `student`);
			const classFRole = await checkRole(client, `classeF`);

			const members = await guild.members.fetch({
				query: channel.name,
				limit: 1,
			});
			// TODO: handle if more than 1 member is returned
			const target = members.values().next().value;

			// const target = guild.members.cache.find(
			// 	(member) => member.user.username == channel.name,
			// );

			if (!target) {
				return await interaction.reply({
					content: `Usuário não encontrado. Verifique se o nome da thread é de uma pessoa real ou se ainda está no servidor. Caso a pessoa tenha mudado de username, mude o nome da thread para o novo username e tente novamente.`,
					ephemeral: true,
				});
			}

			const studentIfExist = await existStudent(target.user.id, token, client);
			if (studentIfExist)
				return await interaction.reply({
					content: `Esse usuário já fez parte da tutoria. Use o comando para o adicionar novamente.`,
					ephemeral: true,
				});

			await interaction.deferReply();

			const tutores = (await getTutors(token, client))
				.map((tutor) => {
					return {
						label: tutor.tutor,
						value: tutor.tutorId,
					};
				})
				.filter((x) => x.value !== "-");

			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`select-tutor`)
					.setPlaceholder(`Selecione o tutor!`)
					.addOptions(tutores),
			);

			const message = await interaction.followUp({
				content: `Qual será o tutor de <@${target.id}>?`,
				components: [row],
			});
			const filter = (interaction) => interaction.customId === `select-tutor`;
			try {
				const result = await message.awaitMessageComponent({
					filter,
					time: 600_000,
					errors: [`time`],
				});
				await result.update({ fetchReply: true });
				const tutorId = result.values.at(0);
				const tutor_data = await getTutor(tutorId, token, client);
				await addStudent(
					{
						userId: target.id,
						username: target.user.username,
						nickname: target.nickname ?? target.user.username,
						tutor: tutor_data.tutor,
					},
					token,
					client,
				);

				const roleId = tutor_data.roleId;
				if (roleId && !target.roles.cache.has(roleId))
					await target.roles.add(roleId);

				if (!target.roles.cache.has(classFRole.id))
					await target.roles.add(classFRole);

				if (!target.roles.cache.has(studentRole.id))
					await target.roles.add(studentRole);

				await message.channel.send(`<@${target.id}> foi aprovado com sucesso.`);
			} catch (_error) {
				await message.delete();
			}
		} catch (_error) {
			// IGNORE
		}
	},
};
