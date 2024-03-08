const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

module.exports = function override(config) {
	config.resolve = {
		...config.resolve,
		alias: {
			'@components': path.resolve(__dirname, 'src/components/'),
			'@authentications': path.resolve(__dirname, 'src/authentications/'),
			'@images': path.resolve(__dirname, 'src/images/'),
			'@customhooks': path.resolve(__dirname, 'src/customhooks/'),
			'@pages': path.resolve(__dirname, 'src/pages/'),
			'@styles': path.resolve(__dirname, 'src/styles/'),
			'@store': path.resolve(__dirname, 'src/store/'),
			'@root': path.resolve(__dirname, 'src/'),
		},
	}
	return config
}
