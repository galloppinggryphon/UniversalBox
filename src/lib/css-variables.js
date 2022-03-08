// Apply this label as an attribute to keep track of processed style elements
const processedLabel = 'documentCssVars'

// Store cache in file context
const cache = {}

export function documentCssVars( filterPrefix = undefined ) {
	// Create a registry for each filterPrefix
	const varPrefix = `--${ filterPrefix }`
	const cacheKey = filterPrefix ?? 'default'
	cache[ cacheKey ] = cache[ cacheKey ] ?? {}

	parseStylesheets()

	/**
	 * Parse document.styleSheets, extract CSS variables. Mark parsed stylesheets.
	 */
	function parseStylesheets() {
		Array.from( document.styleSheets ).forEach( ( _styleSheet )=>{
			// Don't reanalyze previously processed stylesheets
			const node = /** @type {Element} */ ( _styleSheet.ownerNode )

			if ( node.hasAttribute( processedLabel ) ) {
				return
			}

			// set the new value to the object
			node.setAttribute( processedLabel, 'true' )

			Array.from( _styleSheet.cssRules ).forEach( ( /** @type {CSSStyleRule} */ cssRule )=>{
				if ( cssRule.selectorText === ':root' || cssRule.selectorText === 'body' ) {
					const bodyText = cssRule.cssText.split( '{' )
					const rules = bodyText[ 1 ].replace( '}', '' ).split( ';' )

					rules.forEach( ( rule ) => {
						if ( ! rule ) {
							return
						}

						let [ key, value ] = rule.split( ':' )
						key = key.trim()

						if ( key.substring( 0, varPrefix.length ) === varPrefix ) {
							cache[ cacheKey ][ key.substring( varPrefix.length ) ] = value.trim()
						}
					} )
				}
			} )
		} )
		return true
	}

	return filterPrefix ? cache[ cacheKey ] : cache
}
