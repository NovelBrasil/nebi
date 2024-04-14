let charTable = {
    "!": `z_symbolexclamation`,
    "?": `z_symbolquestion`
}

const convertStringToEmoji = (client, input) => {
    input = [...input.toLowerCase()]
    let finalString = ``
    const emojiConfig = client.config.emoji
    for (let i = 0; i < input.length; i++) {
        let rawChar = input[i]
        let emojiText = ``
        if (rawChar.match(/[a-z]/i)) {
            emojiText = emojiConfig.getEmoji(`z_letter${rawChar}`) || ``
        } else if (rawChar.match(/[0-9]/i)) {
            emojiText = emojiConfig.getEmoji(`z_number${parseInt(rawChar)}`) || ``
        } else if (rawChar !== ` `) {
            let symbol = emojiConfig.getEmoji(charTable[rawChar]) || ``
            if (!symbol) continue
            emojiText = symbol
        } else {
            finalString += `  `
            continue
        }
        finalString += `${emojiText}`
    }
    return finalString.trimEnd()
}

module.exports = {convertStringToEmoji}