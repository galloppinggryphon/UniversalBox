import _ from 'lodash'

import {
	useRef,
} from '@wordpress/element'

/**
 * Rough check to compare prev props and current props.
 *
 * Increments a signal when attributes have changed.
 *
 * Usage:
 * Use with useEffect() to detect signal change.
 * E.g. useEffect( () => {}, [ attributeChangeSignal() ] )
 *
 * @param {PlainObj} attributes
 * return {number} Function that compares attribute status and returns signal.
 */
export default function useAttributeChangeObserver( attributes ) {
	const prevAttributes = useRef( [] )
	const attributeChangeSignal = useRef( 0 )

	const attrValues = serializeObject( attributes )

	// First run
	if ( ! attributeChangeSignal.current ) {
		prevAttributes.current = attrValues
		attributeChangeSignal.current++
		return attributeChangeSignal
	}

	// Attributes have changed
	if ( attrValues.toString() !== prevAttributes.current.toString() ) {
		_L3( `[${ attributes.blockId }] Attributes change detetected.` )

		const diff = _.difference( attrValues, prevAttributes.current ) // objDifference( attrValues, prevAttributes.current )
		// _log( { attrValues, prevAttributes: prevAttributes.current } )
		_log( 'Attribute diff:\n', diff )

		prevAttributes.current = attrValues
		attributeChangeSignal.current++
	}

	return attributeChangeSignal
}

// function arrayDiff()

/**
 * Flatten object.
 *
 * @param {PlainObj} source
 * @param {string} [prefix]
 * @param {PlainObj} [results] Internal variable
 */
function flattenObject( source, prefix = '', results = undefined ) {
	// Empty objects/arrays
	if ( Object( source ) !== source || ( Object( source ) === source && ! Object.keys( source ).length ) ) {
		return results
	}

	prefix = prefix ? `${ prefix }.` : ''

	if ( ! results ) {
		results = {}
	}

	Object.entries( source ).forEach( ( [ key, value ] ) => {
		if ( Object( value ) === value ) {
			flattenObject( value, prefix + key, results )
		}
		else {
			results[ prefix + key ] = value
		}
	} )

	return results
}

/**
 * Serialize object as array.
 *
 * @param {PlainObj} obj
 * @return {string[]}
 */
function serializeObject( obj ) {
	if ( ! obj || ! Object.keys( obj ).length ) {
		return []
	}

	const flat = flattenObject( obj )
	const arr = Object.entries( flat ).map( ( [ key, value ] ) => {
		return `${ key }=${ value }`
	} )

	return arr.sort()
}

/**
 * Get differences between to object literals.
 *
 * @param {PlainObj} obj
 * @param {PlainObj} base
 * @return {PlainObj}
 */
function objDifference( obj, base ) {
	function processDiff( _obj, _base ) {
		return _.transform( _obj, ( result, value, key ) => {
			if ( ! _.isEqual( value, _base[ key ] ) ) {
				if ( _.isObject( value ) && _.isObject( _base[ key ] ) ) {
					result[ key ] = processDiff( value, _base[ key ] )
				}
				else {
					result[ key ] = value
				}
			}
		} )
	}
	return processDiff( obj, base )
}
