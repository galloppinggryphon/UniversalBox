/**
 * Spacer Control
 */
export default function Spacer( { height } ) {
	height = Number( height )
	return (
		<div style={ { height: `${ height }px`, width: '100%' } }></div>
	)
}
