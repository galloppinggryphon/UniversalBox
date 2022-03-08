import { pluginConfig } from '~/plugin-config'

import {
	generateBlockStyles,
	generateCss,
} from '@framework/style-generator'

import {
	useEffect,
	useState,
} from '@wordpress/element'

/**
 *
 * @param {Object} props
 * @param {PlainObj} props.attributes
 * @param {BlockData<string[]>} props.classNames
 * @param {GetTypeProp<BlockFramework, 'blockId'>} props.blockId
 * @param {string} props.clientId
 * @param {React.MutableRefObject<number>} props.attributeChangeSignal
 */
export function useBlockCss( { attributes, classNames, blockId, clientId, attributeChangeSignal } ) {
	const [ blockCss, setBlockCss ] = useState( /** @type {BlockData} */ ( {} ) )

	useEffect( () => {
		const css = generateEditorCss( attributes, classNames, clientId )

		if ( css !== blockCss ) {
			// _L4( `[${ blockId.current }] CSS has changed` )

			setBlockCss( css )
			injectStylesheet( css, blockId.current, pluginConfig.stylesheetIdPrefix )

			_log( 'Editor CSS:\n', css )
		}
	}, [ attributeChangeSignal.current ] )

	return blockCss
}

/**
 * Generate block CSS for the editor.
 *
 * @param {PlainObj} attributes
 * @param {BlockData<string[]>} classNames
 * @param {string} clientId Block ID in the editor
 * return {BlockData} Inner and outer CSS
 */
export function generateEditorCss( attributes, classNames, clientId ) {
	const outerSelector = `#block-${ clientId }` // `.wp-block[data-block="${ clientId }"]`
	const styles = generateBlockStyles( attributes )

	return getBlockCss( styles, outerSelector, classNames.inner )
}

/**
 * Generate block CSS for the front-end. No side effects.
 *
 * @param {string} blockId
 * @param {PlainObj} attributes
 * @param {BlockData<string[]>} classNames
 * @return {BlockData} Inner and outer CSS
 */
export function generateFrontendCss( blockId, attributes, classNames ) {
	// _L3( 'generateFrontendCss', ref )
	const outerSelector = `.${ pluginConfig.prefix }-block-${ blockId }`
	const styles = generateBlockStyles( attributes )
	return getBlockCss( styles, outerSelector, classNames.inner )
}

/**
 * Generate and return block CSS.
 *
 * @param {PlainObj} styles
 * @param {string} outerSelector
 * @param {string[]} innerClassNames
 * @return {BlockData}
 */
function getBlockCss( styles, outerSelector, innerClassNames ) {
	const innerSelector = innerClassNames.map( ( x ) => `.${ x }` )

	const cssSelectors = {
		outer: outerSelector,
		inner: generateCssPaths( [ outerSelector ], innerSelector, '>', ', ', '.' ),
	}

	return generateCss( styles, cssSelectors )
}

/**
 * Inject stylesheet into document head.
 *
 * @param {BlockData} css
 * @param {string} blockId
 * @param {string} stylesheetIdPrefix
 */
function injectStylesheet( css, blockId, stylesheetIdPrefix ) {
	const stylesheetID = `${ stylesheetIdPrefix }${ blockId }`

	let stylesheet = document.getElementById( stylesheetID )
	if ( ! stylesheet ) {
		stylesheet = document.createElement( 'style' )
		stylesheet.id = stylesheetID
		document.getElementsByTagName( 'head' )[ 0 ].appendChild( stylesheet )
	}
	stylesheet.innerHTML = css.outer + css.inner
}

/**
 * Create CSS path for inner block.
 *
 * Generate all combinations of two string arrays.
 *
 * @param {string[]} group1
 * @param {string[]} group2
 * @param {string} conjunctive
 * @param {string} groupSeparator
 * @param {string} prefix
 */
function generateCssPaths( group1, group2, conjunctive = '', groupSeparator = '', prefix = '' ) {
	prefix = ''
	const prefixTest = /^[.#:[]/

	return group1.map( ( g1 ) => {
		const g1Prefix = prefixTest.test( g1 ) ? '' : prefix
		return group2.map( ( g2 ) => {
			const g2Prefix = prefixTest.test( g2 ) ? '' : prefix
			return `${ g1Prefix }${ g1 } ${ conjunctive } ${ g2Prefix }${ g2 }`
		} ).join( groupSeparator )
	} ).join( groupSeparator )
}
