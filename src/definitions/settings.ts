/** Canonical list of valid blocks  */
type RegisteredBlocks = ["UniversalBox"];
type RegisteredBlocksList = RegisteredBlocks[number];

/** Valid block scopes */
type BlockScope = "outer" | "inner";

/** Icon lists - dashicons or internal */
type IconsSets = WP.Dashicon | keyof typeof import("@assets/icons").default;

/** Divide width presets into groups */
type WidthPresetCategories = "content" | "layout" | "auto" | "custom";

/** Implemented utility class name generators */
type UtilityClassNameGenerators = "blocky-blocks" | "bootstrap";

type SpacingAttributesList = "margin" | "padding" | "gutter";

/**
 * Plugin setup
 */
interface PluginConfig {
	frontEndScriptClassName: string;
	namespace: string;
	prefix: string;
	blocks: RegisteredBlocks;
	stylesheetIdPrefix: string;
	configurablePresets: Array<ConfigurablePresets[number]>;
	presetKeys: Array<keyof UncapitalizeObjectKeys<Presets>>;
	settingsKeys: Array<keyof PluginSettings>;
}


// type PluginSettingsKeys = [
// 	"blocks",
// 	"cssColourVariablePrefix",
// 	"frontEndScriptClassName",
// 	"namespace",
// 	"pluginUrl",
// 	"prefix",
// 	"configurablePresets",
// 	"settingsKeys",
// 	"presets",
// 	"stylesheetIdPrefix",
// 	"utilityClassNames"
// ];

/**
 * Config received from PHP
 */
interface ServerConfig {
	/** URL to plugin directory */
	pluginUrl: string;
	/** Asset directory name */
	assetDirectory: string;
}

/**
 * Configurable settings
 */
interface PluginSettings {
	/** Load colours from CSS variables, filtered by prefix */
	cssColourVariablePrefix?: string;

	/** Prefix for colour theme classes */
	themeClassPrefix?: string;

	/** Utility class name style */
	utilityClassNameTemplate?: UtilityClassNameGenerators;

	/** Preset config */
	presets?: UncapitalizeObjectKeys<Presets>;
}

/**
 * Plugin configuration and user settings
 */
interface BBConfig extends PluginConfig, PluginSettings, ServerConfig {
	// [Key in RegisteredBlocksList]: BlockSettings;
}

interface BlockSettings {
	customClassNames?: BlockData<string[]>;
	extraClassNames?: BlockData<string[]>;  //@deprecated
}

interface BlockConfig extends BlockSettings {
	blockVersion: number;
	classNames: BlockData<string[]>;
	fullBlockName: string;
	blockName: RegisteredBlocks[number];
	settingsKeys: Array<keyof BlockSettings>;
	attributeConfig: PlainObj;
}

type PublicConfig = PluginSettings &
	{
		[Key in RegisteredBlocksList]: BlockSettings;
	};

interface Presets {
	ColourThemes: ColourThemePreset[];
	MarginPresets: SpacingPreset[];
	GutterPresets: SpacingPreset[];
	PaddingPresets: SpacingPreset[];
	BreakpointConfig: ScreenSize[];
	BreakpointValues: PlainObj<number>;
	WidthConfig: PlainObj<number>;
	BlockAlignments: ButtonGroupButtonConfig[];
	FlexHorizontalAlignments: SpacingPreset[];
	FlexVerticalAlignments: SpacingPreset[];
	//FontStyles: WP.textAlignment[];
	GutterDimensions: { horizontal: string; vertical: string };
	SpacingDimensions: {
		top: string;
		bottom: string;
		left: string;
		right: string;
	};
	TextAlignments: WP.textAlignment[];
	WidthPresets: WidthPreset[];
}

type ConfigurablePresets = [
	"colourThemes",
	"gutterPresets",
	"marginPresets",
	"paddingPresets",
	"breakpointConfig",
	"widthConfig"
];

type AllPresets = ConfigurablePresets &
	[
		"colourThemes",
		"gutterPresets",
		"marginPresets",
		"paddingPresets",
		"breakpointConfig",
		"widthConfig",

		"blockAlignments",
		"flexHorizontalAlignments",
		"flexVerticalAlignments",
		"fontStyles",
		"gutterDimensions",
		"spacingDimensions",
		"textAlignments",
		"widthPresets"
	];


// Make Typescript aware of external global (created inline by WP)
declare const blockyBlocksPluginSettings: PublicConfig;
declare const blockyBlocksPluginConfig: ServerConfig;
