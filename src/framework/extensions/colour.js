import _ from 'lodash'

import { getThemeSettings } from '@framework/plugin-utils'

import {
	getColorObjectByAttributeValues,
	getColorObjectByColorValue,
} from '@wordpress/block-editor'

/**
 * Background colour decorator. Return props/methods to add to `block`.
 *
 * @param block Block framework
 * @type {WithColour<'backgroundColour'>}
 */
export function withBackgroundColour( block ) {
	return {
		setBackgroundAlpha: SetAlpha( 'background', 'colour', block ),
		setBackgroundColour: SetColour( 'background', 'colour', block ),
	}
}

/**
 * Colour overlay decorator. Return props/methods to add to `block`.
 *
 * @param block Block framework
 * @type {WithColour<'backgroundColourOverlay'>}
 */
export function withOverlayColour( block ) {
	return {
		setOverlayAlpha: SetAlpha( 'background', 'overlayColour', block ),
		setOverlayColour: SetColour( 'background', 'overlayColour', block ),
	}
}

/**
 * setColour factory
 *
 * @template {keyof BlockAttributes.attributes} AttrName
 * @template {keyof BlockAttributeColourProps<AttrName>} PropName
 * @param {AttrName} attrName Parent attribute
 * @param {PropName} colourProp Colour object
 * param {ValueOf<Pick<BlockFramework, 'setProps'>>} setProps block.setProps
 * @param {BlockFramework} block
 */
export function SetColour( attrName, colourProp, block ) {
	const { setProps } = block

	/**
	 * Save colour in attributes.
	 *
	 * @param {string|undefined} newColour Colour hex value
	 */
	const setColour = ( newColour = undefined ) => {
		_L3( `[${ block.blockId.current }] setColour: ${ attrName }.${ colourProp }` )
		_log( { [ colourProp ]: newColour } )
		_log( 'block', block )

		if ( newColour ) {
			// Translate colour value to colour object
			const colourObject = getColorObjectByColorValue( getThemeSettings( 'colors' ), newColour )

			if ( colourObject ) {
				// detach or create empty object
				/** @type {Partial<colourObject>} */
				const colour = _.clone( colourObject )

				if ( colourObject.slug ) {
					// Save only the slug
					// remove color -- should be generated from slug when retrieved
					// remove name -- no need to save that
					delete colour.name
					delete colour.color
				}
				// If no colour object --> custom colour
				else {
				// remove previous slug
					delete colour.slug
					colourObject.color = newColour
				}
			}

			_log( 'Saving:', { [ colourProp ]: colourObject } )

			setProps( attrName, {
				[ colourProp ]: { value: colourObject },
			} )
		}
		// unset
		else {
			setProps( attrName, {
				[ colourProp ]: undefined,
			} )
		}
	}

	return setColour
}

/**
 * setAlpha factory
 *
 * @template {keyof BlockAttributes.attributes} AttrName
 * @template {keyof BlockAttributeColourProps<AttrName>} PropName
 * @param {AttrName} attrName Parent attribute
 * @param {PropName} colourProp Colour property
 * @param {BlockFramework} block
 */
export function SetAlpha( attrName, colourProp, block ) {
	const { setProps } = block

	/**
	 * Set alpha value in percent.
	 *
	 * @param {number} [alphaValuePercent] Omit to remove alpha value.
	 */
	const setAlpha = ( alphaValuePercent = undefined ) => {
		setProps( attrName, {
			[ colourProp ]: { alpha: alphaValuePercent },
		} )
	}

	return setAlpha
}

/**
 * Get colour object from registered theme colours based on colour slug or colour value.
 *
 * @param {PlainObj|WP.EditorColour|string} colour Colour slug as string or colour object with colour value or slug.
 * @param {Required<WP.EditorColour>[]} [themeColours] Colour collection. Defaults to theme colours.
 * @return {WP.EditorColour} Colour object based on colour slug.
 */
export function getColour( colour, themeColours = getThemeSettings( 'colors' ) ) {
	const slug = ( typeof colour === 'string' ) ? colour : colour?.slug
	return getColorObjectByAttributeValues( themeColours, slug, '' )
}
