
import {
	BaseControl,
	TextareaControl,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'

import { useInstanceId } from '@wordpress/compose'

/**
 * Review compiled block CSS.
 *
 * @param {Object} props
 * @param {BlockData|(() => BlockData)} props.css
 */
export default function BlockCssControl( { css } ) {
	const instanceId = useInstanceId( BlockCssControl, 'BlockCssControl' )
	const rows = 5
	const cssData = typeof css === 'function' ? css() : css

	return <Fragment>
		<p>Review compiled front-end CSS.</p>
		<p>Outer</p>
		<BaseControl
			id={ `${ instanceId }-outer` }
			label="Outer block:"
		>
			<TextareaControl
				value={ cssData.outer }
				help="Read only."
				rows={ rows }
				onChange={ null }
				disabled
			/>
		</BaseControl>
		<BaseControl
			id={ `${ instanceId }-inner` }
			label="Inner block:"
		>
			<TextareaControl
				value={ cssData.inner }
				help="Read only."
				rows={ rows }
				onChange={ null }
				disabled
			/>
		</BaseControl>
	</Fragment>
}
