/**
 * Settings used to register blocks - list all possible attributes.
 *
 * @type {WP.BlockAttributes}
 */
const blockAttributes = {
	// redeclare built-in attribute to make it available
	align: {
		type: 'string',
	},
	background: {
		type: 'object',
	},
	blockId: {
		type: 'string',
	},
	// blockPreset: {
	// 	type: 'string',
	// },
	// blockType: {
	// 	type: 'string',
	// },
	blockVersion: {
		type: 'number',
	},
	colourTheme: {
		type: 'object',
	},
	customClassNames: {
		type: 'object',
	},
	extraClassNames: {
		type: 'string',
	},
	// gutter: {
	// 	type: 'object',
	// },
	height: {
		type: 'object',
	},
	// innerLayout: {
	// 	type: 'object',
	// },
	margin: {
		type: 'object',
	},

	// otherSettings: {
	// 	type: 'object',
	// },

	// outerLayout: {
	// 	type: 'object',
	// },

	padding: {
		type: 'object',
	},
	// preset: {
	// 	type: 'string',
	// },
	textAlign: {
		type: 'string',
	},
	// textOptions: {
	// 	type: 'object',
	// },
	width: {
		type: 'object',
	},
}

/**
 * Defaults and attribute configuration (e.g. range values)
 *
 * @type {PlainObj}
 */
const blockAttributeConfig = {

	// blockType: 'div',

	innerLayout: {
		responsiveProps: {
			all: {
				justifyContent: 'space-between',
			},
		},
	},

	gutter: {
		__config: {
			enableLock: false,
			maxRange: 100,
		},
	},

	margin: {
		__config: {
			enableLock: true,
			maxRange: 300,
			minRange: -300,
		},
	},

	padding: {
		__config: {
			enableLock: true,
			maxRange: 300,
		},
	},

	width: {
		__config: {
			minRange: 75,
			maxRange: 1200,
		},
	},
}

export {
	blockAttributeConfig,
	blockAttributes,
}
