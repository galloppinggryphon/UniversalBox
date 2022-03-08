import {
	AdvancedColourSelector,
	AlphaControl,
	ImageControl,
	InspectorPanel,
	Spacer,
} from '@framework/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 * Create colour control for a given colour attribute (e.g. background). Returns inspector control component and colour setter.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'backgroundImage'|'backgroundColourOverlay'>} props.block
 */
export default function BackgroundImageControl( { block } ) {
	const { image, overlayColour } = block.attributes?.background ?? {}

	const setImage = block.setBackgroundImage
	const setColour = block.setOverlayColour
	const setAlpha = block.setOverlayAlpha

	return (
		<Fragment>
			<ImageControl
				image={ image }
				setImage={ setImage }
			/>

			{ image?.source?.url && <Spacer height={ 20 } /> }
			{ image?.source?.url &&
			<InspectorPanel title="Overlay Colour" initialOpen={ !! overlayColour?.value }>
				<AdvancedColourSelector
					selected={ overlayColour?.value }
					onChange={ setColour }
				/>
				{ ( overlayColour?.value?.color || overlayColour?.value?.slug ) &&
				<Fragment>
					<hr />
					<AlphaControl value={ overlayColour.alpha } setAlpha={ setAlpha } />
				</Fragment>
				}
			</InspectorPanel>

			}
		</Fragment>
	)
}
