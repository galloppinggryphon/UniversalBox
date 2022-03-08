/**
 * ### External dependencies ###
 */
import classnames from 'classnames'
import _ from 'lodash'

/**
 * ### Internal dependencies ###
 */

import {
	isEmptyObj,
	isObject,
	objectFilterEmpty,
	objectReduce,
	objectReplaceValues,
} from '@framework/utils'

import {
	blockHasBackground,
	loadBlockConfig,
	getThemeSettings,
} from '@framework/plugin-utils'

import useBlockId from '@framework/block-id'
import useAttributeChangeObserver from '@framework/attribute-change'
import useRelatedBlocks from '@framework/related-blocks'
import useBlockClasses from '@framework/block-classes'

import {
	generateFrontendCss,
	useBlockCss,
} from '@framework/block-css'

/**
 * ### Wordpress dependencies ###
 */
import {
	useEffect,
	useState,
} from '@wordpress/element'

// import { getSettings } from '@wordpress/block-editor'
// import { getSettings } from '@wordpress/block-editor/build/store/selectors'

/* eslint-disable import/named */
/**
 * Hooks that provide markup for the block component.
 *
 * ! type definition not updated to 7.0 yet
 * #todo: remose ts-ignore when definition is updated
 */
import {
	/**
	 * Block wrapper element. Provides all the necessary props like the class name.
	 *
	 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
	 */
	// @ts-ignore
	useBlockProps,

	/**
	 * Used to replace <Innerblocks/>.
	 */
	// @ts-ignore
	useInnerBlocksProps,
} from '@wordpress/block-editor'
/* eslint-enable import/named */

/**
 * Hook to setup block settings and provide a control surface that can be passed around to other functions and components.
 *
 * @template {DecoratorConstructor[]} Decorators
 * @param {BlockProps} props
 * @param {BlockConfig} blockConfig
 * @param {Decorators} [decorators] Decorator functions to extend block
 * @return {BlockFramework & BlockExtender<Decorators>} BlockFramework: Data object and control surface
 */
