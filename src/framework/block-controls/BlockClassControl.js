import { StringValidator } from '@framework/plugin-utils'

import {
	TextInput,
	SelectList,
	InspectorPanel,
} from '@framework/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 * Inspector control for modifying or reviewing block classes.
 *
 * @param {Object} props
 * @param {BlockFramework} props.block
 */
export default function BlockClassControl( { block } ) {
	const { attributes, setProps } = block
	const { customClassNames } = attributes

	return (
		<Fragment>
			<InspectorPanel title="Custom classes">
				<small style={ { display: 'block', paddingBottom: '20px' } }>Custom classes should be used sparingly. Separate class names with a single space.</small>
				<TextInput
					label="Outer classes:"
					rows={ 1 }
					value={ customClassNames?.outer?.join( ' ' ) || '' }
					onSave={ ( value ) => saveCustomClassnames( setProps, 'outer', value ) }
					validate={ StringValidator( { minLength: 1, startWith: [ 'letter', 'dash', 'underscore' ], listSeparator: ' ' } ) }

				/>
				<TextInput
					label="Inner classes:"
					rows={ 1 }
					value={ customClassNames?.inner?.join( ' ' ) || '' }
					onSave={ ( value ) => saveCustomClassnames( setProps, 'inner', value ) }
					validate={ StringValidator( { minLength: 1, startWith: [ 'letter', 'dash', 'underscore' ], listSeparator: ' ' } ) }

				/>
			</InspectorPanel>
			<InspectorPanel title="Class inspector">
				<h4>Read-only lists of all classes in use.</h4>
				<SelectList
					label="Outer block:"
					options={ block.classNames.outer }
					rows={ 5 }
					className={ 'select-list' }
				/>
				<hr />
				<SelectList
					label="Inner block:"
					options={ block.classNames.inner }
					rows={ 5 }
					className={ 'select-list' }
				/>
			</InspectorPanel>
		</Fragment>
	)
}

function saveCustomClassnames( setProps, scope, classes ) {
	// const customClassNames =
	// setAttr( { customClassNames: value } )
	const classList = classes.replace( /[\s]+/, ' ' ).split( ' ' )
	const classSet = new Set( classList )

	setProps( 'customClassNames', {
		[ scope ]: Array.from( classSet ),
	} )
}
