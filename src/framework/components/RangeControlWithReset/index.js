/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### Wordpress dependencies ###
 */
import {
	Button,
	Icon,
} from '@wordpress/components'

import { useRef } from '@wordpress/element'

/**
 * Range control with icon reset button.
 *
 * @param {Object} props
 * @param {string} [props.help] Aria help text and button title
 * @param {fnVoid} props.onReset Function to call to perform reset.
 * @param {React.ReactNode} props.children
 */
export default function RangeControlWithReset( { help = 'Reset range control', onReset, children } ) {
	const resetButtonMoved = useRef( false )
	const container = <div
		className="components-range-reset-control"
	>
		{ children }
		<div
			className="range-control-reset"
			ref={ ( element ) =>{
				if ( ! element || resetButtonMoved.current ) {
					return
				}
				resetButtonMoved.current = true

				const parent = element.parentElement

				// The only way to modify Gutenberg components is through the DOM
				const rangeControlWrapper = parent.querySelector( '.components-range-control__root' )

				// Move the reset button to after the input element
				rangeControlWrapper.append( element )
			} }
		>
			<Button title={ help } aria-label={ help }
				onClick={ onReset }
			>
				<Icon icon="dismiss" />
			</Button>
		</div>
	</div>

	return container
}
