/**
 * Add block extensions both as a type and a namespace to enable lookup functionality and member access in both JSDoc and TS.
 */

type BlockExtensions = typeof BlockExtensions;
declare namespace BlockExtensions {
	type root = {
		readonly __BlockExtensions__?: "__root__";
	};

	const baseline: baseline;
	export interface baseline extends root {
		attributes?: BlockAttributes.baseline;
	}

	const align: align;
	export interface align extends root {
		attributes?: BlockAttributes.align; // => { align: string }

		/**
		 * Set block alignment.
		 *
		 * @param newValue
		 */
		setAlign(newValue: string|undefined): void;
	}

	// const background: background;
	// export interface background extends root{
	// 	attributes?: BlockAttributes.background;
	// }

	const backgroundColour: backgroundColour;
	export interface backgroundColour extends root {
		attributes?: BlockAttributes.background & BlockAttributes.backgroundColour;

		/**
		 * Set background colour.
		 *
		 * @param newColour
		 */
		setBackgroundColour: (newColour: string) => void;

		/**
		 * Set background alpha value in percent.
		 *
		 * @param alphaValuePct Omit to reset.
		 */
		setBackgroundAlpha: (alphaValuePct: number) => void;
	}

	const backgroundImage: backgroundImage;
	export interface backgroundImage extends root {
		attributes?: BlockAttributes.background & BlockAttributes.backgroundImage;

		/**
		 * Set background image.
		 *
		 * @param image
		 */
		setBackgroundImage: (image: BlockAttributes.ImageProps) => void;
	}

	const backgroundColourOverlay: backgroundColourOverlay;
	export interface backgroundColourOverlay extends root {
		attributes?: BlockAttributes.backgroundColourOverlay;
		/**
		 * Set image overlay colour.
		 *
		 * @param newColour
		 */
		setOverlayColour: (newColour: string) => void;

		/**
		 * Set overlay alpha value in percent.
		 *
		 * @param alphaValuePct Omit to reset.
		 */
		setOverlayAlpha: (alphaValuePct: number) => void;
	}

	const colourTheme: colourTheme;
	export interface colourTheme extends root {
		attributes?: BlockAttributes.background & BlockAttributes.colourTheme;

		/**
		 * Set colour theme.
		 *
		 * @param colourTheme
		 */
		setColourTheme: (
			colourTheme: WP.EditorColour | ColourThemePreset | string
		) => void;
	}

	const gutter: gutter;
	export interface gutter extends root {
		attributes?: BlockAttributes.gutter;
	}

	const margin: margin;
	export interface margin extends root {
		attributes?: BlockAttributes.margin;
	}

	const outerLayout: outerLayout;
	export interface outerLayout extends root {
		attributes?: BlockAttributes.outerLayout;
	}

	const padding: padding;
	export interface padding extends root {
		attributes?: BlockAttributes.padding;
	}

	const textAlign: textAlign;
	export interface textAlign extends root {
		attributes?: BlockAttributes.textAlign;
	}

	const width: width;
	export interface width extends root {
		attributes?: BlockAttributes.width;

		/**
		 * Set width preset.
		 *
		 * @param preset
		 */
		setWidthPreset(preset: string): void;
	}
}

type ColourExtensionsAttributeMap = {
	backgroundColour: "background";
	backgroundColourOverlay: "background";
	textColour: "textOptions";
};
