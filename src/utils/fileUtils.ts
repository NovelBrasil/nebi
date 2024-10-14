const fs = require(`fs`);

function createJSON(fileName, data) {
	const dataJSON = JSON.stringify(data, null, 2);
	fs.writeFileSync(fileName, dataJSON, `utf-8`);
}

function readJSON(fileName) {
	try {
		const dataJSON = fs.readFileSync(fileName, `utf-8`);
		const data = JSON.parse(dataJSON);
		return data;
	} catch (error) {
		return undefined;
	}
}

function updateJSON(fileName, newData) {
	try {
		const read = readJSON(fileName);
		if (read) {
			const dataUpdated = { ...read, ...newData };
			const dataJSONUpdated = JSON.stringify(dataUpdated, null, 2);
			fs.writeFileSync(fileName, dataJSONUpdated, `utf-8`);
		} else createJSON(fileName, newData);
	} catch {
		/* empty */
	}
}

module.exports = { createJSON, readJSON, updateJSON };
