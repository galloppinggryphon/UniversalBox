/**
 * Configuration settings for this block only.
 */
import * as settings from '~/plugin-config'
import * as defaults from '~/block-config'
import Icons from '@assets/icons'

/**
 * @type {BlockConfig}
 */
const blockSetup = 	{
	/** Increment block version on each breaking change of attributes */
	blockVersion: 15,

	/** Internal block name */
	blockName: 'UniversalBox',

	/** Fully qualified block name */
	fullBlockName: `${ settings.pluginConfig.namespace }/box`,

	/** Default class names */
	classNames: { outer: [ 'bb-box' ], inner: [ 'bb-box-inner' ] },

	/** User configurable settings  */
	settingsKeys: [ 'extraClassNames', 'customClassNames' ],

	/** Use default attibute config */
	attributeConfig: defaults.blockAttributeConfig,
}

/**
 * Inherit default block attributes
 */
const blockAttributes = defaults.blockAttributes

/**
 * Dynamic block registration settings. Most settings are provided in block.json.
 *
 * @type {WP.Block}
 */
const blockRegistrationSettings = {
	icon: { src: Icons.UBLogoLight },
	attributes: blockAttributes, // provide master attribute settings

	// #todo: block context
	// providesContext: {
	// 	[ `${ fullBlockName }/blockId` ]: 'blockId',
	// 	[ `${ fullBlockName }/innerLayout` ]: 'innerLayout',
	// 	[ `${ fullBlockName }/colourTheme` ]: 'colourTheme',
	// },
	// usesContext: [
	// 	`${ fullBlockName }/blockId`,
	// 	`${ fullBlockName }/innerLayout`,
	// 	`${ fullBlockName }/colourTheme`,
	// ],
}

/**
 * #todo - block types.
 */
const blockTypePresets = []

/**
 * ### Inspector control tabs ###
 *
 * @type {TabPanelTab[]}
 */
const inspectorTabs = [
	{
		name: 'style',
		title: 'Style',
		icon: 'admin-appearance',
	},
	{
		name: 'layout',
		title: 'Layout',
		icon: 'layout',
	},
	// {
	// 	name: 'advanced',
	// 	title: 'Advanced layout',
	// 	icon: 'dashboard',
	// },
]

export {
	blockAttributes,
	blockSetup,
	// blockSetup,
	blockRegistrationSettings,
	blockTypePresets,
	inspectorTabs,
}
