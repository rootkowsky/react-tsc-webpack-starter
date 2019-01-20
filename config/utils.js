const path = require('path');

module.exports = {
	path: (endpoint = '') => {
		return path.join(__dirname, '..', endpoint);
	},
};