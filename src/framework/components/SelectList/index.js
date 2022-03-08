/**
 * ### External dependencies ###
 */
import classnames from 'classnames'

/**
 * ### Internal dependencies ###
 */
import { isObject } from '@framework/utils'

/**
 * ### Wordpress dependencies ###
 */

import {
	BaseControl,
} from '@wordpress/components'

import { useInstanceId } from '@wordpress/compose'

/**
 * Create a multiline select list control with vanilla select element.
 *
 * @param {Object} props
 * @param {string} [props.className] Extra class names
 * @param {string} props.label Label
 * @param {(option: React.SyntheticEvent) => void} [props.onSelect]
 * @param {({value: (string|number|undefined), label: string|number}|string)[]} props.options List of items
 * @param {number} [props.rows] Number of rows
 * @param {string} [props.selected] Selected item
 */
export default function SelectList( { className = undefined, label, onSelect = undefined, options, selected = undefined, rows = 5 } ) {
	const instanceId = useInstanceId( SelectList, 'SelectList' )

	const _className = classnames( 'components-select-control-multiline', className )

	return (
		<BaseControl
			id={ `${ instanceId }` }
			key={ instanceId }
			label={ label }
		>
			<select
				id={ `${ instanceId }-select` }
				name={ `${ instanceId }-select` }
				className={ _className }
				onSelect={ onSelect }
				size={ rows }
				value={ selected }
			>
				{ options.map( ( option, index ) => {
					const opt = isObject( option ) ? option : { label: option, value: undefined }

					// #todo: react says to use defaultValue??
					// const isSelected = opt.value
					// 	? ( selected === opt.value )
					// 	: ( selected === opt.label )

					// remove empty labels that don't have a value
					if ( ! opt.value && ! opt.label ) {
						return null
					}

					return (
						<option
							key={ `blockClasses${ opt.value || index }`
							}
							value={ opt.value }
						// selected={ isSelected }
						>
							{ opt.label }
						</option>
					)
				} ) }
			</select>
		</BaseControl>
	)
}
