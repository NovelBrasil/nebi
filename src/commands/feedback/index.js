const { getData } = require(`../info/dataApi`);
const { SlashCommandBuilder } = require("discord.js");

async function getForumChannel(client, interaction) {
	const forumChannelID = await getData(`forum_feedback`, client.tokenApi, client);
	if (!interaction.guild.channels.cache.has(forumChannelID))
		await interaction.guild.channels.fetch();
	return interaction.guild.channels.cache.get(forumChannelID);
}

module.exports = {
	// The data property should be dynamically built when registering commands
	// to include the correct available tags for the 'tag_principal' option.
	// Example structure (you'll need to fetch the actual tags):
	data: new SlashCommandBuilder()
		.setName("feedback")
		.setDescription("Comando para feedbacks.")
		.addSubcommand((sub) =>
			sub
				.setName("pedir")
				.setDescription("Cria um novo tópico no fórum de feedbacks.")
				// Add options for Title, Type, Format, Tag, and Fireplume
				.addStringOption((option) =>
					option
						.setName("titulo")
						.setDescription("O título da sua obra.")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("tipo")
						.setDescription("O tipo de conteúdo.")
						.setRequired(true)
						.addChoices(
							{ name: "Sinopse", value: "Sinopse" },
							{ name: "Trecho", value: "Trecho" },
							{ name: "Capítulo", value: "Capítulo" },
							{ name: "Escaleta", value: "Escaleta" },
							{ name: "Prefácio", value: "Prefácio" },
							{ name: "Roteiro", value: "Roteiro" },
						),
				)
				.addStringOption((option) =>
					option
						.setName("formato")
						.setDescription("O formato do conteúdo.")
						.setRequired(true)
						.addChoices(
							{ name: "Ebook", value: "Ebook" },
							{ name: "Livro", value: "Livro" },
							{ name: "Conto", value: "Conto" },
							{ name: "Webnovel", value: "Webnovel" },
							{ name: "Lightnovel", value: "Lightnovel" },
						),
				)
				.addStringOption(
					(
						option, // Using StringOption with autocomplete for multiple tags
					) =>
						option
							.setName("tags") // Renamed to 'tags' to indicate multiple
							.setDescription(
								"As tags para o tópico (selecione múltiplos separando por vírgula).",
							)
							.setRequired(true) // At least one tag is required
							.setAutocomplete(true),
				) // Enable autocomplete for dynamic tag suggestions
				.addBooleanOption(
					(
						option, // Added boolean option for Fireplume
					) =>
						option
							.setName("fireplume")
							.setDescription("Seu texto está no Fireplume?")
							.setRequired(true),
				),
		),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async run(client, interaction) {
		const { options } = interaction;
		const subcommand = options.data[0];
		if (subcommand.name == `pedir`) {
			// Get all the selected options directly from the command
			const title = options.getString("titulo");
			const type = options.getString("tipo");
			const format = options.getString("formato");
			const tagArg = options.getString("tags");
			const hasFireplumeText = options.getBoolean("fireplume"); // Get the boolean value

			// We no longer need to fetch tags and validate the channel here,
			// as the choices in the slash command definition should already be valid tags.
			// However, it's good practice to double-check if the provided tagId is actually
			// a valid tag in the current channel, especially if tag choices aren't perfectly
			// synchronized with available tags. For simplicity here, we assume the choices are correct.

			// Defer the initial reply as thread creation can take a moment
			await interaction.deferReply({ ephemeral: true });

			// Get the forum channel from the interaction
			const forumChannel = await getForumChannel(client, interaction);

			const tagEmAndamento = forumChannel.availableTags.find(
				(r) => r.name === `Em andamento`,
			).id;

			const tagFireplume = forumChannel.availableTags.find(
				(r) => r.name === `Fireplume`,
			).id;

			let tagId
			if (!isNaN(tagArg)) tagId = tagArg
			else {
				const tag = forumChannel.availableTags.find(
					(r) => r.name.toLowerCase() === tagArg.toLowerCase(),
				)
				if (tag == undefined) throw new Error("ERRO: não foi possível encontrar a tag enviada")
				tagId = tag.id
			}

			try {
                const messageContent = `**Tipo:** ${type}\n**Formato:** ${format}\n**Tem texto no Fireplume?** ${hasFireplumeText ? 'Sim' : 'Não'}\n\n*Tópico criado por <@${interaction.user.id}>*`;
                // const components = new ContainerBuilder().addTextDisplayComponents(
                //     new TextDisplayBuilder().setContent(
                //         `**Tipo:** ${type}\n**Formato:** ${format}\n**Tem texto no Fireplume?** ${hasFireplumeText ? "Sim" : "Não"}`
                //       )
                // ).addSeparatorComponents(
                //     new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
                // ).addTextDisplayComponents(
                //     new TextDisplayBuilder().setContent(`*Tópico criado por <@${interaction.user.id}>*`)
                // )

				// Create the new thread
				const newThread = await forumChannel.threads.create({
					name: `[${type}][${format}] ${title}`,
                    message: messageContent,
					appliedTags: [tagId, tagEmAndamento].concat(
						hasFireplumeText ? [tagFireplume] : [],
					), // Apply the selected tag ID
				});

				// Edit the ephemeral reply to confirm thread creation
				await interaction.editReply({
					content: `Tópico criado com sucesso: ${newThread.url}`,
				});
			} catch (error) {
				console.error("Error creating thread:", error);
				// Log the full error object for better debugging
				console.error("Full error details:", JSON.stringify(error, null, 2));
				await interaction.editReply({
					content:
						"Ocorreu um erro ao criar o tópico. Por favor, verifique minhas permissões e tente novamente.",
				});
			}
		}
	},
    /**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").AutocompleteInteraction} interaction
	 */
	async autocomplete(client, interaction) {
		// Get the current focused option value (what the user has typed)
		const focusedValue = interaction.options.getFocused();

		// Fetch the forum channel to get available tags
		// You might want to cache this data if tags don't change often
		const forumChannel = await getForumChannel(client, interaction);
		const availableTags = forumChannel.availableTags;

		// Filter out excluded tags
		const excludedTagNames = ["Concluído", "Em andamento", "Fireplume"];
		const filteredTags = availableTags.filter(
			(tag) => !excludedTagNames.includes(tag.name),
		);

		// Filter tags based on the user's input
		const choices = filteredTags
			.filter((tag) =>
				tag.name.toLowerCase().includes(focusedValue.toLowerCase()),
			)
			// *** CORRECTED: Use tag.id as the value for the suggestion ***
			.map((tag) => ({ name: tag.name, value: tag.id }));

		// Respond with the filtered choices (Discord limits to 25 suggestions)
		await interaction.respond(choices.slice(0, 25));
	},
};
