import _ from 'lodash'

/**
 * Evaluates if object is empty: undefined, null, [], {}, function(){}
 *
 * @param {any} value Any variable to check
 */
export function isEmptyObj( value ) {
	return value === undefined || value === null || ( _.isObject( value ) && _.isEmpty( value ) )
}

/**
 * Check if something is an object literal.
 *
 * @type {IsObject}
 * @return True or false
 */
export function isObject( value ) {
	return Object( value ) === value && ! Array.isArray( value )
}

/**
 * Conditionally and recursively replace values, based on test
 *
 * @example Example test pattern:
 * (x) => x === undefined
 *
 * @param {Object<string, any>} obj
 * @param {(value: any) => boolean} test Replace values where test() returns true.
 * @param {any} value
 * @param {boolean} [clone] Clone or mutate object?
 */
export function objectReplaceValues( obj, test, value, clone = true ) {
	obj = clone ? _.cloneDeep( obj ) : obj
	Object.keys( obj ).forEach( ( key ) => {
		if ( obj.hasOwnProperty( key ) ) {
			if ( test( obj[ key ] ) ) {
				obj[ key ] = value
			}
			else if ( obj[ key ] && Object( obj[ key ] ) === obj[ key ] ) {
				objectReplaceValues( obj[ key ], test, value, false )
			}
		}
	} )
	return obj
}

/**
 * `Array.reduce()` for objects. Filter and apply function to each element of an object.
 *
 * Returned value from `mapFunc` is added to result object
 *
 * Can filter undefined object values
 *
 * Can return array
 *
 * Can mutatate result object
 *
 * Old (deprecated and disused) signature:
 * `{returnAsArray, filterUndefined, cloneResult, mapFunc, filterNull}`
 *
 * @param {Object<string, any>} obj
 * @param {Object} options Options object or null
 * @param {boolean} [options.cloneResult] Return cloned object
 * @param {boolean} [options.filterNull] - Remove null
 * @param {boolean} [options.filterUndefined] - Remove undefined (default true)
 * @param {boolean} [options.returnArray] - Convert object to nested array (drops object keys)
 * @param {(value: any, key: string, newObj: Object<string, any>) => PlainObj |null | undefined | void} func Parameters: value, key, result. Return null or undefined to remove key-value pair from output.
 */
export function objectReduce( obj, options, func ) {
	const { cloneResult, filterNull, filterUndefined = true, returnArray } = options || {}

	const result = Object.entries( obj ).reduce( ( newObj, [ key, value ] ) => {
		const newValue = func ? func( value, key, newObj ) : value

		if ( ( filterUndefined && newValue === undefined ) || ( filterNull && filterUndefined ) ) {
			return newObj
		}

		if ( returnArray ) {
			// @ts-ignore
			return [ ...newObj, newValue ]
		}

		newObj[ key ] = newValue
		return newObj
	}, returnArray ? [] : {} )

	return cloneResult ? _.cloneDeep( result ) : result
}

/**
 * Filters objects for undefined, or all empty values (but not other falsy values)
 *
 * allEmpty: `undefined, null, [], {}, function(){}`
 *
 * Works on nested objects.
 *
 * Note! Can be configured to mutate original object.
 *
 * @param {PlainObj} inputObj Object to filter
 * @param {Object} options
 * @param {boolean} [options.allEmpty] [false] - Check all empty (not falsy) values
 * @param {boolean} [options.clone] [true] - Clone the object to avoid mutating the original
 */
export function objectFilterEmpty( inputObj, { allEmpty = false, clone = true } = {} ) {
	if ( inputObj === undefined ) {
		return
	}

	const obj = clone ? _.cloneDeep( inputObj ) : inputObj

	const objElements = Object.keys( obj )
	const objLength = Array.isArray( obj )
		? obj.length
		: objElements.length

	if ( ! objLength ) {
		return obj
	}

	objElements.forEach( ( key, index ) => {
		if ( Object( obj[ key ] ) === obj[ key ] ) {
			obj[ key ] = objectFilterEmpty( obj[ key ], { allEmpty, clone: false } )
		}

		if ( obj[ key ] === undefined ||
			( allEmpty && isEmptyObj( obj[ key ] ) ) ) {
			if ( Array.isArray( obj ) ) {
				obj.splice( index, 1 )
			}
			else {
				delete obj[ key ]
			}
		}
	} )
	return obj
}

/**
 * Wrapper for func.apply.
 *
 * Used to create more readable IIFE syntax that can return a value to assign to a variable.
 *
 * @example
 * apply((x) => _log('Hello ' + x), 'world')
 *
 * @param {Function} func Function callback
 * @param {*} args Zero or more arguments to pass ot the function
 */
export function apply( func, ...args ) {
	return func.apply( null, args )
}

/**
 * Search for one or more values in an array of objects. Returns first match.
 *
 * @template Haystack
 * @param {Array<Haystack>} haystack Array of objects, e.g. [ { key: key, value: value } ]
 * @param {string|number|boolean|Array<string|number|boolean>} needles Value or values to find
 * @param {string} lookupKey Which property to search for the needles
 */
export function arrayFind( haystack, needles, lookupKey ) {
	if ( ! Array.isArray( haystack ) || ! haystack.length ) {
		return
	}

	if ( needles === undefined || ( Array.isArray( needles ) && ! needles.length ) ) {
		return
	}

	const needlesList = Array.isArray( needles ) ? needles : [ needles ]

	const search = ( item ) => {
		return needlesList.find( ( needle ) => needle === item[ lookupKey ] )
	}

	return haystack.find( search )
}

/**
 * Search for one or more values in an array of objects. Returns all matches.
 *
 * @template Haystack
 * @param {Array<Haystack>} haystack Array of objects, e.g. [ { key: key, value: value } ]
 * @param {string|number|boolean|Array<string|number|boolean>} needles Value or values to find
 * @param {string} lookupKey Which property to search for the needles
 */
export function arrayFindAll( haystack, needles, lookupKey ) {
	if ( ! Array.isArray( haystack ) || ! haystack.length ) {
		return
	}

	if ( needles === undefined || ( Array.isArray( needles ) && ! needles.length ) ) {
		return
	}

	const needlesList = Array.isArray( needles ) ? needles : [ needles ]

	const search = ( item ) => {
		return needlesList.find( ( needle ) => needle === item[ lookupKey ] )
	}

	return haystack.filter( search )
}

/**
 * Append string to end of string if not present. Useful for paths.
 *
 * @param {string} str
 * @param {string} suffix
 */
export function stringAppend( str, suffix ) {
	const strPos = suffix.length * -1
	if ( str.slice( strPos ) === suffix ) {
		return str
	}

	return str + suffix
}

/**
 * Prepend string with another string, if not present. Useful for paths.
 *
 * @param {string} str
 * @param {string} prefix
 */
export function stringPrepend( str, prefix ) {
	if ( str.slice( prefix.length ) === prefix ) {
		return str
	}

	return prefix + str
}

/**
 * Augments array object prototype with `pushIf()` method.
 *
 * @template {string|number|boolean|undefined|null} Type
 * @augments {Array<Type>}
 */
export class ExtendedArray extends Array {
	/**
	 * Push value to array if predicate evaluates as true.
	 *
	 * @param {boolean} predicate
	 * @param {Type} value
	 */
	pushIf( predicate, value ) {
		if ( !! predicate ) {
			this.push( value )
		}
		return this
	}
}
