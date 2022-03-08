import Icons from '@assets/icons'

import {
	Icon,
} from '@wordpress/components'

/**
 * Provide dash icon or internal SVG icon.
 *
 * Select icon from list. Internal icons are listed first and are capitalized, dashicons after in small caps.
 *
 * @param {Object} props
 * @param {IconsSets} props.icon
 * @param {number|undefined} [props.size] [24] Size in pixels
 */
export default function BbIcon( { icon, size = 24 } ) {
	if ( icon in Icons ) {
		/** @type {SVGComponent} */
		const Svg = Icons[ icon ]
		return <Svg width={ size } height={ size } />
	}

	return <Icon icon={ /** @type {WP.Dashicon} */( icon ) } size={ size } />
}
