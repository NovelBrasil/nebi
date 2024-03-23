/**
 * @param {import("discord.js").Client} client
*/
module.exports = async (client, interaction) => {
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
        const cmd = client.commands.get(interaction.commandName)
        if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions).then(() => {
            client.emit(`commandExec`, interaction.commandName, interaction)
        }).catch(err => {
            client.emit(`errorCreate`, err, interaction.commandName, interaction)
        })
    }
}