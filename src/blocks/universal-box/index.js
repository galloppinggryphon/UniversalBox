/**
 * ### Wordpress dependencies ###
 */

// @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
import { registerBlockType } from '@wordpress/blocks'

/**
 * ### Internal dependencies ###
 */

// All files containing `style` keyword are bundled together.
// #note: The code is applied to both the front end and editor
import './style.scss'

import { blockRegistrationSettings } from './settings'
import './filters'
import Edit from './edit'
import save from './save'
import deprecated from './deprecated'

/**
 * registerBlockType() settings - most config is done in block.json.
 *
 * !hack: trouble getting the right type here
 *
 * @type {any}
 */
const blockSettings = {
	...blockRegistrationSettings,

	// @todo: context
	// icon: { src: blockRegistrationSettings.icon },
	// attributes: blockAttributes, // Configure attributes
	// providesContext: blockRegistrationSettings.providesContext,
	// usesContext: blockRegistrationSettings.usesContext,

	edit: Edit,
	save,
	deprecated,
}

/**
 * Register block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( 'blocky-blocks/box', blockSettings )
