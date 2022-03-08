/**
 * SVG wrapper component.
 *
 * @param {Object} props
 * @param {SVGComponent} props.svg
 * @param {number|string=} props.size
 */
export default function SvgItem( { svg, size = 24 } ) {
	const SVG = svg
	return <SVG width={ size } height={ size } />
}
