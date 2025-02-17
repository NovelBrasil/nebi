const Axios = require("axios");
const { setupCache } = require("axios-cache-interceptor");

const instance = Axios.create({ baseURL: process.env.NEBI_API_URL });
const axios = setupCache(instance);

module.exports = {
	axios,
};
