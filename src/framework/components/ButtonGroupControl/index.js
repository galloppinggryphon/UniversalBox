/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### External dependencies ###
 */
import classnames from 'classnames'

/**
 * ### Internal dependencies ###
 */
import { Info, BbIcon } from '@components'

/**
 * ### Wordpress dependencies ###
 */
import { useInstanceId } from '@wordpress/compose'

import {
	Button,
	ButtonGroup,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 *
 * Group of connected buttons.
 *
 * @param {Object} props
 * @param {ButtonGroupButtonConfig[]} props.buttons
 * @param {'bb' | 'wp' | 'alt' | 'clear' | 'large' | 'default'} [props.buttonStyle] BB or WP style
 * @param {string|number} [props.iconSize] Pixel size or CSS string
 * @param {string} props.label Required. Accessible help text (ARIA)
 * @param {(selected: string, event: Event) => void} props.onClick
 * @param {number} [props.perRow] Leave undefined to disable per-row limit
 * @param {string} [props.selected] Currently selected button by value
 * @param {boolean} [props.showButtonLabels=true] Use in combination with icon. Cannot be disabled without icons.
 * @param {boolean} [props.showIcons=true] = true Show icons or not (must have 'icon' key in buttons array)
 * @param {boolean} [props.showInfo=true] Show/hide help text about selected item
 */
export default function ButtonGroupControl( { buttons, buttonStyle = 'wp', iconSize = 24, label, onClick, perRow, showButtonLabels = true, showIcons = true, showInfo = true, selected } ) {
	const instanceId = useInstanceId( ButtonGroupControl, 'ButtonGroupControl' )

	// ### BUTTON STYLES ###
	/** @type {Partial<Record<buttonStyle, string>>} */
	const buttonStyleClasses = {
		clear: 'bb-button-clear',
		alt: 'bb-button-alt',
		default: 'bb-button-alt',
		large: 'bb-button-clear',
	}

	const selectedButton = buttons.find( ( x ) => selected === x.value )
	const mustShowButtonLabels = ! showIcons || showButtonLabels
	const buttonClass = buttonStyleClasses?.[ buttonStyle ]

	const setSelected = ( button, value, event ) => {
		onClick( value, event )
		return button
	}

	let itemStyle, iconSizeFinal

	if ( showIcons ) {
		if ( perRow ) {
			const n = ( 100 / perRow )
			const width = `calc( ${ n }% - 3px )`

			itemStyle = {
				flex: `1 0 ${ width }`, // ${ width }
				maxWidth: `${ width }`,
			}

			iconSizeFinal = '50%'
		}
		else {
			iconSizeFinal = iconSize
		}
	}

	const hasIconsClass = buttons[ 0 ] && buttons[ 0 ].icon ? 'has-icons' : false

	return (
		<div id={ `${ instanceId }` } key={ instanceId }>
			{ showInfo && selected !== undefined && selectedButton?.description &&
			<Fragment>
				<Info>
					{ `${ selectedButton.title }: ${ selectedButton.description }` }
				</Info>
			</Fragment>
			}

			<ButtonGroup
				aria-label={ label }
				className={ classnames( hasIconsClass ) }
			>
				{
					buttons.map( ( button, i ) => {
						const { label: btnLabel, title: btnTitle, value, icon, disabled } = button

						return (
							<Button
								key={ `${ btnLabel || btnTitle || i }${ value }` }
								title={ btnTitle }
								aria-label={ btnTitle }
								value={ value }
								className={ classnames( buttonClass ) }
								isPressed={ value === selected }
								disabled={ disabled }
								onClick={ ( event ) => setSelected( button, value, event ) }
								style={ itemStyle }
							>
								{ showIcons && icon &&
									<BbIcon icon={ icon } size={ iconSizeFinal } />
								}

								{ mustShowButtonLabels &&
									<span className="components-button-label">
										{ btnLabel }
									</span>
								}
							</Button>
						)
					} )
				}
			</ButtonGroup>
		</div>
	)
}
