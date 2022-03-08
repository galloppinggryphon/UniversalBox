import { pluginConfig } from '~/plugin-config'
const configTag = `script.${ pluginConfig.frontEndScriptClassName }`

document.addEventListener( 'DOMContentLoaded', function() {
	// Get settings for BB blocks
	const bbConfigContainers = document.querySelectorAll( configTag )

	if ( bbConfigContainers ) {
		bbConfigContainers.forEach( ( el ) => {
			const config = JSON.parse( el.innerHTML )
			if ( config ) {
				bbInjectCss( config.css )
			}
		} )
	}
} )

function bbInjectCss( css ) {
	const style = document.createElement( 'style' )
	style.innerHTML = css
	document.querySelector( 'head' ).appendChild( style )
}
