import {
	useSelect,
	useDispatch,
} from '@wordpress/data'

/**
 * Get related blocks (parent, child, siblings, etc.)
 *
 * @param {string} clientId
 */
export default function useRelatedBlocks( clientId ) {
	const selectors = useSelect( ( select ) => {
		const {
			getBlock,
			getBlockRootClientId,
		} = select( 'core/block-editor' )

		const currentBlock = getBlock( clientId )
		const parentClientId = getBlockRootClientId( clientId )
		const parentBlock = getBlock( parentClientId )

		return {
			parent: parentBlock,
			parentAttributes: parentBlock ? parentBlock.attributes : {},
			children: currentBlock.innerBlocks,
			// siblings: parentBlock.innerBlocks,
			// isLastChild: parentBlock ? clientId === parentBlock.innerBlocks[ parentBlock.innerBlocks.length - 1 ].clientId : true,
		}
	}, [] )

	const {
		selectBlock,
	} = useDispatch( 'core/block-editor' )

	const dispatchers = {
		selectParent() {
			selectBlock( selectors.parent.clientId )
		},
	}

	return {
		...selectors,
		...dispatchers,
	}
}

// export function useContextValue( key ) {
// 	const { context } = this.props
// 	const contextId = `${ namespace }/${ key }`
// 	const value = useContext( contextId )
// 	return value
// }
