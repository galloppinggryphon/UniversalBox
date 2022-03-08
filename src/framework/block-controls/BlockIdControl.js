import {
	TextInput,
} from '@framework/components'

import {
	StringValidator,
} from '@framework/plugin-utils'

import {
	Button,
	PanelRow,
} from '@wordpress/components'

import {
	Fragment,
	useState,
} from '@wordpress/element'

/**
 * Utility to view and change the block ID.
 *
 * @param {GetTypeProp<BlockFramework, 'blockId'>} blockId Block ID
 * @param {GetTypeProp<BlockFramework, 'setProps'>} setProps Block setAttr function.
 */
export default function BlockIdControlFactory( blockId, setProps ) {
	const [ editMode, setEditMode ] = useState( false )
	const [ currentBlockId, setCurrentBlockId ] = useState( blockId.current )

	const setBlockId = ( value ) => setProps( 'blockId', value )

	/**
	 * @param {Object} props
	 * @param {'row'|'field'|'none'} [props.displayFormat]
	 */
	const BlockId = ( { displayFormat = 'none' } ) => {
		return (
			editMode
				? (
					<TextInput
						label="Edit Block ID"
						hideLabel={ true }
						value={ currentBlockId }
						compact={ false }
						cancelButton={ true }
						onSave={ ( value = null ) => {
							if ( value !== null ) {
								setBlockId( value )
								setCurrentBlockId( value )
							}
							setEditMode( false )
						} }
						validate={ StringValidator( { minLength: 3, startWith: [ 'letter' ] } ) }
						help="The block ID must be unique. No spaces."
					/>
				)
				: (
					( displayFormat === 'field' &&
					<PanelRow>
						<div style={ { overflowWrap: 'anywhere' } }>
							{ currentBlockId }
						</div>
					</PanelRow>
					) ||
					( displayFormat === 'row' &&
					<PanelRow>
						<dl className="key-value-list">
							<dt>Block ID:</dt>
							<dd> { currentBlockId } </dd>
						</dl>
					</PanelRow>
					) ||
					<span>{ currentBlockId }</span>
				)
		)
	}

	/**
	 * @param {Object} props
	 * @param {Unwrap<Button.Props>} [props.editButton] Enable/disable block ID edit mode.
	 * @param {string} [props.buttonLabel]
	 */
	const EditBlockId = ( { buttonLabel = 'Edit', editButton = undefined } ) => {
		/**
		 * @type {Unwrap<Button.Props>}
		 */
		const editButtonProps = {
			...editButton,
			onClick: () => setEditMode( ! editMode ),
		}
		const EditBlockIdButton = <Fragment>
			{ ! editMode &&
				<Button { ...editButtonProps }>{ buttonLabel }</Button>
			}
		</Fragment>

		return EditBlockIdButton
	}

	return { BlockId, EditBlockId }
}
