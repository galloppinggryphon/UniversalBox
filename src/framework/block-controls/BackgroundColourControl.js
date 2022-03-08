import {
	AdvancedColourSelector,
	AlphaControl,
	Clue,
} from '@framework/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 * Create colour control for a given colour attribute (e.g. background). Returns inspector control component and colour setter.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'backgroundColour'|'backgroundImage'>} props.block
 */
export default function BackgroundColourControl( { block } ) {
	const background = block.attributes?.background
	const colourProps = background?.colour
	const setColour = block.setBackgroundColour
	const setAlpha = block.setBackgroundAlpha

	const { value, alpha } = colourProps ?? {}

	if ( background?.image?.source?.url ) {

	}

	/**
	 * Colour palette and alpha control.
	 */
	const ColourComponent =
		<Fragment>
			{
				background?.image?.source?.url &&
					<Clue>This block has a background image, but the background colour will be visible while the image is loading or if it fails to load.</Clue>
			}
			<AdvancedColourSelector
				selected={ value }
				onChange={ setColour }
			/>
			{ ( value?.color || value?.slug ) &&
				<Fragment>
					<hr />
					<AlphaControl value={ alpha } setAlpha={ setAlpha } />
				</Fragment>
			}
		</Fragment>

	return ColourComponent
}
