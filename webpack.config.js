// @ts-nocheck
const path = require( 'path' )
const { merge } = require( 'webpack-merge' )
const webpack = require( 'webpack' )
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' )

const devConfig = defaultConfig.mode === 'development' ? {
	devtool: 'eval-source-map',
} : {}

module.exports = merge( defaultConfig, devConfig, {
	entry: {
		bb_style_loader: path.resolve( process.cwd(), 'src', 'frontend/bb-style-loader.js' ),
	},

	resolve: {
		alias: {
			'~': path.resolve( 'src' ),
			'@assets': path.resolve( 'src/assets' ),
			'@block-controls': path.resolve( 'src/framework/block-controls/index.js' ),
			'@blocks': path.resolve( 'src/blocks' ),
			'@components': path.resolve( 'src/framework/components/index.js' ),
			'@extensions': path.resolve( 'src/framework/extensions' ),
			'@framework': path.resolve( 'src/framework' ),
			'@lib': path.resolve( 'src/lib' ),
		},
	},

	plugins: [
		new webpack.DefinePlugin( {
			'WEBPACK_BUILD': JSON.stringify( defaultConfig.mode ),
		} ),
	],
} )
