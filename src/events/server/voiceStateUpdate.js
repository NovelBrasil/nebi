// the idea is to change the handler functions to have side effects (add, sub, stop counting xp, for example)
// more complex behaviour (like sharing a screen on a given channel), just add more handlers and ifs

function Log(client, user, title, description) {
	const thumbnail = user.avatarURL({ extension: `png`, size: 128 });

	client.sendLog(client, `default`, {
		title,
		description,
		thumbnail,
		fields: [
			{
				name: `> Usuário`,
				value: `- ${user} (${user.tag})`,
			},
			{
				name: `> Timestamp`,
				value: `- ${Date.now()}`,
			},
		],
	});
}

function handleJoinVC(client, user, guildId, channelId) {
	Log(
		client,
		user,
		"Usuário entrou em canal de voz",
		`Um usuário entrou no canal de voz https://discord.com/channels/${guildId}/${channelId}`,
	);
}

function handleLeftVC(client, user, guildId, channelId) {
	Log(
		client,
		user,
		"Usuário saiu de canal de voz",
		`Um usuário saiu do canal de voz https://discord.com/channels/${guildId}/${channelId}`,
	);
}

function handleChangeVc(
	client,
	user,
	oldGuildId,
	oldChannelId,
	newGuildId,
	newChannelId,
) {
	if (oldChannelId === null || newChannelId === null) return;
	Log(
		client,
		user,
		"Usuário mudou de canal de voz",
		`Um usuário mudou do canal de voz https://discord.com/channels/${oldGuildId}/${oldChannelId} para o canal de voz https://discord.com/channels/${newGuildId}/${newChannelId}`,
	);
}

function handleDeafen(client, user) {
	return;
}

function handleUndeafen(client, user) {
	return;
}

function handleMuted(client, user) {
	return;
}

function handleUnmuted(client, user) {
	return;
}

function handleSelfMuted(client, user) {
	Log(
		client,
		user,
		"Usuário se silenciou",
		"Um usuário silenciou a si mesmo em canal de voz.",
	);
}

function handleSelfUnmuted(client, user) {
	Log(
		client,
		user,
		"Usuário se dessilenciou",
		"Um usuário dessilenciou a si mesmo em canal de voz.",
	);
}

function handleSelfDeafen(client, user) {
	Log(
		client,
		user,
		"Usuário desativou o áudio",
		"Um usuário desativou o próprio áudio em canal de voz.",
	);
}

function handleSelfUndeafen(client, user) {
	Log(
		client,
		user,
		"Usuário reativou o áudio",
		"Um usuário resativou o próprio áudio em canal de voz.",
	);
}

function handleCameraOn(client, user) {
	Log(
		client,
		user,
		"Usuário ligou a câmera",
		"Um usuário ligou a câmera em canal de voz.",
	);
}

function handleCameraOff(client, user) {
	Log(
		client,
		user,
		"Usuário desligou a câmera",
		"Um usuário desligou a câmera em canal de voz.",
	);
}

function handleScreenSharingStart(client, user) {
	Log(
		client,
		user,
		"Usuário começou a compartilhar a tela",
		"Um usuário começou a compartilhar a tela em canal de voz.",
	);
}

function handleScreenSharingEnd(client, user) {
	Log(
		client,
		user,
		"Usuário parou de compartilhar a tela",
		"Um usuário parou de compartilhar a tela em canal de voz.",
	);
}

function handleServerMuted(client, user) {
	Log(
		client,
		user,
		"Usuário foi silenciado",
		"Um usuário foi silenciado administrativamente em canal de voz.",
	);
}

function handleServerUnmuted(client, user) {
	Log(
		client,
		user,
		"Usuário foi dessilenciado",
		"Um usuário foi dessilenciado administrativamente em canal de voz.",
	);
}

function handleServerDeafen(client, user) {
	Log(
		client,
		user,
		"Usuário teve o áudio desativado",
		"Um usuário teve o áudio desativado administrativamente em canal de voz.",
	);
}

function handleServerUndeafen(client, user) {
	Log(
		client,
		user,
		"Usuário teve o áudio reativado",
		"Um usuário teve o áudio reativado administrativamente em canal de voz.",
	);
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").VoiceState} oldState
 * @param {import("discord.js").VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {
	// https://discord.js.org/docs/packages/discord.js/14.14.1/VoiceState:Class
	// https://discord.js.org/docs/packages/discord.js/14.14.1/Client:Class#voiceStateUpdate
	// providing a bunch of bools so the voice xp system will be easy to implement
	try {
		const user = newState.member.user;
		const oldChannel = oldState.channelId;
		const newChannel = newState.channelId;

		if (!user) return;
		if (user.bot) return;

		const joinedVC = oldChannel === null && newChannel !== null;
		const leftVC = oldChannel !== null && newChannel === null;
		const changedVC = oldChannel !== newChannel;
		const deafen = !oldState.deaf && newState.deaf;
		const undeafen = oldState.deaf && !newState.deaf;
		const muted = !oldState.mute && newState.mute;
		const unmuted = oldState.mute && !newState.mute;
		const selfMuted = !oldState.selfMute && newState.selfMute;
		const selfUnmuted = oldState.selfMute && !newState.selfMute;
		const selfDeafen = !oldState.selfDeaf && newState.selfDeaf;
		const selfUndeafen = oldState.selfDeaf && !newState.selfDeaf;
		const cameraOn = !oldState.selfVideo && newState.selfVideo;
		const cameraOff = oldState.selfVideo && !newState.selfVideo;
		const screenSharingStart = !oldState.streaming && newState.streaming;
		const screenSharingEnd = oldState.streaming && !newState.streaming;
		const serverMuted = !oldState.serverMute && newState.serverMute;
		const serverUnmuted = oldState.serverMute && !newState.serverMute;
		const serverDeafen = !oldState.serverDeaf && newState.serverDeaf;
		const serverUndeafen = oldState.serverDeaf && !newState.serverDeaf;

		if (joinedVC) handleJoinVC(client, user, newState.guild.id, newChannel);
		if (leftVC) handleLeftVC(client, user, oldState.guild.id, oldChannel);
		if (changedVC)
			handleChangeVc(
				client,
				user,
				oldState.guild.id,
				oldChannel,
				newState.guild.id,
				newChannel,
			);
		if (deafen) handleDeafen(client, user);
		if (undeafen) handleUndeafen(client, user);
		if (muted) handleMuted(client, user);
		if (unmuted) handleUnmuted(client, user);
		if (selfMuted) handleSelfMuted(client, user);
		if (selfUnmuted) handleSelfUnmuted(client, user);
		if (selfDeafen) handleSelfDeafen(client, user);
		if (selfUndeafen) handleSelfUndeafen(client, user);
		if (cameraOn) handleCameraOn(client, user);
		if (cameraOff) handleCameraOff(client, user);
		if (screenSharingStart) handleScreenSharingStart(client, user);
		if (screenSharingEnd) handleScreenSharingEnd(client, user);
		if (serverMuted) handleServerMuted(client, user);
		if (serverUnmuted) handleServerUnmuted(client, user);
		if (serverDeafen) handleServerDeafen(client, user);
		if (serverUndeafen) handleServerUndeafen(client, user);
	} catch {
		/*empty*/
	}
};
