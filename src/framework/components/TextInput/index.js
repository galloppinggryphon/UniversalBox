/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### Internal dependencies ###
 */
import { Warning, Error, Info } from '@components'

/**
 * ### External dependencies ###
 */
import classnames from 'classnames'
import { debounce } from 'lodash'

/**
 * ### Wordpress dependencies ###
 */

import {
	BaseControl,
	Button,
	PanelRow,
	TextControl,
	TextareaControl,
} from '@wordpress/components'

import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element'

import { useInstanceId } from '@wordpress/compose'

/**
 * Text input control with save button.
 *
 * @param {Object} props
 * @param {boolean} [props.buttonLabels] Include button labels
 * @param {boolean} [props.cancelButton] Include cancel button
 * @param {boolean} [props.compact] Constrain control to single row or wrap buttons.
 * @param {string} [props.help] Help text (underneath)
 * @param {boolean} [props.hideLabel] Hide label (show only to screen readers)
 * @param {string} props.label Display label (above)
 * @param {(value?: string|null) => void} props.onSave Action on save/cancel. Returns null on cancel.
 * @param {number} [props.rows] Number of textbox rows
 * @param {(value: string) => boolean} [props.validate] Validation function
 * @param {string} props.value Initial value
 */
export default function TextInput( {
	buttonLabels = false,
	cancelButton = false,
	compact = true,
	help = undefined,
	hideLabel = false,
	label,
	onSave,
	rows = 1,
	validate = undefined,
	value,
} ) {
	const instanceId = useInstanceId( TextInput, 'text-input' )

	const [ currentText, setCurrentText ] = useState( value )

	/**
	 * @typedef {'' | 'error' | 'info' | 'warn'} feedbackTypes
	 * @typedef { { msg: string, type: feedbackTypes}} TextInputStatus
	 * @type {TextInputStatus}
	 */
	const defaultFeedback = { msg: undefined, type: undefined }
	const [ feedback, setFeedback ] = useState( defaultFeedback )

	/**
	 * Debounce experiment
	 *
	 * @param {feedbackTypes} type
	 * @param {string} msg
	 */
	const updateStatus = ( type = '', msg = '' ) => {
		setFeedback( { type, msg } )
	}

	// Debounce component update
	const updateStatusHandler = useMemo( () => debounce( updateStatus, 150 ), [ feedback ] )

	/** @param {string} input */
	const updateHandler = ( input ) => {
		setCurrentText( input )
		if ( input ) {
			updateStatusHandler( 'warn', 'There are unsaved changes.' )
		}
		else {
			updateStatusHandler()
		}
	}

	// Unmount cleanup function
	useEffect( () => {
		return () => {
			updateStatusHandler.cancel()
		}
	}, [] )

	let isEdited = false
	if ( currentText !== value ) {
		isEdited = true
	}

	const useRows = rows && rows < 15 ? rows : 15
	const TextBox = rows > 1 ? TextareaControl : TextControl

	const actionButtons = <Fragment>
		<Button
			icon="yes"
			title="Save input"
			isPrimary={ isEdited }
			isSecondary={ ! isEdited }
			onClick={ () => saveInput( currentText ) }
		>{ buttonLabels && 'Save' }</Button>

		{ cancelButton &&
			<Button
				icon="no"
				title="Cancel"
				isDestructive
				onClick={ () => cancelInput() }
			>{ buttonLabels && 'Cancel' }</Button>
		}
	</Fragment>

	const baseClassNames = classnames( 'text-input', { 'with-button-row': ! compact } )

	return (
		<Fragment>
			<BaseControl
				id={ `${ instanceId }` }
				key={ `${ instanceId }` }
				className={ baseClassNames }
				label={ label }
				hideLabelFromVision={ hideLabel }
			>

				<PanelRow>
					<TextBox
						value={ currentText }
						help={ help }
						rows={ useRows }
						onChange={ updateHandler }
					/>
					{ compact && actionButtons }
				</PanelRow>

				{ ! compact &&
					<PanelRow className="button-row">
						{ actionButtons }
					</PanelRow>
				}

				{ feedback?.type === 'error' && <Error>{ feedback.msg }</Error> }
				{ feedback?.type === 'info' && <Info>{ feedback.msg }</Info> }
				{ feedback?.type === 'warn' && <Warning>{ feedback.msg }</Warning> }

			</BaseControl>
		</Fragment>
	)

	function saveInput( input ) {
		_log( input, typeof input )

		if ( typeof validate === 'function' ) {
			if ( ! validate( input ) ) {
				setFeedback( { msg: 'Invalid input.', type: 'error' } )
				return
			}
		}

		onSave( currentText )
		setFeedback( defaultFeedback )
	}

	function cancelInput() {
		updateStatus()
		onSave( null )
	}
}
