import {
	useEffect,
	useRef,
} from '@wordpress/element'

import { notice } from '@framework/plugin-utils'

/**
 * Use to control block alignment and some aspects of width and layout, since they are interrelated.
 *
 * @param {ComposeBlockFramework<'align'|'width'|'outerLayout'>} block
 * @return Returns function for setting alignment.
 */
export default function useAlign( block ) {
	const { attributes, setAttr, setProps, blockId } = block

	const {
		align,
		outerLayout = {},
		width = {},
	} = attributes

	const prevAlign = useRef( align )

	useEffect( () => {
		// ~ Flex: alignment not allowed
		// #todo: Check if layout is used on this block
		if ( outerLayout.type ) { // outerLayout.type && 0 ) {
			// if ( this.state.settingAlignment === undefined ) {
			if ( align ) {
				// _yellow( 'settingAlignment' )
				// this.setState( { settingAlignment: '' } )
				setAttr( { align: '' } )

				notice( 'warning', `This block's alignment is controlled by its parent, it cannot be changed here [${ blockId.current }].` )
			}
		}
		// ~ Full or wide alignment
		// width wide and full requires special treatment. Actually determined by align.
		else if ( align !== prevAlign.current ) {
			_L4( 'Alignment change detected.', { align, outerLayout: outerLayout.type } )

			const widthAlignments = [ 'wide', 'full' ]

			// To wide/full
			if ( widthAlignments.includes( align ) && ! widthAlignments.includes( width.preset ) ) {
				_red( `Alignment has changed to wide or full, set width to match alignment: ${ align }` )
				setProps( 'width', { type: align } )
			}
			else if ( ! widthAlignments.includes( align ) && widthAlignments.includes( width.preset ) ) {
				_red( 'Alignment is no longer set to wide of full. Reset set width to small.' )
				setProps( 'width', { type: 'small' } )
			}
		}
	}, [ align, outerLayout.type ] )

	return { setAlign: SetAlign( block ) }
}

/**
 * Set block alignment function factory.
 *
 * @param {ComposeBlockFramework<'align'>} block
 */
function SetAlign( block ) {
	const { attributes, setAttr } = block

	/**
	 * Set block alignment.
	 *
	 * @type {GetTypeProp<BlockExtensions.align, 'setAlign'>}
	 */
	const setAlign = ( newAlignment ) => {
		if ( newAlignment && ! attributes.align ) {
			notice( 'info', 'Alignment enabled - block was required to reload.' )
		}
		else if ( ! newAlignment && attributes.align ) {
			notice( 'info', 'Alignment disabled - block was required to reload.' )
		}

		setAttr( { align: newAlignment } )
	}

	return setAlign
}
