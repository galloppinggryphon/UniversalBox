import _ from 'lodash'
import { isEmptyObj } from '@framework/utils'

/**
 * Background colour decorator. Return props/methods to add to `block`.
 *
 * @param {ComposeBlockFramework<'backgroundImage'>} block
 * @return {GetBlockExtensions<'backgroundImage'>}
 */
export default function withBackgroundImage( block ) {
	const { blockId, setProps } = block

	/**
	 * Set background image
	 *
	 * @type {GetTypeProp<GetBlockExtensions<'backgroundImage'>,'setBackgroundImage'>}
	 * @param {BlockAttributes.ImageProps} image object created by image control
	 */
	const setBackgroundImage = ( image = undefined ) => {
		_L3( `[${ blockId.current }] Set background image` )
		_log( 'Image:', image ?? 'n/a' )

		const source = image?.source && _.pick( image.source, [ 'id', 'url' ] )
		if ( ! isEmptyObj( source ) ) {
			setProps( 'background', {
				image: { source },
			} )
		}
		else {
			// also remove overlay colour
			setProps( 'background', {
				image: undefined,
				overlay: undefined,
			} )
		}
	}

	return {
		setBackgroundImage,
	}
}
