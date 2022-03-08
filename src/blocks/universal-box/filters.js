import SimpleStore from '@lib/simple-store-2'

import { getBlockClasses } from '@framework/block-classes'

import { blockSetup } from './settings'
import { pluginConfig } from '~/plugin-config'

// ### WORDPRESS DEPENDENCIES ###

// to update block root classes
import { createHigherOrderComponent } from '@wordpress/compose'
import { addFilter } from '@wordpress/hooks'

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ### ADD FILTERS ###
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// === Remove default class name ===
function setBlockCustomClassName( className, blockName ) {
	return blockName === blockSetup.fullBlockName ? '' : className
}

addFilter(
	'blocks.getBlockDefaultClassName',
	`${ pluginConfig.namespace }/set-block-custom-class-name`,
	setBlockCustomClassName
)

// === Update block root classes ===
/**
 * Modify the classes of the root block in the editor by modifying the BlockListBlock component.
 */
// @deprecated - No longer in use
const bbModifyClassname = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( props.name === blockSetup.fullBlockName ) {
			const classes = getBlockClasses( props.attributes, blockSetup.classNames )
			return <BlockListBlock { ...props } className={ classes.outer } />
		}

		return <BlockListBlock { ...props } />
	}
}, 'withCustomClassName' )

// addFilter(
// 	'editor.BlockListBlock',
// 	`${ namespace }/bbModifyClassname`,
// 	bbModifyClassname
// )

// === Old block HTML ===
/**
 * Retrieve saved HTML from the block before deprecation comparison.
 *
 * @param attributes
 * @param block
 * @param innerHTML
 */
function getOldBlockHtml( attributes, block, innerHTML ) {
	if ( block.name !== blockSetup.fullBlockName || ! attributes.blockId ) {
		return attributes
	}

	const { blockId } = attributes
	SimpleStore( blockId ).set( 'oldHtml', innerHTML )
	return attributes
}
addFilter( 'blocks.getBlockAttributes', `${ pluginConfig.namespace }/bbGetOldBlockHtml`, getOldBlockHtml )
