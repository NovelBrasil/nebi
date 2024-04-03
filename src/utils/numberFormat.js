/**
 * @param {Number} value
 * @returns {String}
*/
const numberDecimal = (value) => value >= 10 ? `${value}` : `0${value}`

module.exports = { numberDecimal }