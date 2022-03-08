import { pluginSettings } from '@framework/plugin-utils'

import {
	ButtonGroupControl,
	Spacer,
} from '@framework/components'

import { Fragment } from '@wordpress/element'

/**
 * Inspector control for width.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'align'>} props.block
 */
export default function AlignControl( { block } ) {
	const { attributes, setAlign } = block

	const { blockAlignments } = pluginSettings.presets

	return (
		<Fragment>
			<ButtonGroupControl
				label="Select from group of buttons to control block alignment (and width)."
				key="align"
				selected={ attributes.align ?? '' }
				iconSize={ 20 }
				showInfo={ true }
				buttons={ blockAlignments }
				perRow={ 6 }
				onClick={ setAlign }
			/>
			<Spacer height="10" />
		</Fragment>
	)
}
