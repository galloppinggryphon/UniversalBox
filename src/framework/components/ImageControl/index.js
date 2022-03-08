/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### Wordpress dependencies ###
 */

import {
	Button,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'

import {
	MediaUploadCheck,
	MediaPlaceholder,
} from '@wordpress/block-editor'

import { useInstanceId } from '@wordpress/compose'

/**
 *
 * @param {Object} props
 * @param {Partial<BlockAttributes.ImageProps>} props.image
 * @param {(image: Partial<BlockAttributes.ImageProps>) => void} props.setImage
 */
export default function ImageControl( { image = {}, setImage } ) {
	const instanceId = useInstanceId( ImageControl, 'image-control' )

	const onSelect = ( img ) => {
		_yellow( 'ImageControl', img )
		setImage( { source: img } )
	}

	return (
		<div id={ `${ instanceId }` } key={ instanceId }>

			<MediaUploadCheck>
				<MediaPlaceholder
					onSelect={ onSelect }
					accept="image/jpg, image/jpeg, image.gif, image/png, image/svg+xml"
					allowedTypes={ [ 'image/jpeg', 'image/gif', 'image/png', 'image/svg+xml' ] }
					multiple={ false }
					labels={ { title: image?.source?.url ? 'Selected image' : 'Upload a new image or select one from the media library' } }
					value={ image?.source?.id }
					className="image-control"
					mediaPreview={
						image?.source?.url
							? <Fragment>
								<img alt="Preview" src={ image?.source?.url } width="150" />
							</Fragment>
							: <div>No image selected</div>
					}

				/>

				{ image?.source?.url &&
				<Button

					isDestructive
					onClick={ () => setImage( { source: null } ) }
					style={ { marginTop: '10px', marginLeft: 0 } }
				>Remove image</Button>
				}

			</MediaUploadCheck>
		</div>
	)
}

// function BackgroundPosition() {
// 	return <Fragment>
// 		<h4>Background position</h4>
// 		<ToggleControl
// 			label={ 'Fixed background position' }
// 			checked={ imageAttachmentFixed ?? false }
// 			onChange={ ( value ) => {
// 				setAttributeProps( 'background', { imageAttachmentFixed: value } )
// 			} }
// 		/>
// 		<ToggleControl
// 			label={ 'Top' }
// 			checked={ ( imagePosition && imagePosition.includes( 'top' ) ) ?? false }
// 			onChange={ ( value ) => {
// 				if ( value ) {
// 					setAttributeProps( 'background', { imagePosition: [ 'top' ] } )
// 				}
// 				else {
// 					setAttributeProps( 'background', { imagePosition: [] } )
// 				}
// 			} }
// 		/>
// 	</Fragment>
// }
