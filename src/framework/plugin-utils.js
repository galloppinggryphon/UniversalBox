import _ from 'lodash'
import { CSSGlobalVariables } from 'css-global-variables'

import SimpleStore from '@lib/simple-store-2'

import * as pluginDefaults from '~/plugin-config'

import {
	ExtendedArray,
	isObject,
	objectReduce,
} from '@framework/utils'

import {
	select,
	dispatch,
} from '@wordpress/data'

import { documentCssVars } from '@lib/css-variables'

/**
 * All plugin configuration details and user settings (see {@link BBConfig }).
 *
 * Loads and merges default config with user defined settings.
 *
 * Stores data in file context.
 *
 * Settings are received via the `blockyBlocksPluginSettings` and `blockyBlocksPluginConfig` globals.
 */
export const pluginSettings = new Proxy( /** @type {BBConfig} */ ( {} ), {
	get( target, property ) {
		if ( Object.keys( target ).length ) {
			return target[ property ]
		}

		const { configurablePresets, settingsKeys, presetKeys } = pluginDefaults.pluginConfig

		// Read pluginUrl
		/** @type {BBConfig} */
		const config = {}
		config.pluginUrl = blockyBlocksPluginConfig.pluginUrl
		config.assetDirectory = blockyBlocksPluginConfig.assetDirectory

		// Filter incoming settings
		/** @type {PluginSettings}} */
		const settings = settingsKeys.reduce( ( _config, _key ) => {
			_config[ _key ] = blockyBlocksPluginSettings[ _key ]
			return _config
		}, {} )

		Object.assign( pluginDefaults.pluginSettings, settings )

		delete settings.presets

		// Filter and merge default and received presets
		const presets = presetKeys.reduce( ( presetList, preset ) => {
			if ( blockyBlocksPluginSettings?.presets && preset in blockyBlocksPluginSettings.presets ) {
				presetList[ preset ] = blockyBlocksPluginSettings.presets[ preset ]
			}
			else if ( preset in pluginDefaults ) {
				presetList[ preset ] = pluginDefaults[ preset ]
			}
			return presetList
		}, {} )

		// Merge pluginDefaults and add presets
		const data = _.merge( config, settings, { presets } )
		return data[ property ]
	},
} )

/**
 * Merge default config with user defined block pluginDefaults.
 *
 * @param {BlockConfig} config
 */
export function loadBlockConfig( config ) {
	if ( ! ( config.blockName in blockyBlocksPluginSettings ) ) {
		return config
	}

	const blockConfigIncoming = blockyBlocksPluginSettings[ config.blockName ]

	/** @type {Partial<BlockConfig>} */
	const blockConfig = config.settingsKeys.reduce( ( _config, key ) => _config[ key ] = blockConfigIncoming[ key ], {} )

	return _.merge( config, blockConfig ) // mergeConfigSettings( config, pluginConfig )
}

/**
 * !! Not in use
 *
 * Deep merge objects (for getBlockConfig())
 *
 * @template {{}} Target
 * @param {Target} target
 * @param {{}} source
 */
function mergeConfigSettings( target, source ) {
	return Object.keys( target ).reduce( ( result, key ) => {
		// if ( key === 'classNames' ) {
		// 	result[ key ] = {
		// 		outer: classNames( result[ key ]?.outer, source?.[ key ]?.outer ),
		// 		inner: classNames( result[ key ]?.inner, source?.[ key ]?.inner ),
		// 	}
		// 	return result
		// }

		if ( ! ( key in source ) || source[ key ] === undefined ) {
			return result
		}

		const objValue = result[ key ]
		const srcValue = source[ key ]

		if ( Array.isArray( objValue ) ) {
			if ( ! Array.isArray( srcValue ) ) {
				return result
			}
			result[ key ] = [ ...objValue, ...srcValue ]
		}
		else if ( isObject( objValue ) ) {
			if ( ! isObject( srcValue ) ) {
				return result
			}
			result[ key ] = mergeConfigSettings( objValue, srcValue )
		}
		else {
			result[ key ] = srcValue
		}
		return result
	}, target )
}

