const path = require('path')

module.exports = function override(config) {
	config.resolve = {
		...config.resolve,
		alias: {
			'@components': path.resolve(__dirname, 'src/components/'),
			'@images': path.resolve(__dirname, 'src/images/'),
			'@customhooks': path.resolve(__dirname, 'src/customhooks/'),
			'@pages': path.resolve(__dirname, 'src/pages/'),
			'@styles': path.resolve(__dirname, 'src/styles/'),
			'@utils': path.resolve(__dirname, 'src/utils/'),
			'@root': path.resolve(__dirname, 'src/'),
		},
	}
	return config
}
