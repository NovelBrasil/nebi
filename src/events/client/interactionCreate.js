module.exports = async (client, interaction) => {
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
        const cmd = client.commands.get(interaction.commandName)
        if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions).catch(err => {
            client.emit(`errorCreate`, err, interaction.commandName, interaction)
        })
    }
}