import { useEffect, useRef } from '@wordpress/element'
import { select } from '@wordpress/data'

/**
 * Enable blockId for block.
 *
 * @param {BlockProps} props
 * @param {string} fullBlockName
 * @param {boolean} isMounting
 */
export default function useBlockId( props, fullBlockName, isMounting ) {
	const { attributes, clientId, setAttributes } = props
	const blockId = useRef( attributes.blockId ?? '' )

	let getNewId = ! blockId.current

	if ( ! getNewId && isMounting && isBlockCloned( blockId.current, clientId, fullBlockName ) ) {
		getNewId = true
	}

	if ( getNewId ) {
		blockId.current = generateUID()
		_L3( 'Setting new ID: ', blockId.current )
	}

	/**
	 * Change block ID.
	 *
	 * @param {string} newBlockId New block ID.
	 */
	const setBlockId = ( newBlockId ) => {
		setAttributes( { blockId: newBlockId } )
	}

	// Save block ID on initialization
	useEffect( () => {
		if ( getNewId ) {
			setAttributes( { blockId: blockId.current } ) // note different sp.
		}
	}, [] )

	return { blockId, setBlockId }
}

/**
 * Compare current block with all existing blocks in the post. Signal if the block needs a new ID.
 *
 * @param {string} blockId
 * @param {string} clientId
 * @param {string} fullBlockName
 */
function isBlockCloned( blockId, clientId, fullBlockName ) {
	if ( ! blockId ) {
		_yellow( 'Block has no ID.' )
		return false
	}

	// Walk through all existing post blocks (not just top-level)
	// Compare block IDs and ClientIDs
	// Don't include current block in the list
	let blockClientIds = select( 'core/block-editor' ).getClientIdsWithDescendants()
	blockClientIds = blockClientIds.filter( ( x ) => x !== clientId )

	for ( const currentClientId of blockClientIds ) {
		const block = select( 'core/block-editor' ).getBlock( currentClientId )

		if ( ! block || block.name !== fullBlockName ) {
			continue
		}

		const currentBlockId = block.attributes.blockId

		// _log( '******************' )
		// _log( 'block <==> this' )
		// _log( currentBlockId, ' <==> ', clientId )
		// _log( currentBlockId, ' <==> ', blockId )

		// Check if the block ID is matching
		if ( currentBlockId === blockId ) {
			// _red("######################################################################################")

			_L2( `Found existing block with the same block ID: ${ currentBlockId }` )
			_info( 'This block is probably cloned or copied -- a new ID will be generated.' )

			return true
		}
	}
}

/**
 * Generate random alpha numeric ID.
 *
 * @param {Object} props
 * @param {number}[props.length=6]
 * @param {boolean}[props.beginWithLetter=true]
 */
function generateUID( { length = 6, beginWithLetter = true } = {} ) {
	// Multiply by 36^12
	const multiplier = 131621703842267140
	const rand = ( Math.random() + 1 ) * multiplier

	let first = ''

	if ( beginWithLetter ) {
		first = Math.round( ( Math.random() * 26 ) + 10 ).toString( 26 )
	}

	const uid = first + rand.toString( 36 )// use first 36 characters
	return uid.substring( 0, length )
}
