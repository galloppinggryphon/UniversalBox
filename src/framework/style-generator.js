/**
 * ### External dependencies ###
 */
import _ from 'lodash'

/**
 * ### Internal dependencies ###
 */
import { cssColourToRgb } from '@lib/css-colours'
import {
	cssColourVariables,
	isValidAlpha,
	pluginSettings,
} from '@framework/plugin-utils'

/**
 * Compile block CSS from attributes
 *
 * Return object: [screen][blockScope][blockId][key] = value
 *
 * blockScope = {inner|outer}
 *
 * @param {BlockAttributes.attributes} attributes
 * @return {BlockData<PlainObj>} List of CSS styles
 */
export function generateBlockStyles( attributes ) {
	// _L3( `[${ attributes.blockId }] generateBlockStyles()` )

	const {
		colourTheme,
		innerLayout,
		outerLayout,
		margin,
		padding,
		width,
		background,
		textOptions,
	} = attributes

	const styles = StyleBuilder()

	// ============================================
	// ### Responsive settings ###
	// ============================================

	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	// ### margin ###
	// ~~~~~~~~~~~~~~~~~~~~~~~~~

	if ( margin?.responsiveProps && margin?.enableCustom !== false ) {
		for ( const screen of Object.keys( margin.responsiveProps ) ) {
			const marginProps = margin.responsiveProps[ screen ]
			const { disabled, locked, all } = marginProps
			if ( disabled !== false ) {
				if ( locked ) {
					if ( typeof all === 'number' ) {
						styles.add( 'outer', screen, 'padding', `${ all }px`, true )
					}
					continue
				}

				const sides = [ 'top', 'bottom', 'left', 'right' ]
				sides.forEach( ( key ) => {
					const value = marginProps[ key ]
					if ( typeof value === 'number' ) {
						// #Note: padding is implemented as padding on the inner block
						styles.add( 'outer', screen, `padding-${ key }`, `${ value }px`, true )
					}
				} )
			}
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	// ### PADDING ###
	// ~~~~~~~~~~~~~~~~~~~~~~~~~

	if ( padding?.responsiveProps && padding?.enableCustom ) {
		for ( const screen of Object.keys( padding.responsiveProps ) ) {
			const paddingProps = padding.responsiveProps[ screen ]
			const { disabled, locked, all } = paddingProps

			if ( disabled !== false ) {
				if ( locked ) {
					if ( typeof all === 'number' ) {
						styles.add( 'inner', screen, 'padding', `${ all }px`, true )
					}
					continue
				}

				const sides = [ 'top', 'bottom', 'left', 'right' ]
				sides.forEach( ( key ) => {
					const value = paddingProps[ key ]
					if ( typeof value === 'number' ) {
						// #Note: padding is implemented as padding on the inner block
						styles.add( 'inner', screen, `padding-${ key }`, `${ value }px`, true )
					}
				} )
			}
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	// ### INNER LAYOUT ###
	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	if ( innerLayout?.responsiveProps ) {
		for ( const screen of Object.keys( innerLayout.responsiveProps ) ) {
			const { justifyContent, flexWrap, alignItems } = innerLayout.responsiveProps[ screen ]

			styles.add( 'inner', screen, 'justify-content', justifyContent, false )
			styles.add( 'inner', screen, 'flex-wrap', flexWrap ? 'wrap' : 'nowrap', false )
			styles.add( 'inner', screen, 'align-items', alignItems, false )
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	// ### OUTER LAYOUT ###
	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	if ( outerLayout?.type && outerLayout?.responsiveProps ) {
		for ( const screen of Object.keys( outerLayout.responsiveProps ) ) {
			const olProps = outerLayout.responsiveProps[ screen ]
			const { flexBase, flexOrder, flexWidthMode } = olProps

			if ( flexOrder ) {
				styles.add( 'outer', screen, 'order', flexOrder )
			}

			if ( outerLayout.type === 'flex-column' ) {
				switch ( flexWidthMode ) {
					case 'fit-content':
						styles.add( 'outer', screen, 'flex', '0 0 auto' )
						break

					case 'flexible':
						styles.add( 'outer', screen, 'flex', `1 0 ${ flexBase }` )

						const { maxWidth } = width?.responsiveProps?.[ screen ] ?? {}

						if ( maxWidth ) {
							styles.add( 'outer', screen, 'max-width', maxWidth )
						}
						break

					case 'fixed':
						styles.add( 'outer', screen, 'flex', `0 0 ${ flexBase }` )
						break
				}
			}
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~
	// ### WIDTH ###
	// ~~~~~~~~~~~~~~~~~~~~~~~~~

	if ( width?.preset === 'custom' && width?.responsiveProps ) {
		for ( const screen of Object.keys( width.responsiveProps ) ) {
			const { type, absoluteWidth, relativeWidth } = width.responsiveProps[ screen ]

			// type: auto, relative, absolute
			if ( type === 'absolute' ) {
				styles.add( 'outer', screen, 'width', `${ absoluteWidth }px` )
			}
			else if ( type === 'relative' ) {
				styles.add( 'outer', screen, 'width', `${ relativeWidth }%` )
				styles.add( 'outer', screen, 'max-width', `none` )
			}
		}
	}

	// ============================================
	// ### All screens ###
	// ============================================

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * ### Background -- image ###
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	if ( background?.image ) {
		const { source } = background?.image
		const { value, alpha } = background?.overlayColour ?? {}

		// _yellow( 'background', background )

		// Make image ID available as a variable, the frontend may use it for responsive lazy loading

		// #Todo: add via save function instead?
		styles.add( 'outer', 'all', '--background-image-id', `${ source.id }`, false )
		styles.add( 'outer', 'all', '--background-image-src', `"${ source.url }"`, false )
		styles.add( 'outer', 'all', '--background-image-url', `url("${ source.url }")`, false )

		if ( value ) {
			const { color, slug } = value

			// Get colours from CSS variables
			let colourValue = slug ? cssColourVariables()[ slug ] : color

			if ( typeof colourValue === 'string' ) {
				if ( isValidAlpha( alpha ) ) {
					colourValue = parseColour( colourValue, alpha )
				}

				styles.add( 'inner', 'all', 'box-shadow', `inset 0px 0px 0px 10000px ${ colourValue }`, false )
			}
			else {
				console.error( 'Invalid background.colour' )

				_log( { value } )
				_log( { colourValue } )
				_log( { cssColourVariables: cssColourVariables() } )
			}

			// #note
			// Method not compatible with dynamic responsive images:
			// styles.add( screen,  `background-image: linear-gradient(0deg,${ col },${ col }), url(${ url })` )
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * ### Background -- colour ###
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 *
	 * - If no class, use style
	 * - If no transparency, use class
	 * - If colour scheme is set, override
	 *
	 * Colour may be saved as a CSS variable that has to be translated to hex
	 */
	if ( background?.colour ) {
		const { value, alpha } = background.colour
		const { color, slug } = value ?? {}

		// If colour class name is present, use class
		// Otherwise use style
		let colourValue
		if ( slug && isValidAlpha( alpha ) ) {
			colourValue = cssColourVariables()[ slug ]
			colourValue = colourToRgb( colourValue, alpha )
		}
		// If known colour value, use style
		else if ( color ) {
			colourValue = parseColour( color, alpha )
		}

		styles.add( 'inner', 'all', 'background-color', colourValue )
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * ### Colour theme background ###
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	// if ( colourTheme?.disableBackgroundColour ) {
	// 	styles.add( 'inner', 'all', '--theme-colour-background', 'none' )
	// }

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * ### textOptions -- colour ###
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 *
	 * If no class, use style
	 * If no transparency, use class
	 */

	if ( textOptions?.colour ) {
		const { value, alpha } = textOptions.colour
		const { color, slug } = value ?? {}

		if ( slug ) {
			const colourValue = cssColourVariables()[ slug ]
			const cssColourValue = parseColour( colourValue, alpha )

			styles.add( 'outer', 'all', 'color', cssColourValue, !! colourTheme )
		}
		else if ( color ) {
			const cssColourValue = parseColour( color, alpha )
			styles.add( 'outer', 'all', 'color', cssColourValue )
		}
	}

	// _L3( 'generateBlockStyles' )
	// _log( styles.get() )

	return styles.get()
}

/**
 * Takes output from generateBlockStyles() and returns pretty/valid CSS
 *
 * Adds correct class names based on scope
 *
 * ~ Process: ~
 * 1. Collapse block styles into CSS rules
 * 2. Create media rule
 * 3. Add media rule and CSS rules to screen size array
 *
 * @param {PlainObj} blockStyles
 * @param {BlockData<any>} cssSelectors
 */
export function generateCss( blockStyles, cssSelectors ) {
	const {
		breakpointConfig,
	} = pluginSettings.presets

	const css = {
		outer: '',
		inner: '',
	}

	const mediaQueries = breakpointConfig.reduce( ( queries, screenProps ) => {
		if ( screenProps.name === 'all' ) {
			return queries
		}

		const _q = []
		_q.push( '@media ' )
		if ( screenProps?.minWidth ) {
			_q.push( `(min-width: ${ screenProps.minWidth }px)` )
		}
		if ( screenProps?.minWidth && screenProps.maxWidth ) {
			_q.push( ' and ' )
		}
		if ( screenProps?.maxWidth ) {
			_q.push( `(max-width: ${ screenProps.maxWidth }px)` )
		}
		queries[ screenProps.name ] = _q
		return queries
	}, {} )

	// Structure : {blockScope}.{screen}.{key} = ...
	// debugger
	Object.entries( blockStyles ).forEach( ( [ scopeName, screens ] ) => {
		Object.entries( screens ).forEach( ( [ screenName, props ] ) => {
			if ( _.isEmpty( props ) ) {
				return
			}

			const mediaQuery = screenName !== 'all' && mediaQueries[ screenName ]
			const selector = cssSelectors[ scopeName ]
			const cssProps = [ `${ selector } {` ]

			Object.entries( props ).forEach( ( [ key, style ] ) => {
				if ( key && typeof key === 'string' ) {
					cssProps.push( `${ key }: ${ style };` )
				}
				else {
					cssProps.push( `${ style };` )
				}
			} )

			cssProps.push( '}' )
			const cssString = cssProps.join( '\n' )

			if ( mediaQuery ) {
				css[ scopeName ] = `${ css[ scopeName ] ?? '' }\n${ mediaQuery.join( '' ) } { ${ cssString } }\n`
			}
			else {
				css[ scopeName ] = `${ css[ scopeName ] ?? '' }\n${ cssString }`
			}
		} )
	} )

	return css
}

/**
 * Factory for styleBuilder, which an be used to compile two and three-dimensional key-value objects.
 * Useful for building CSS style objects.
 *
 * @param {BlockData<PlainObj>|undefined} styles
 * @return styleBuilder object.
 */
export function StyleBuilder( styles = undefined ) {
	const _styles = styles ?? {
		outer: {},
		inner: {},
	}

	return {
		/**
		 * Add CSS to array
		 *
		 * Note: key-value pairs can be passed collapsed in value; provide null as key.
		 *
		 * If value is undefined, the style is not added.
		 *
		 * @param {BlockScope} blockScope
		 * @param {string} screen
		 * @param {string|null} property CSS property name. Null if value is a key-value pair.
		 * @param {string|undefined} value
		 * @param {boolean} important
		 */
		add( blockScope, screen, property, value, important = false ) {
			if ( value === undefined ) {
				return
			}

			_styles[ blockScope ] = _styles[ blockScope ] || {}
			if ( ! _styles[ blockScope ] ) {
				_styles[ blockScope ] = {}
			}

			if ( ! _styles[ blockScope ][ screen ] ) {
				_styles[ blockScope ][ screen ] = {}
			}

			const _value = important ? `${ value } !important` : value

			// Allow property-value pair to be passed collapsed
			// Provide null as key
			// Discard undefined values
			if ( property === null || property === undefined ) {
				const i = Object.keys( _styles[ blockScope ][ screen ] ).length + 1
				_styles[ blockScope ][ screen ][ i ] = _value
			}
			else {
				_styles[ blockScope ][ screen ][ property ] = _value
			}
		},

		/**
		 * Return all styles.
		 *
		 * @return {BlockData<PlainObj>} Compiled CSS style object.
		 */
		get() {
			return _styles
		},
	}
}

/**
 * Parse colour value, whether it is a CSS value, hex or rgba.
 *
 * @param {string} colour
 * @param {number|undefined} alpha
 * @return {string|undefined}
 */
function parseColour( colour, alpha = undefined ) {
	const colourValue = colourToRgb( colour, alpha )
	return colourValue ?? cssColourToRgb( colour )
}

/**
 * Convert long or short hex colour to CSS RGB() or RGBA() value.
 *
 * @param {string} colour Valid hex (long or short)
 * @param {number|undefined} alpha Alpha channel (opacity), range 0-1
 * @return `rgba(r,g,b,a)` or `rgb(r,g,b)`
 */
export function colourToRgb( colour, alpha = undefined ) {
	if ( colour === undefined ) {
		return
	}

	let r, g, b
	const regHex = /#([0-9a-f]{3,6})/i
	colour = colour.trim()

	if ( regHex.test( colour ) ) {
		const hex = colour.match( regHex )?.[ 1 ]
		if ( ! hex ) {
			return
		}
		r = parseInt( hex.length === 3 ? hex.slice( 0, 1 ).repeat( 2 ) : hex.slice( 0, 2 ), 16 )
		g = parseInt( hex.length === 3 ? hex.slice( 1, 2 ).repeat( 2 ) : hex.slice( 2, 4 ), 16 )
		b = parseInt( hex.length === 3 ? hex.slice( 2, 3 ).repeat( 2 ) : hex.slice( 4, 6 ), 16 )
	}
	else {
		return
	}

	if ( typeof alpha === 'number' ) {
		alpha = alpha < 1 && alpha >= 0 ? alpha : 1
		return `rgba(${ [ r, g, b, alpha ].join( ',' ) })`
	}
	return `rgb(${ [ r, g, b ].join( ',' ) })`
}

function getColourValue( slug, color, alpha ) {
	let colourValue = ''

	// Check if colour is defined by CSS variable.

	if ( slug && isValidAlpha( alpha ) ) {
		colourValue = cssColourVariables()[ slug ]
		colourValue = colourToRgb( colourValue, alpha )
	}
	// If known colour value, use style
	else if ( color ) {
		colourValue = parseColour( color, alpha )
	}

	return colourValue
}
