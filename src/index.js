import Logbook from 'logbookjs'

// Init Logger, attach to window
// @ts-ignore
const level = WEBPACK_BUILD === 'production' ? 'off' : 'all'
Logbook( { global: true, globalPrefix: '_', threshold: level } )

_L1( 'Universal Box (Block Blocks) initialized' )
_info( 'Webpack mode:', level )
_log( 'Plugin settings: ', blockyBlocksPluginSettings )

// Using require to ensure Logbook loads first
require( '~/blocks/universal-box' )
