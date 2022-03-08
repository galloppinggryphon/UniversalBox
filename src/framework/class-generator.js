/**
 * ### External dependencies ###
 */
import _ from 'lodash'

/**
 * ### Internal dependencies ###
 */

import {
	blockHasBackground,
	isValidAlpha,
	pluginSettings,
} from '@framework/plugin-utils'

import {
	arrayFind,
	ExtendedArray,
} from '@framework/utils'

/**
 * Generate class names from attribute properties.
 *
 * @param {BlockAttributes.attributes} attributes
 * @param {BlockData<string[]>} blockClassNames Class names to use for inner/outer block
 */
export function classNameGenerator( attributes, blockClassNames ) {
	const {
		background,
		blockId,
		colourTheme,
		customClassNames,
		gutter,
		innerLayout,
		margin,
		outerLayout,
		padding,
		textAlign,
		textOptions,
		width,
	} = attributes

	const { utilityClassNameTemplate } = pluginSettings
	const backgroundState = blockHasBackground( attributes )

	const {
		colourThemes,
		widthPresets,
	} = pluginSettings.presets

	try {
		// _log( 'blockClassNames', blockClassNames )
		// Add default class names
		const outerClasses = blockClassNames?.outer ?? []
		const innerClasses = blockClassNames?.inner ?? []
		const blockIdClass = blockId && `bb-block-${ blockId }`

		const backgroundClasses = classGenerator( !! background, ( classes ) => {
			const { colour, image } = background

			if ( colour?.value ) {
				const { value, alpha } = colour

				classes.push( `background-colour` )

				if ( value?.slug && ! isValidAlpha( alpha ) ) {
					classes.push( `has-${ value.slug }-background-color` )
				}
			}

			// const newCompoundClass = []
			if ( image?.source?.url ) {
				classes.push( 'background-img' )

				// #todo - advanced image options
				// if ( background.imageAttachmentFixed ) {
				// 	newCompoundClass.push( 'fixed' )
				// }

				// if ( background.imagePosition ) {
				// 	background.imagePosition.forEach( ( value ) => {
				// 		newCompoundClass.push( `position-${ value }` )
				// 	} )
				// }
				// return newCompoundClass.join( ':' )
			}
		} )

		const colourThemeClasses = classGenerator( !! colourTheme, ( classes ) => {
			classes.pushIf( colourTheme.disableBackgroundColour, 'background-none' )
			const foundTheme = arrayFind( colourThemes, colourTheme.name, 'slug' )

			if ( ! foundTheme ) {
				return
			}

			if ( foundTheme.class ) {
				classes.push( foundTheme.class )
				return
			}

			classes.push( pluginSettings.themeClassPrefix + foundTheme.slug )
		} )

		// const outerLayoutClasses = classGenerator( !! innerLayout, ( classes ) => {
		// 	classes.pushIf( !! innerLayout.type, innerLayout.type )
		// } )

		const innerLayoutResponsiveClasses = classGenerator( !! innerLayout?.responsiveProps, ( classes ) => {
			const screens = innerLayout.responsiveProps

			if ( ! screens || _.isEmpty( screens ) ) {
				return
			}

			for ( const [ screen, props ] of Object.entries( screens ) ) {
				if ( ! props || props.disabled ) {
					continue
				}

				for ( const [ value, key ] of Object.entries( screens ) ) {
					if ( ! value ) {
						continue
					}

					const options = {
						dividerHorizontal: { name: 'dividers', dimension: 'horizontal' },
						dividerVertical: { name: 'dividers', dimension: 'vertical' },
						flexWrap: { name: 'flex-wrap', dimension: 'horizontal' },
						forceRowMode: { name: 'flex-rows', dimension: 'horizontal' },
					}

					const conf = options[ key ]

					if ( conf ) {
						conf.pattern = utilityClassNameTemplate
						conf.screen = screen
						classes.push( generateUtilityClassnames( conf ) )
					}
				}
			}
		} )

		// const outerLayoutClass = outerLayout?.type

		const textAlignClass = textAlign && `align-text-${ textAlign }`

		const textOptionClasses = classGenerator( !! textOptions, ( classes ) => {
			classes.pushIf( !! textOptions.fontStyle, `font-style-${ textOptions.fontStyle }` )

			if ( textOptions?.colour ) {
				const { value, alpha } = textOptions.colour
				classes.pushIf( value.slug && ! isValidAlpha( alpha ), `has-${ value.slug }-color` )
			}
		} )

		const widthClass = classGenerator( width?.preset && ! outerLayout?.type, ( classes ) => {
			const p = arrayFind( widthPresets, width.preset, 'value' )
			if ( p && ! [ 'auto', 'custom' ].includes( width.preset ) ) {
				classes.push( `width-${ width.preset }` )
			}
		} )

		const gutterClasses = classGenerator( !! gutter?.responsiveProps, ( classes ) => {
			// Check mode
			const screens = gutter.responsiveProps

			if ( ! screens || _.isEmpty( screens ) ) {
				return
			}

			Object.entries( ( [ screen, props ] ) => {
				classes.pushIf( !! props.horizontalPreset, generateUtilityClassnames( { name: 'gutters', dimension: 'top-bottom', screen, size: props.preset, pattern: utilityClassNameTemplate } ) )

				classes.pushIf( !! props.verticalPreset, generateUtilityClassnames( { name: 'gutters', dimension: 'left-right', screen, size: props.preset, pattern: utilityClassNameTemplate } ) )
			} )
		} )

		const marginClasses = classGenerator( !! margin?.preset, ( classes ) => {
			classes.push( generateUtilityClassnames( { name: 'margin', dimension: null, size: margin.preset, pattern: utilityClassNameTemplate } ) )
		} )

		const paddingClasses = classGenerator( !! ( padding || backgroundState.any ), ( classes ) => {
			if ( backgroundState.any && ! padding?.noAutoBgPadding ) {
				classes.push( 'background-padding' )
			}
			else if ( padding?.preset ) {
				classes.push( generateUtilityClassnames( { name: 'padding', dimension: null, size: padding.preset, pattern: utilityClassNameTemplate } ) )
			}
		} )

		// ===
		// ~~~ Compile output ~~~
		// ===

		// if ( customClassNames && customClassNames.inner ) {
		// 	_red( 'customClassNames' )
		// 	_log( customClassNames.inner )
		// }

		const outer = new Set( [
			...outerClasses,
			...customClassNames?.outer ?? [],
			blockIdClass,
			...marginClasses,
			widthClass,
			// outerLayoutClass,
			// ...outerLayoutClasses,
		] )

		const inner = new Set( [
			...innerClasses,
			...customClassNames?.inner ?? [],

			...backgroundClasses,
			...paddingClasses,
			...colourThemeClasses,
			textAlignClass,
			...textOptionClasses,
			// widthClass,
			...innerLayoutResponsiveClasses,
			...gutterClasses,
		] )

		return {
			outer: Array.from( outer ),
			inner: Array.from( inner ),
		}
	}
	catch ( error ) {
		throw new Error( `Error in classNameGenerator() -- failed to compile classes for block '${ blockId }' See error message below.\n\n${ error }` )
	}
}