export default function useBlockFramework( props, blockConfig, decorators = undefined ) {
	const { attributes, setAttributes } = props
	const { clientId } = props
	const settings = loadBlockConfig( blockConfig )

	// _log( 'Blocky Blocks settings', settings.classNames )

	// _L2( `Initiating BlockFramework (${ blockConfig.blockName }/${ props.attributes.blockId })` )

	const attributeChangeSignal = useAttributeChangeObserver( attributes )
	const [ isMounting, setIsMounting ] = useState( true )
	const { blockId, setBlockId } = useBlockId( props, settings.fullBlockName, isMounting )
	const [ hasBackground, setHasBackground ] = useState( () => blockHasBackground( props.attributes ) )
	const blockClasses = useBlockClasses( attributes, settings.classNames, settings.customClassNames, isMounting, attributeChangeSignal )
	const blockCss = useBlockCss( { attributes, classNames: blockClasses, blockId, clientId, attributeChangeSignal } )
	const relatedBlocks = useRelatedBlocks( clientId )

	/**
	 * ~ Block properties ~
	 *
	 * @type {BlockFramework}}
	 */
	const block = {
		attributes: props.attributes,
		props, // { clientId: props.clientId, isSelected: props.isSelected },
		settings: loadBlockConfig( settings ),

		attributeChangeSignal() {
			return attributeChangeSignal.current
		},

		// === Attribute getters ===

		get attributeChangeSignalX() {
			return attributeChangeSignal.current
		},

		get blockId() {
			return blockId
		},

		get isMounting() {
			return isMounting
		},
		get hasBackground() {
			return !! hasBackground.any
		},
		get css() {
			return blockCss
		},

		get classNames() {
			return blockClasses
		},

		generateFrontendCss() {
			const css = generateFrontendCss( blockId.current, block.attributes, block.classNames )

			return css
		},

		// === Related blocks
		get related() {
			return {
				parent: relatedBlocks.parent,
				selectParent() {
					relatedBlocks.selectParent()
				},
			}
		},

		// === Context ===
		// parentId = useContext( `${ namespace }/BlockID` )

		// === Attribute dispatchers ===
		setBlockId,

		setAttr( newAttributes = undefined ) {
			_L2( `[${ blockId.current }] setAttr()` )
			_log( { newAttributes } )

			// ~ Undefined values are deleted
			// Undefined must temporarily be converted to null
			// to survive object merge
			if ( newAttributes ) {
				newAttributes = objectReplaceValues( newAttributes, ( x ) => x === undefined, null )
			}

			if ( ! newAttributes || isEmptyObj( newAttributes ) ) {
				_info( 'No changes detected.' )
				return
			}

			_info( `Updating attributes: ${ Object.keys( newAttributes ) }` )

			// setAttributes cannot do nested/deep update, so we must overwrite entire top-level attributes
			const oldAttributes = _.cloneDeep( _.pick( attributes, Object.keys( newAttributes ) ) )
			newAttributes = _.merge( oldAttributes, newAttributes )

			_log( 'merge -->', newAttributes )

			// ~ Mark null and empty objects for deletion
			// setAttributes() deletes attributes set to undefined
			newAttributes = objectReduce( newAttributes, { filterUndefined: false }, ( value ) => {
				_log( 'value', value )
				if ( isObject( value ) ) {
					value = objectFilterEmpty( value, { allEmpty: true } )
				}
				return isEmptyObj( value ) ? undefined : value
			} )

			_red( `[${ blockId.current }] Writing attributes to block.` )
			_log( newAttributes )

			setAttributes( newAttributes )
		},

		setProps( attrName, newProps, screen = undefined, { overwrite = true, removeEmpty = true } = {} ) {
			_L2( `[${ blockId.current }] setProps(attribute: ${ attrName })` )
			_info( 'New props:', newProps )

			// Check if primitive
			if ( ! isObject( newProps ) ) {
				block.setAttr( { [ attrName ]: newProps } )
				return
			}

			if ( Array.isArray( newProps ) ) {
				console.error( 'Error: arrays not currently supported, aborting update.' )
				console.trace()
				return
			}

			// ~ Prepare new attribute object to write
			// Merge new props with existing
			// setAttributes cannot do deep merge, must overwrite entire top-level attributes
			const attributeProps = screen ? { responsiveProps: { [ screen ]: _.cloneDeep( newProps ) } } : newProps
			let attribute = { [ attrName ]: attributeProps }

			// ~ Merge and overwrite existing props
			// Undefined values should be deleted, but are ignored by merge,
			// Recursively replace undefined with null
			if ( removeEmpty ) {
				attribute = objectReplaceValues( attribute, ( x ) => {
					return x === '' || isEmptyObj( x )
				}, null )
			}

			// Retrieve old attribute and overwrite values with new
			if ( attrName in block.attributes ) {
				const oldAttribute = _.pick( _.cloneDeep( block.attributes ), Object.keys( attribute ) )

				// Merge new attributes over existing attributes?
				attribute = overwrite
					? _.merge( oldAttribute, attribute )
					: _.merge( attribute, oldAttribute )
			}

			// ~ Remove empty props from final attribute object
			const finalAttribute = objectReduce( attribute, { filterUndefined: false }, ( value ) => {
				if ( isObject( value ) ) {
					value = objectFilterEmpty( value, { allEmpty: true } )
				}
				return isEmptyObj( value ) ? undefined : value
			} )

			_red( `[${ blockId.current }] Writing attributes to block.`, finalAttribute )

			setAttributes( finalAttribute )
		},

		// === Block props for render() ===
		useBlockProps() {
			return useBlockProps( {
				className: classnames( settings.classNames.outer, block.classNames.outer ),
			} )
		},

		useInnerBlockProps() {
			return useInnerBlocksProps( {
				className: classnames( settings.classNames.inner, block.classNames.inner ),
			} )
		},

		// === Extend block framework ===
		extend( ...decorator ) {
			// Add decorators to block object
			decorator.forEach( ( decoratorFn ) => {
				Object.assign( block, decoratorFn( block ) )
			} )
			// Add custom block attribute updaters
		},

	}

	// ~ Run after first render only ~
	useEffect( () => {
		_red( `[${ blockId.current }] Block is mounted` )

		// Check and update block version
		const { blockVersion } = block.attributes
		if ( ! blockVersion || blockVersion < settings.blockVersion ) {
			_info( `[${ blockId.current }] Block version has been set.` )
			block.setAttr( { blockVersion: settings.blockVersion } )
		}

		setIsMounting( false )
	}, [] )

	// ~ Run on render if attributeChangeSignal has changed ~
	// Execute side-effects that affect the DOM, e.g. update CSS
	// useLayoutEffect ensures DOM is updated before render output is painted
	// ! @todo: Does not run when block is remounted by WP
	useEffect( () => {
		setHasBackground( blockHasBackground( attributes ) )
	}, [ block.attributeChangeSignal() ] )

	// ~ Extend block framework ~
	if ( decorators?.length ) {
		block.extend( ...decorators )
	}

	// Assert the return type (since extend() can't mutate type)
	return /** @type {BlockFramework & BlockExtender<Decorators>} */ ( block )
}
