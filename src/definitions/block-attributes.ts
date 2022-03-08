/**
 * Block attribute definitions.
 */

type BlockAttributes = typeof BlockAttributes;
declare namespace BlockAttributes {
	export type attributes = Unwrap<
		baseline &
			align &
			background &
			backgroundColour &
			backgroundColourOverlay &
			backgroundImage &
			colourTheme &
			gutter &
			innerLayout &
			margin &
			outerLayout &
			padding &
			textAlign &
			textOptions &
			width
	>;


	//! Not required?
	export interface Root {
		__root__?: "root"; //Enable type discrimination
	}

	const baseline: baseline;
	export interface baseline extends Root {
		blockId?: string;
		blockVersion?: number;
		extraClassNames?: string;
		customClassNames?: BlockData<string[]>;
	}

	const align: align;
	export interface align extends Root {
		align?: string;
	}

	const background: background;
	export interface background extends Root {
		background?: {
		};
	}

	const backgroundColour: backgroundColour;
	export interface backgroundColour extends Root {
		background?: {
			colour: ColourProps;
		};
	}

	const backgroundImage: backgroundImage;
	export interface backgroundImage extends Root {
		background?: {
			image?: ImageProps;
		};
	}

	const backgroundColourOverlay: backgroundColourOverlay;
	export interface backgroundColourOverlay extends Root {
		background?: {
			overlayColour?: ColourProps;
		};
	}

	const colourTheme: colourTheme;
	export interface colourTheme extends Root {
		colourTheme?: {
			name: string;
			disableBackgroundColour?: boolean;
		};
	}

	const gutter: gutter;
	export interface gutter extends Root {
		gutter?: {
			responsiveProps?: {
				[key: string]: {
					disabled?: boolean;
					enableCustom?: boolean;
					horizontalPreset?: string;
					verticalPreset?: string;
					// all?: any
					horizontal?: string;
					vertical?: string;
				};
			};
		};
	}

	const innerLayout: innerLayout;
	export interface innerLayout extends Root {
		// Describes behaviour of content
		innerLayout?: {
			type?: ""; // flexbox-rows|flexbox-columns
			responsiveProps?: {
				[key: string]: {
					disabled?: any;
					// todo?: move type in here
					alignItems?: any; // control placement on cross-axis
					alignContent?: any; // control placement of space on cross-axis (if multi-line)
					forceRowMode?: any;
					dividerHorizontal?: any;
					dividerVertical?: any;
					equalHeightOff?: any; // Todo?: equal height as the default Check render()
					flexWrap?: any;
					justifyContent?: any;
				};
			};
		};
	}

	const margin: margin;
	export interface margin extends Root {
		margin?: {
			preset?: string;
			enableCustom?: boolean;
			responsiveProps?: {
				[key: string]: SpacingResponsiveProps;
			};
		};
	}

	const outerLayout: outerLayout;
	export interface outerLayout extends Root {
		// Describes behaviour of box relative to adjacent boxes
		outerLayout?: {
			type?: string; // flex-row|flex-column
			parentLayoutType?: string; // v5
			responsiveProps?: {
				[key: string]: {
					// todo?: move type in here
					disabled?: boolean;
					flexWidthMode?: string; // v9 any(fit-space)|fit-content|flexible|fixed
					flexOrder?: string; // v5 from order
					flexGrow?: any; // v5 from width.flexAutoGrow
					flexShrink?: any; // v5
					flexBase?: any; // v5 from width.flexWidth
				};
			};
		};
	}

	const padding: padding;
	export interface padding extends Root {
		padding?: {
			/**
			 * Use default background padding if the block has any background properties: colour, image or theme
			 *
			 * Conditions for skipping background-padding:
			 * - theme = true
			 * - background = 0
			 * - noAutoBgPadding = false
			 * - disableThemeBackground = true
			 */
			noAutoBgPadding?: boolean;
			preset?: string;
			enableCustom?: boolean;
			responsiveProps?: ResponsiveProps<SpacingResponsiveProps>;
		};
	}

	const textAlign: textAlign;
	export interface textAlign {
		textAlign?: string;
	}

	const textOptions: textOptions;
	export interface textOptions extends Root {
		textOptions?: {
			/**
			 * @deprecated - use attributes.textAlign
			 */
			align?: any;
			colour?: ColourProps;
			fontStyle?: any;
		};
	}

	const width: width;
	export interface width extends Root {
		width?: {
			type?: string; //undefined == auto
			preset?: string;
			responsiveProps?: ResponsiveProps<{
				disabled?: boolean;
				absoluteWidth?: number;
				minWidth?: string;
				maxWidth?: string;
				relativeWidth?: number;
				type?: "relative" | "absolute";
			}>;
		};
	}

	export interface ColourProps {
		value: WP.EditorColour; // store WP withColors colour object
		alpha?: number;
	}

	export interface ImageProps {
		source: {
			url?: string;
			id?: number;
		};
		position?: any[];
		attachment?: {};
		alpha?: number;
		attachmentFixed?: boolean;
	}

	// Shared responsive props
	export interface SpacingResponsiveProps {
		disabled?: boolean;
		//preset?: string;
		locked?: boolean;
		all?: number;
		left?: number;
		right?: number;
		top?: number;
		bottom?: number;
	}

	type Attribute<
		Name extends string,
		Key extends string,
		Props extends PlainObj
	> = Record<Name, Record<Key, Props>>;
}

type ResponsiveProps<RP extends PlainObj> = { [key: string]: RP };
