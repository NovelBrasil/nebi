const { DiscordEmbedMenu, DiscordEmbedMenuPage } = require(`@novelbrasil/discord.js-embed-menu`)
const { ButtonBuilder, EmbedBuilder, ButtonStyle } = require(`discord.js`)

/**
 * @param {String[]} emojis
 * @param {Number} index
 * @param {Number} page
 * @param {maxPage} page
 * @returns {import("@novelbrasil/discord.js-embed-menu").DiscordEmbedMenuPage}
*/
function getFlagsPanel(emojis, index, page, maxPage) {
    const embed = new EmbedBuilder({
        title: `Bandeiras Disponíveis`,
        description: `**Comando para trocar:**\n\`\`\`/bandeira trocar <code>\`\`\``,
        fields: [
            {
                name: `Bandeiras`,
                value: emojis.join(` `),
                inline: false
            }
        ],
        author: {
            name: `Informações Profile`,
            iconURL: `https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif`
        },
        footer: {
            text: `Página ${page}/${maxPage}`
        }
    })

    const firstButton = new ButtonBuilder().setCustomId(`first`)
        .setLabel(`Primeiro`)
        .setEmoji(`⏪`)
        .setStyle(ButtonStyle.Primary)

    const nextButton = new ButtonBuilder().setCustomId(`next`)
        .setLabel(`Próximo`)
        .setEmoji(`▶`)
        .setStyle(ButtonStyle.Secondary)

    const lastButton = new ButtonBuilder().setCustomId(`last`)
        .setLabel(`Último`)
        .setEmoji(`⏩`)
        .setStyle(ButtonStyle.Primary)

    const previousButton = new ButtonBuilder().setCustomId(`previous`)
        .setLabel(`Anterior`)
        .setEmoji(`◀`)
        .setStyle(ButtonStyle.Secondary)

    if (page == 1) {
        firstButton.setDisabled(true)
        previousButton.setDisabled(true)
    } else if (page == maxPage) {
        nextButton.setDisabled(true)
        lastButton.setDisabled(true)
    }

    const buttons = {
        first: {
            action: `first`,
            button: firstButton
        },
        previous: {
            action: `previous`,
            button: previousButton
        },
        next: {
            action: `next`,
            button: nextButton
        },
        last: {
            action: `last`,
            button: lastButton
        },
        delete: {
            action: `delete`,
            button: new ButtonBuilder().setCustomId(`delete`)
                .setLabel(`Fechar`)
                .setEmoji(`❌`)
                .setStyle(ButtonStyle.Secondary)
        }
    }
    return new DiscordEmbedMenuPage(`flags-${page}`, embed, undefined, index, buttons)
}

/**
 * @param {import("discord.js").CommandInteraction} interaction
*/
async function openMenuFlag(interaction) {

    const pages = []
    const flags = interaction.client.config.flags.getFlags()

    const everyEmoji = 50
    const maxPage = Math.round(flags.size / everyEmoji)
    let page = 1
    let emojis = []
    let i = 0
    for (const [, v] of flags) {
        i++
        if (i % everyEmoji == 0) {
            pages.push(getFlagsPanel(emojis, i, page, maxPage))
            emojis = []
            page++
        }
        emojis.push(v)
    }

    const menu = new DiscordEmbedMenu(interaction, pages)
    await menu.start({ followUp: true })
}

module.exports = { openMenuFlag }