/**
 * Retrieve theme pluginDefaults from WP database.
 *
 * @template {keyof WP.EditorSettings} Key
 * @param {Key} key Valid pluginDefaults key.
 * @return {WP.ThemeSettings<Key>}
 */
export function getThemeSettings( key = undefined ) {
	/** @type {any} */
	const themeSettings = select( 'core/block-editor' ).getSettings()
	if ( key ) {
		return themeSettings[ key ]
	}
	return themeSettings
}

/**
 * Check if any of the attributes creates a background.
 *
 * Attributes that create background: background.colour, background.image, colourTheme
 *
 * @param {BlockAttributes.attributes} attributes
 * @return {HasBackground} Object with details about which background properties are configured.
 */
export function blockHasBackground( attributes ) {
	const { background, colourTheme } = attributes

	const hasBackground = {
		any: false,
		theme: false,
		image: false,
		colour: false,
	}

	if ( colourTheme && colourTheme?.disableBackgroundColour !== true ) {
		hasBackground.any = true
		hasBackground.colour = true
	}

	if ( background?.image?.source?.url ) {
		hasBackground.any = true
		hasBackground.image = true
	}

	const { value } = background?.colour ?? {}
	if ( value?.color || value?.slug ) {
		hasBackground.any = true
		hasBackground.colour = true
	}

	return hasBackground
}

/**
 * Check if a value is a valid alpha value (< 1 && >= 0)
 *
 * @param {number} alpha
 */
export function isValidAlpha( alpha ) {
	return typeof alpha === 'number' && alpha < 1 && alpha >= 0
}

/**
 * Load CSS variables from browser window. Optionally apply filter.
 *
 * @param {string} filterPrefix
 * @return {PlainObj<string>}
 */
export function getCssVariables( filterPrefix = undefined ) {
	const storeName = 'css-variables'
	const cacheKey = filterPrefix || 'variables'

	// Filter
	if ( filterPrefix ) {
		const store = SimpleStore( storeName )
		const cache = store.get( cacheKey ) || {}

		if ( cache && Object.keys( cache ).length ) {
			return cache
		}

		const cssVar = documentCssVars( filterPrefix ) // parseCssColourVariables( ) || {}
		// const cssVar = new CSSGlobalVariables()

		const filteredVariables = objectReduce( cssVar, null, ( value, key, result ) => {
			if ( key.indexOf( `${ filterPrefix }` ) === 0 ) {
				result[ key.replace( `${ filterPrefix }`, '' ) ] = value
			}
		} )

		store.set( cacheKey, filteredVariables )

		return filteredVariables
	}

	return new CSSGlobalVariables()
}

/**
 * Retrieve CSS colour variables from the DOM and export as variable. Filters by prefix defined in pluginDefaults to separate colour variables.
 */
export function cssColourVariables() {
	const vars = documentCssVars( pluginSettings.cssColourVariablePrefix ) || {}
	// getCssVariables( pluginSettings.cssColourVariablePrefix ) || {}

	return vars
}

function parseCssColourVariables( ) {
	_red( 'getSettings', getThemeSettings( 'styles' ) )

	const styles = getThemeSettings( 'styles' )
	if ( ! styles ) {
		return
	}

	const { css } = styles[ 0 ]
	const bodyText = css.split( '{' )
	const rules = bodyText[ 1 ].replace( '}', '' ).split( ';' )

	const variables = rules.reduce( ( vars, rule ) => {
		if ( ! rule ) {
			return vars
		}
		const keyValue = rule.split( ':' )

		if ( keyValue[ 0 ].substring( 0, 2 ) !== '--' ) {
			return vars
		}

		const key = keyValue[ 0 ].substring( 2 )
		const value = keyValue[ 1 ].trim()

		vars[ key ] = value
		return vars
	}, {} )

	return variables
}

/**
 * Minimal string validator factory.
 *
 * @param {Object} options
 * @param {number|undefined} [options.minLength] Default = 0
 * @param {Array<'letter'|'dash'|'underscore'>|undefined} [options.startWith] Must begin with one of these characters
 * @param {string} [options.listSeparator] Default = undefined
 * @param {boolean} [options.allowEmptyList] Default = true
 */
