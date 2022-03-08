// ### Additional global base types ###

/**
 * Shorthand for literal objects, POTS. Same as Record<string, %type%>.
 */
 interface PlainObj<Type = any> {
	[key: string]: Type;
}

type fnVoid = () => void

type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

declare module "*.svg" {
	// import React = require('react');
	/**
	 * SVG component.
	 */
    export const ReactComponent: SVGComponent

	/**
	 * SVG source, as base64 encoded string.
	 */
    const src: string;
	export default src
}
