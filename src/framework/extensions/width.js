import * as sharedSettings from '~/plugin-config'
import { arrayFind } from '@framework/utils'

/**
 * Use to control width and also aspects of alignment, since they are interrelated.
 *
 * @param {ComposeBlockFramework<'align'|'width'>} block
 * @return {GetBlockExtensions<'width'>}
 */
export default function withWidth( block ) {
	const { align } = block.attributes

	const { blockId, setAttr, setProps } = block
	const { widthPresets } = sharedSettings

	return {
		setWidthPreset( preset ) {
			_L3( `[${ blockId.current }] Set width preset` )
			_log( 'Applying preset:', preset )

			if ( preset && ! arrayFind( widthPresets, preset, 'value' ) ) {
				console.warn( 'Tried to set invalid width preset: ', preset )
				return
			}

			// wide and full are special cases - they are built into Gutenberg and are handled as alignments
			if ( preset === 'wide' || preset === 'full' ) {
				setAttr( { align: preset } )
			}
			else if ( align === 'full' || align === 'wide' ) {
				setAttr( { align: '' } )
			}

			setProps( 'width', { preset } )
		},
	}
}
