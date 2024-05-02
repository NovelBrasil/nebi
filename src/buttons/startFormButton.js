const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require(`discord.js`)
  
module.exports = {
    customId: `startForm`,

    /** 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    run: async (client, interaction) => {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`acceptTerms`)
                    .setLabel(`Iniciar teste`)
                    .setStyle(ButtonStyle.Success),
            )
  
        const embed = new EmbedBuilder()
            .setColor(client.config.getColor(`form`))
            .setAuthor({name: `Matrícula para tutoria da Novel Brasil`, iconURL: `https://i.imgur.com/SjJdDqs.gif`})
            .setTitle(`ESTE FORMULÁRIO É DESTINADO SOMENTE PARA PESSOAS QUE DESEJAM SER MATRICULADAS`)
            .setDescription(`\nOlá, escritor!\n\nNeste formulário você poderá solicitar sua matrícula na tutoria da Novel Brasil, a maior comunidade voltada para escritores de novel do Brasil!\n\nO formulário ficará disponível em tempo integral, porém sua resposta não garante a sua entrada na tutoria! Há um número limitado de vagas e, caso já tenha sido atingido um limite, você pode acabar entrando na lista de espera até a nova abertura de matrícula — o que ocorre a cada 3 meses — ou vaga de um tutor abrir.\n\n**Preencha o formulário somente se estiver interessado em entrar na tutoria.**\n\nO procedimento seguirá as seguintes normas:\n> É de inteira responsabilidade do tutorando a resposta e checagem de todas as perguntas do formulário;\n> Todos os formulários enviados serão considerados válidos;\n> Somente será aceito pedido de entrada na tutoria enviado por este formulário, não sendo considerada nenhuma outra forma de solicitação;\n> Os pedidos serão analisados pela Coordenação da Novel Brasil;\n> Os pedidos serão respondidos pelo seu pv do Discord por um membro da Coordenação;\n> Se o aluno apresentar dificuldade no preenchimento deste formulário ou necessitar de novas orientações, deverá entrar em contato com um membro da coordenação da Novel Brasil.\n\nO escritor interessado na tutoria deve responder um questionário de 21 perguntas que servirão como guia para o tutor. Não pesquise na internet! Essas perguntas não irão afetar sua Classe **(todos os tutorandos iniciam na Classe F)** e servem apenas para o tutor poder criar um plano de ensino condizente com o seu conhecimento.\n\nPreencha todos os campos obrigatórios.`)
            .setFooter({text: `Atenciosamente, Coordenação da Novel Brasil`})
            .setTimestamp()
            
        try {
            interaction.user.send({ embeds: [embed], components: [row] })
            interaction.reply({
                content: `Sua matrícula será feita no **privado**! Eu enviei a mensagem, por favor, continue por lá.`,
                ephemeral: true
            })
        } catch (error) {
            interaction.reply({
                content: `Sua DM não está habilitada para o bot iniciar a matrícula! Habilite durante esse tempo de perguntas e repostas.`,
                ephemeral: true
            }).catch(console.error)
        }
    },
}
  