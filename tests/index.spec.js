const { expect, test } = await import(`vitest`)
const DiscordConfig = require(`./config/bot`)

test(`check instance of DiscordConfig`, () => {
    const config = new DiscordConfig()

    expect(config).toBeInstanceOf(DiscordConfig)
    expect(config.getIconNB()).toBeDefined()
})

test(`check if Dev Mode work`, () => {
    const config = new DiscordConfig()
    config.setDevMode(true)

    const token = config.isDevMode() ? process.env.DISCORD_TEST_TOKEN : process.env.DISCORD_MAIN_TOKEN

    expect(config.isDevMode()).toBeTruthy()
    expect(token).toEqual(process.env.DISCORD_TEST_TOKEN)
})