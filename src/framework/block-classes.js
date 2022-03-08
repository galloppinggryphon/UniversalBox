import _ from 'lodash'
import classnames from 'classnames'

import { classNameGenerator } from '@framework/class-generator'

import {
	useEffect,
	useState,
} from '@wordpress/element'

/**
 * Auto calculate all block classes, both inner and outer. Runs when attributes are changed.
 *
 * @param {PlainObj} attributes
 * @param {BlockData<string[]>} classNames
 * @param {BlockData<string[]>} customClassNames
 * @param {boolean} isMounting
 * @param {React.MutableRefObject<number>} attributeChangeSignal
 */
export default function useBlockClasses( attributes, classNames, customClassNames, isMounting, attributeChangeSignal ) {
	const [ blockClasses, setBlockClasses ] = useState( () => getBlockClassList( attributes, classNames, customClassNames ) )

	useEffect( () => {
		if ( isMounting ) {
			return
		}

		setBlockClasses( getBlockClassList( attributes, classNames, customClassNames ) )
	}, [ attributeChangeSignal.current ] )

	return blockClasses
}

/**
 * Generate block class names from attributes on demand. Use this outside `edit` context.
 *
 * Returns strings.
 *
 * @param {BlockAttributes.attributes} attributes
 * @param {BlockData<string[]>} classNames
 * @return {BlockData} Inner and outer classes as merged string lists.
 */
export function getBlockClasses( attributes, classNames ) {
	const blockClasses = classNameGenerator( attributes, classNames )

	return {
		outer: classnames( blockClasses.outer ),
		inner: classnames( blockClasses.inner ),
	}
}

/**
 * Generate block class names from attributes on demand. Use this outside `edit` context.
 *
 * Returns arrays.
 *
 * @param {BlockAttributes.attributes} attributes
 * @param {BlockData<string[]>} classNames
 * @param {BlockData<string[]>} [customClassNames]
 * @return {BlockData<string[]>} Inner and outer classes as merged string lists.
 */
export function getBlockClassList( attributes, classNames, customClassNames = undefined ) {
	const blockClasses = customClassNames
		? _.merge( classNames, customClassNames )
		: classNames

	return classNameGenerator( attributes, blockClasses )
}
