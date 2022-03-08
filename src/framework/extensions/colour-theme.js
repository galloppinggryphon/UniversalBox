import { arrayFind } from '@framework/utils'
import { pluginSettings } from '@framework/plugin-utils'

/**
 * Colour theme decorator.
 *
 * @param {ComposeBlockFramework<'colourTheme'>} block
 */
export default function withColourTheme( block ) {
	return { setColourTheme: SetColourTheme( block ) }
}

/**
 * Factory function for setColourTheme.
 *
 * @param {BlockFramework} block
 */
function SetColourTheme( block ) {
	const {
		colourThemes,
	} = pluginSettings.presets

	const { blockId, setProps } = block

	/**
	 * Set colour scheme based on color value
	 *
	 * @param colour Valid EditorColor colour object (with slug) or colour value.
	 *
	 * @type {GetTypeProp<GetBlockExtensions<'colourTheme'>, 'setColourTheme'>}
	 */
	const setColourTheme = ( colour ) => {
		_L3( `[${ blockId.current }] Set colour theme` )
		_log( 'Theme ID:', colour ?? 'n/a' )

		/** @type {Partial<GetAttribute<'colourTheme'>>} */
		const themeConfig = {}

		if ( ! colour ) {
			themeConfig.name = null
			themeConfig.disableBackgroundColour = null
		}
		else if ( typeof ( colour ) === 'string' ) {
			const colourObj = arrayFind( colourThemes, colour, 'color' )
			themeConfig.name = colourObj.slug
		}
		else if ( Object( colour ) === colour ) {
		// const colourObj = arrayFind( colourThemes.all, colour, 'color', true )
			themeConfig.name = colour.slug
		}

		setProps( 'colourTheme', themeConfig )
	}

	return setColourTheme
}

/**
 * Get theme item from colour value or slug.
 *
 * @param {'slug'|'color'} key Type of value
 * @param {string} value Colour value or slug
 * @return {ColourThemePreset}
 */
export function getTheme( key, value ) {
	const {
		colourThemes,
	} = pluginSettings.presets

	return arrayFind( colourThemes, value, key )
}
