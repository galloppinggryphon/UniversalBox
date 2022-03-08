import classnames from 'classnames'
import { pluginConfig } from '~/plugin-config'
import { blockSetup } from './settings'

import { getBlockClasses } from '@framework/block-classes'
import { generateFrontendCss } from '@framework/block-css'
import { loadBlockConfig } from '@framework/plugin-utils'

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 *
 * ! type definition not updated to 7.0 yet
 * #todo: remove ts-ignore when definition is updated
 */
import {
	InnerBlocks,
	// @ts-ignore
	useBlockProps,
} from '@wordpress/block-editor'

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WP.WPElement} Element to render.
 */
export default function save( props ) {
	const { attributes } = props
	const { blockType, blockId } = attributes
	const blockConfig = loadBlockConfig( blockSetup )

	// _L1( 'SAVE' )
	// _log( { attributes } )

	const css = generateFrontendCss( blockId, props.attributes, blockConfig.classNames )
	const cssString = ( css.outer ?? '' ) + ( css.inner ?? '' )
	const classes = getBlockClasses( props.attributes, blockConfig.classNames )
	const blockProps = useBlockProps.save()

	// @ts-ignore
	blockProps.className = classnames( blockProps.className.split( ' ' ), classes.outer )
	const Block = blockType || 'div'

	// let classes = {}, blockProps = {}, css = {}, cssString = ''

	// _L1( `SAVE [${ blockId }]` )
	// _log( blockProps )
	// _log( classes )

	const scriptContents = JSON.stringify( {
		blockClass: `${ pluginConfig.prefix }${ blockId }`,
		css: cssString,
	} )

	return (
		<Block { ...blockProps }>
			{ !! cssString && <script
				className={ `${ pluginConfig.namespace }-block-config` }
				dangerouslySetInnerHTML={ { __html: scriptContents } }
				type="application/json"
			/> }
			<div className={ classes.inner }>
				<InnerBlocks.Content />
			</div>
		</Block>
	)
}
