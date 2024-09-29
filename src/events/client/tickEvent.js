module.exports = async (client, timeType) => {
	if (timeType == `minute`) {
		const tokenHandler = client.handlers.get(`token`);
		if (tokenHandler) await tokenHandler.update();
	}
};