export function StringValidator( { minLength = 0, startWith = undefined, listSeparator = undefined, allowEmptyList = true } = {} ) {
	const constraints = {
		letter: 'a-z',
		dash: '\\-',
		underscore: '_',
	}
	const startWithConstraint = startWith && startWith.map( ( constraint ) => {
		return constraints[ constraint ]
	} ).join( '' )

	const minLengthConstraint = minLength - ( startWithConstraint ? 1 : 0 )

	const rx = new ExtendedArray()

	rx.push( '^' )
	rx.pushIf( !! startWithConstraint, `[${ startWithConstraint }]` )
	rx.pushIf( startWithConstraint && minLength > 0, '{1,}' )
	rx.push( '[\\w\-_]' )
	rx.push( `{${ minLengthConstraint },}` )

	const pattern = new RegExp( rx.join( '' ), 'gi' )

	// For reference:
	// regex = /^[a-z][\w-_]{3,}/gi

	/**
	 * Validate string.
	 *
	 * @param {string|undefined} input
	 */
	return ( input = undefined ) => {
		// _log( 'Validate:', input, typeof input )
		_info( 'pattern', rx.join( '' ), pattern )

		if ( typeof input !== 'string' || input === undefined || input === null ) {
			_red( 'invalid' )
			return false
		}

		const value = input.trim()

		if ( ! listSeparator ) {
			return !! ( value && value.match( pattern ) )
		}

		if ( value === '' ) {
			_log( { allowEmptyList } )
			return allowEmptyList
		}

		const elements = value.split( listSeparator )

		_log( 'elements', elements )

		const isInvalid = elements.some( ( element ) => {
			const elementValue = element.trim()
			_log( 'elementValue', elementValue )

			if ( elementValue === '' ) {
				return false
			}
			const m = elementValue.match( pattern )
			_log( 'm', m, m === null )
			return m === null
		} )

		_log( 'isInvalid', isInvalid )

		return ! isInvalid
	}
}

/**
 * Get path to plugin icon.
 *
 * @param {string} icon Name of plugin icon, without path or extension
 */
// export function getSvgAsset( icon ) {
// 	const { pluginUrl, assetDirectory } = pluginConfig
// 	const file = `${ pluginUrl }/${ assetDirectory }/svg/${ icon }.svg`
// 	return file
// }

/**
 * Retrieve responsive props from any object formatted like an attribute object.
 * Attributes structure: attributes.key[.responsiveProps[.size[.property]]].
 *
 * @template {PlainObj} AttrObj
 * @template {keyof AttrObj} AttrKey
 * @template {string|void} Screen
 * template {ValidateKeyOf<ScreenProp, GetAttributeScreenProps<AttrObj, AttrKey>>} ScreenProp
 * @param {AttrObj} attributes
 * @param {AttrKey} attrKey
 * @param {Screen} screen
 * @return {GetAttributeProps<AttrObj, AttrKey, Screen>}
 */
export function getAttrProps( attributes, attrKey, screen = null ) {
	if ( ! attributes ) {
		return
	}
	if ( ! screen ) {
		return attributes[ attrKey ] || undefined
	}

	const attr = attributes[ attrKey ]
	if ( ! attr || ! ( 'responsiveProps' in attr ) ) {
		return
	}

	if ( ! ( screen in attr.responsiveProps ) ) {
		return
	}

	return attr.responsiveProps[ screen ]

	// if ( ! screenProp ) {
	// 	return screenProps
	// }

	// if ( ! ( screenProp in screenProps ) ) {
	// 	return
	// }

	// return screenProps[ screenProp ]
}

/**
 * Create toast message (floats in bottom left corner).
 *
 * @param {WP.NoticeStatus} status
 * @param {string} message
 * @param {'snackbar'|'notice'} [type]
 */
export function notice( status, message, type = 'snackbar' ) {
	const { createNotice } = dispatch( 'core/notices' )
	const _type = type === 'notice' ? 'default' : type
	createNotice( status, message, { type: _type } )
}
