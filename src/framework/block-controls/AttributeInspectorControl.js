import {
	TextareaControl,
} from '@wordpress/components'

/**
 * Create an area to inspect all the attributes of a block.
 *
 * @param {Object} props
 * @param {BlockAttributes.attributes} props.attributes
 * @param {number} [props.rows]
 */
export default function AttributeInspectorControl( { attributes, rows = 15 } ) {
	return (
		<TextareaControl
			aria-label="Review block attributes"
			value={ JSON.stringify( attributes, null, 4 ) }
			help="All attributes set for the block. For review only."
			rows={ rows }
			onChange={ null }
			disabled
		/>
	)
}
