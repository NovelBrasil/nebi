/**
 * @param {import("discord.js").Client} client
 */
module.exports = async (client, interaction) => {
	if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
		const cmd = client.commands.get(interaction.commandName);
		if (cmd)
			cmd
				.run(client, interaction, interaction.options._hoistedOptions)
				.then(() => {
					client.emit(`commandExec`, interaction.commandName, interaction);
				})
				.catch((err) => {
					client.emit(
						`errorCreate`,
						err,
						interaction.commandName,
						interaction,
						`Comando`,
					);
					console.error(err);
				});
	} else if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if (button)
			button
				.run(client, interaction)
				.then(() => {
					client.emit(`buttonExec`, interaction.customId, interaction);
				})
				.catch((err) => {
					client.emit(
						`errorCreate`,
						err,
						interaction.commandName,
						interaction,
						`Botão`,
					);
					console.error(err);
				});
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`,
			);
			return;
		}
		try {
			await command.autocomplete(client, interaction); // Call the autocomplete function if it exists
		} catch (error) {
			console.error(error);
		}
	}
};
