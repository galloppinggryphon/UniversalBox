/**
 * Core plugin settings
 *
 * @type {PluginConfig}
 */
const pluginConfig = {
	blocks: [ 'UniversalBox' ],
	namespace: 'blocky-blocks',
	prefix: 'bb',
	frontEndScriptClassName: 'blocky-blocks-block-config',
	stylesheetIdPrefix: 'bb-editor-block-styles-',
	settingsKeys: [ 'cssColourVariablePrefix', 'themeClassPrefix', 'presets', 'utilityClassNameTemplate' ],
	configurablePresets: [ 'colourThemes', 'gutterPresets', 'marginPresets', 'paddingPresets', 'breakpointConfig', 'widthConfig' ],
	presetKeys: [
		'colourThemes',
		'gutterPresets',
		'marginPresets',
		'paddingPresets',
		'breakpointConfig',
		'widthConfig',
		'blockAlignments',
		'flexHorizontalAlignments',
		'flexVerticalAlignments',
		// 'fontStyles',
		'gutterDimensions',
		'spacingDimensions',
		'textAlignments',
		'widthPresets',
	],
}

/**
 * Plugin settings baseline
 *
 * @type {PluginSettings}
 */
const pluginSettings = {
	cssColourVariablePrefix: 'colour-',
	themeClassPrefix: 'theme-',
	utilityClassNameTemplate: 'blocky-blocks',
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ### ### ### PRESETS ### ### ###
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ### FONT STYLES ###

// #todo - font styles
// #todo: does not conform to type
/** //type {Preset<'FontStyles'>} */
const fontStyles = [
	{ label: '', value: '', class: '' },
	{ label: 'Normal', value: 'body', class: 'font-style-normal' },
	{ label: 'Secondary', value: 'secondary', class: 'font-style-secondary' },
	{ label: 'Small', value: 'small', class: 'font-style-small' },
	{ label: 'Large', value: 'large', class: 'font-style-large' },
]

// ### Colour themes ###

/**
 * Colour themes
 *
 * #todo: make configurable through theme.
 *
 * @type {Preset<'ColourThemes'>}
 */
const colourThemes = [
	{ name: 'Primary', category: 'Main colours', slug: 'primary', class: 'colour-theme-primary', color: 'var(--dd-colour-primary)' },
	{ name: 'Primary Light', category: 'Main colours', slug: 'primary-light-2', class: 'colour-theme-primary-light-2', color: 'var(--dd-colour-primary-light-2)' },
	{ name: 'Primary Ultra Light', category: 'Main colours', slug: 'primary-light-1', class: 'colour-theme-primary-light-1', color: 'var(--dd-colour-primary-light-1)' },

	{ name: 'Primary Dark', category: 'Main colours', slug: 'primary-dark-1', class: 'colour-theme-primary-dark-1', color: 'var(--dd-colour-primary-dark-1)' },

	{ name: 'Secondary', category: 'Main colours', slug: 'secondary', class: 'colour-theme-secondary', color: 'var(--dd-colour-secondary)' },
	{ name: 'Secondary Light', category: '', slug: 'secondary-light-2', class: 'colour-theme-secondary-light-2', color: 'var(--dd-colour-secondary-light-2)' },
	{ name: 'Secondary Ultra Light', category: '', slug: 'secondary-light-1', class: 'colour-theme-secondary-light-1', color: 'var(--dd-colour-secondary-light-1)' },
	{ name: 'Extra 1-1', category: '', slug: 'extra-1-1', class: 'colour-theme-extra-1-1', color: 'var(--dd-colour-extra-1-1)' },
	{ name: 'Extra 1-2', category: '', slug: 'extra-1-2', class: 'colour-theme-extra-1-2', color: 'var(--dd-colour-extra-1-2)' },
	{ name: 'Extra 1-3', category: '', slug: 'extra-1-3', class: 'colour-theme-extra-1-3', color: 'var(--dd-colour-extra-1-3)' },

	{ name: 'Black', category: 'Neutral colours', slug: 'black', class: 'colour-theme-black', color: 'black' },
	{ name: 'White', category: 'Neutral colours', slug: 'white', class: 'colour-theme-white', color: 'white' },

	{ name: 'Neutral 1', category: 'Neutral colours', slug: 'neutral-1', class: 'colour-theme-neutral-1', color: 'var(--dd-colour-neutral-1)' },
	{ name: 'Neutral 2', category: 'Neutral colours', slug: 'neutral-2', class: 'colour-theme-neutral-2', color: 'var(--dd-colour-neutral-2)' },
	{ name: 'Neutral 3', category: 'Neutral colours', slug: 'neutral-3', class: 'colour-theme-neutral-3', color: 'var(--dd-colour-neutral-3)' },

	{ name: 'High contrast 1', category: 'Neutral colours', slug: 'contrast-1', class: 'colour-theme-contrast-1', color: 'var(--dd-colour-contrast-1)' },
	{ name: 'High contrast 2', category: 'Neutral colours', slug: 'contrast-2', class: 'colour-theme-contrast-2', color: 'var(--dd-colour-contrast-2)' },
	{ name: 'High contrast 3', category: 'Neutral colours', slug: 'contrast-3', class: 'colour-theme-contrast-3', color: 'var(--dd-colour-contrast-3)' },

	{ name: 'Extra 2-1', category: 'Extended palette', slug: 'extra-2-1', class: 'colour-theme-extra-2-1', color: 'var(--dd-colour-extra-2-1)' },
	{ name: 'Extra 2-2', category: 'Extended palette', slug: 'extra-2-2', class: 'colour-theme-extra-2-2', color: 'var(--dd-colour-extra-2-2)' },
	{ name: 'Extra 2-3', category: 'Extended palette', slug: 'extra-2-3', class: 'colour-theme-extra-2-3', color: 'var(--dd-colour-extra-2-3)' },
]

// Add array of all colour schemes

// [ ...colourThemes.main, ...colourThemes.neutrals, ...colourThemes.more ]

/**
 * Responsive screen sizes.
 *
 * @type {Preset<'BreakpointConfig'>}
 */
const breakpointConfig = [
	{
		name: 'all',
		title: 'All',
		altTitle: 'All Screens',
		icon: 'screenoptions',
		description: 'Rules for all screens',
		className: 'tab-screen-all',
	},
	{
		name: 'large',
		title: 'Desktop',
		altTitle: 'Large',
		icon: 'laptop',
		description: 'Large screens > 1024px (laptops, desktops, iPad landscape)',
		className: 'tab-screen-large',
		minWidth: 1024,
	},
	{
		name: 'medium',
		title: 'Tablet',
		altTitle: 'Medium',
		icon: 'tablet',
		description: 'Medium screens >768px (tablets, iPad portrait)',
		className: 'tab-screen-medium',
		maxWidth: 1023,
		minWidth: 768,
	},
	{
		name: 'small',
		title: 'Mobile',
		altTitle: 'Small',
		icon: 'smartphone',
		description: 'Small screens < 768px (phones)',
		className: 'tab-screen-small',
		maxWidth: 767,
	},
]

// ### Widths ###
// Relative to 700px, rounded to a close whole number
/** @type {Preset<'WidthConfig'>} */
const widthConfig = {
	thumbnail: 100,
	xsmall: 175, // 25%
	small: 230, // 33%
	medium: 350, // 50%
	large: 460, // 66%
	content: 700, // 100% (content width)
	wide: 1100, // Site width
}

/**
 * @type {Preset<'WidthPresets'>}
 */
const widthPresets = [
	{ label: 'Auto', title: 'Automatic Fit', category: 'auto', value: '', icon: 'WidthAuto', help: 'Let the box expand to fit its container or its max-width (if configured). Shrinks to the size of its own content when left, right or centre aligned.' },

	{ label: 'Small', title: `Small (${ widthConfig.small }px)`, category: 'content', value: 'small', icon: 'WidthSmall', help: `Equal to approx. one third of the content width (${ widthConfig.small }px)` },
	{ label: 'Medium', title: `Medium (${ widthConfig.medium }px)`, category: 'content', value: 'medium', icon: 'WidthMedium', help: `Equal to half the content width (${ widthConfig.medium }px)` },
	{ label: 'Large', title: `Large (${ widthConfig.large }px)`, category: 'content', value: 'large', icon: 'WidthLarge', help: `Equal to approx. two thirds of the content width (${ widthConfig.large }px)` },

	{ label: 'Content', title: `Main content area width (${ widthConfig.content }px)`, category: 'layout', value: 'content', icon: 'WidthContent', help: `Set to the width of the main content area (${ widthConfig.content }px)` },
	{ label: 'Wide', title: `Site width (${ widthConfig.wide }px)`, category: 'layout', value: 'wide', icon: 'WidthWide', help: `Fit to the width of the whole site (${ widthConfig.wide }px)` },
	{ label: 'Full', title: 'Expand to fit screen width', category: 'layout', value: 'full', icon: 'WidthFull', help: '' },

	{ label: 'Custom', title: `Set custom width`, category: 'custom', value: 'custom', icon: 'WidthContent', help: `Use the custom width controls to configure this block.` },
]

// ### SPACING ###

const gutterDimensions = [ { horizontal: 'Horizontal' }, { vertical: 'Vertical' } ]
const spacingDimensions = [ { top: 'Top' }, { bottom: 'Bottom' }, { left: 'Left' }, { right: 'Right' } ]

/** @type {Preset<'MarginPresets'>} */
const marginPresets = [
	{ label: 'Default', value: '' },
	{ label: 'No margin', value: 'none' },
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
]

/** @type {Preset<'PaddingPresets'>} */
const paddingPresets = [
	{ label: 'Default', value: '' },
	{ label: 'No padding', value: 'none' },
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
]

/**
 * #todo: advanced layouts
 *
 * @type {Preset<'GutterPresets'>}
 */
const gutterPresets = [
	{ label: 'Default', value: '' },
	{ label: 'No gutters', value: 'none' },
	{ label: 'Tiny', value: 'xxsmall' },
	{ label: 'X-Small', value: 'xsmall' },
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
]

// ### ALIGNMENT ###

/** @type {Preset<'BlockAlignments'>} */
const blockAlignments = [
	{ title: 'No alignment', value: '', icon: 'align-none' },
	{ title: 'Left aligmnent', value: 'left', icon: 'align-left' },
	{ title: 'Centre alignment', value: 'center', icon: 'align-center' },
	{ title: 'Right alignment', value: 'right', icon: 'align-right' },
	{ title: 'Wide width', value: 'wide', icon: 'align-wide', description: 'Expand to width of the site header if space is available.' },
	{ title: 'Full width', value: 'full', icon: 'align-full-width', description: 'Span whole width of screen.' },
]

// #todo: advanced layouts
/** @type {Preset<'FlexHorizontalAlignments'>} */
const flexHorizontalAlignments = [
	{ label: 'Default', value: '' },
	{ label: 'Left', value: 'flex-start' },
	{ label: 'Right', value: 'flex-end' },
	{ label: 'Centre', value: 'center' },
	{ label: 'Max Space Between', value: 'space-between' },
	{ label: 'Stretch', value: 'stretch' },
]

// #todo: advanced layouts
/** @type {Preset<'FlexVerticalAlignments'>} */
const flexVerticalAlignments = [
	{ label: 'Default', value: '' },
	{ label: 'Top', value: 'flex-start' },
	{ label: 'Bottom', value: 'flex-end' },
	{ label: 'Middle', value: 'center' },
	{ label: 'Max Space Between', value: 'space-between' },
	{ label: 'Stretch', value: 'stretch' },
]

/**
 * Aligmnent values for AlignmentToolbar.
 *
 * @type {Preset<'TextAlignments'>}
 */
const textAlignments = [
	{
		icon: 'minus',
		title: 'No Alignment',
		align: undefined,
	},
	{
		icon: 'editor-justify',
		title: 'Justify Text',
		align: 'justify',
	},
	{
		icon: 'editor-alignleft',
		title: 'align Text Left',
		align: 'left',
	},
	{
		icon: 'editor-aligncenter',
		title: 'align Text Center',
		align: 'center',
	},
	{
		icon: 'editor-alignright',
		title: 'align Text Right',
		align: 'right',
	},
]

export {
	blockAlignments,
	colourThemes,
	flexHorizontalAlignments,
	flexVerticalAlignments,
	fontStyles,
	gutterPresets,
	gutterDimensions,
	marginPresets,
	paddingPresets,
	pluginConfig,
	pluginSettings,
	breakpointConfig,
	spacingDimensions,
	textAlignments,
	widthConfig,
	widthPresets,
}
