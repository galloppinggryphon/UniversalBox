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
import { getColour } from '@extensions/colour'
import { Notice } from '@components'

/**
 * ### Wordpress dependencies ###
 */
import { useInstanceId } from '@wordpress/compose'
import { ColorPalette } from '@wordpress/block-editor'

import {
	BaseControl,
	ColorIndicator,
	Button,
	PanelRow,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 * Advanced colour palette.
 *
 * @example
 * Colour object: { name: "Black", slug: 'black', color: "#000000" }
 *
 * @param {Object} props
 * @param {'top'|'bottom'|'both'|'none'|''} [props.clearable] Allow clearing colour. Specify position of `clearable` button. Default = top.
 * @param {Required<WP.EditorColour>[]} [props.colours]
 * @param {boolean} [props.disableCustomColours]
 * @param {string} [props.label] Explanatory label
 * @param {boolean} [props.largeSwatches] Use large swatches
 * @param {(hexValue: string) => void} props.onChange
 * @param {number} [props.swatchesPerRow] Number of swatches per row
 * @param {boolean} [props.showIndicator] Show selected colour?
 * @param {boolean} [props.showLabel] Show label?
 * @param {Partial<ColourThemePreset>|WP.EditorColour|string} [props.selected] Initially selected colour by value or colour item
 */
export default function AdvancedColourSelector( {
	clearable = 'top',
	colours,
	disableCustomColours,
	label = undefined,
	largeSwatches = false,
	onChange,
	swatchesPerRow = 4,
	showIndicator = true,
	showLabel = false,
	selected,
} ) {
	const classNames = classnames( 'advanced-colour-selector', {
		'large-palette': largeSwatches,
	} )

	// Extract current colour value
	const colour = getColour( selected, colours )

	/**
	 * @param {string} hexValue
	 */
	const saveColour = ( hexValue = undefined ) => {
		// setcolour( { color: hexValue } )
		onChange( hexValue )
	}

	/**
	 * ! Temporary hack - TS doesn't like custom CSS props.
	 *
	 * @type {any}
	 */
	const componentStyle = {}
	if ( swatchesPerRow ) {
		const n = ( 100 / swatchesPerRow )
		const width = `calc( ${ n }% - 3px )`
		const height = `${ n * 2 }px`

		componentStyle[ '--swatch-width' ] = width
		componentStyle[ '--swatch-height' ] = height
	}

	const instanceId = useInstanceId( AdvancedColourSelector, 'AdvancedColourSelector' )

	return (
		<div
			id={ `${ instanceId }` }
			className={ classNames }
			key={ instanceId }
			style={ componentStyle }
		>
			<Fragment>
				{ showIndicator &&
				<PanelRow>
					<Notice muted={ true } className="colour-indicator-row" layout={ { spaceAfter: 30 } }>
						{ colour.color &&
							<Fragment>
								<div>
									<ColorIndicator colorValue={ colour.color } />
									<div
										className="label"
										aria-label={ 'Selected colour' }
									>
										{ colour.name || colour.color }
									</div>
								</div>
								{ ( clearable === 'top' || clearable === 'both' ) &&
									<Button
										title="Remove colour"
										className="clear-button"
										onClick={ () => saveColour() }
										isSecondary
										isSmall
									>Clear</Button>
								}
							</Fragment>
						}
						{ ! colour.color && 'No colour selected.' }
					</Notice>
				</PanelRow>
				}

				<BaseControl
					id={ `${ instanceId }__advanced-control` }
					label={ label }
					hideLabelFromVision={ ! showLabel }
				>
					<ColorPalette
						value={ colour.color }
						onChange={ saveColour }
						clearable={ clearable === 'bottom' || clearable === 'both' }
						{ ... {
							colors: /** @type {WP.Colour[]} */ ( colours ),
							disableCustomColors: disableCustomColours,
						} }
					/>
				</BaseControl>
			</Fragment>
		</div>
	)
}
