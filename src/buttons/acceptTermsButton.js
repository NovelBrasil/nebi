// eslint-disable-next-line no-unused-vars
const FormManager = require(`../manager/form-manager`)
  
module.exports = {
    customId: `acceptTerms`,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    run: async (client, interaction) => {
        /**
         * @type {FormManager}
        */
        const form_manager = client.formManager
        const userId = interaction.user.id
        form_manager.add(userId, 
            { 
                id: `age`, response: `2`, category: `data`
            }
        )
        form_manager.send(userId)
    },
}
  