/**
 * Compile classes.
 *
 * @template Condition
 * @param {NonNullable<Condition>} condition Only run if condition is true
 * @param {(accumulator: ExtendedArray) => void} func Callback that generates a class names array. The accumulator is updated by mutation.
 * @return Array of class names.
 */
export function classGenerator( condition, func ) {
	if ( ! condition ) {
		return []
	}

	const accumulator = new ExtendedArray()
	func( accumulator )
	return accumulator
}

/**
 * Generate utility class name (for things like margin, padding, etc) based on properties like size, dimension and screen size.
 *
 * @param {Object} props
 * @param {string} props.name The name of the attribute to generate class name for.
 * @param {'blocky-blocks'|'bootstrap'} [props.pattern='blocky-blocks'] The pattern to use. Default: blocky-blocks (built-in).
 * @param {string} [props.dimension] The dimension (e.g. top, bottom, left, right), if relevant.
 * @param {string} [props.size] The size (e.g. small, medium, large), if relevant.$for
 * @param {string} [props.screen] Provide screen name (e.g. small, medium, large) to generate responsive class name, if relevant.
 */
export function generateUtilityClassnames( { name, pattern = 'blocky-blocks', dimension, size, screen } ) {
	let classname = ''

	switch ( pattern ) {
		case 'blocky-blocks':
			classname = blockyBlocks( { name, dimension, size, screen } )
			break

		case 'bootstrap':
			classname = bootstrap( { name, dimension, size, screen } )
			break
	}

	return classname
}

function blockyBlocks( { name, dimension, size, screen } ) {
	const sizes = {
		all: '',
		none: '0',
		xxsmall: 'xxs',
		xsmall: 'xs',
		small: 's',
		medium: 'm',
		large: 'l',
	}

	const dimensions = {
		none: '',
		top: 't',
		right: 'r',
		bottom: 'b',
		left: 'l',
		'top-bottom': 'tb',
		'left-right': 'lr',
		vertical: 'v',
		horizontal: 'h',
	}

	size = size ? ( sizes[ size ] ?? '0' ) : ''
	dimension = dimensions[ dimension ] ?? ''
	screen = sizes[ screen ]

	return name + ( dimension && `-${ dimension }` ) + ( size && `-${ size }` ) + ( screen ? `@${ screen }` : '' )
}

/**
 * Bootstrap: {property}{sides}-{size}
 */
function bootstrap( { name, dimension, size, screen } ) {
	const types = {
		margin: 'p',
		padding: 'p',
	}

	const sizes = {
		auto: 'auto',
		none: '0',
		xsmall: '1',
		small: '2',
		medium: '3',
		large: '4',
		xlarge: '5',
	}

	const dimensions = {
		none: '',
		top: 't',
		right: 'e',
		bottom: 'b',
		left: 's',
		'top-bottom': 'y',
		'left-right': 'x',
	}

	const type = types[ name ]
	size = size ? ( sizes[ size ] ?? '0' ) : ''
	dimension = dimensions[ dimension ] ?? ''
	screen = sizes[ screen ]

	return type + ( dimension && `${ dimension }` ) + ( screen ? `-${ screen }` : '' ) + ( size && `-${ size }` )
}
