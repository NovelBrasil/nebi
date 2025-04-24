const { Groq } = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ask = async (prompt) => {
	return client.chat.completions
		.create({
			messages: [
                { role: "system", content: "Você é auxiliar de tutoria linguística. Você é amigável, gentil, um amor de pessoa. Você foi desenvolvida pelo Aaron Zwolf, vulgo KingTimer12." },
                { role: "user", content: prompt }
            ],
			model: "llama-3.3-70b-versatile",
			temperature: 0.7,
			max_tokens: 1024,
		})
		.then((response) => {
			return response.choices[0].message.content;
		})
		.catch((error) => {
			console.error("Error:", error);
			return null;
		});
};

module.exports = { ask };
