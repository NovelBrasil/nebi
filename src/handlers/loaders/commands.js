const { REST, Routes } = require(`discord.js`)
const fs = require(`fs`)

class CommandHandler {

    /**
    * @param {import("discord.js").Client} client
    */
    constructor(client) {
        this.client = client
    }

    async load() {
        const commands = []
        const commands_path = `src/commands`
        fs.readdirSync(`./${commands_path}`).forEach(dirs => {
            const commandFolders = fs.readdirSync(`./${commands_path}/${dirs}`).filter(files => files.endsWith(`.js`))
    
            for (const folder of commandFolders) {
                const path_final = `${process.cwd()}/${commands_path}/${dirs}/${folder}`
                const command = require(path_final)
                if (!command.data) continue
                this.client.commands.set(command.data.name, command)
                commands.push(command.data)
            }
        })
    
        const token = this.client.config.isDevMode() ? process.env.DISCORD_TEST_TOKEN : process.env.DISCORD_MAIN_TOKEN
        const clientId = this.client.config.isDevMode() ? process.env.DISCORD_TEST_ID : process.env.DISCORD_MAIN_ID
    
        const rest = new REST({ version: `10` }).setToken(token)
        try {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            )
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CommandHandler