import { arrayFindAll } from '@framework/utils'

import { BaseControl } from '@wordpress/components'

import { useInstanceId } from '@wordpress/compose'

/**
 *
 *
 * @param {Object} props
 * @param {PlainObj[]} props.list
 * @param {{ id: number, title: string, keys: string[], extra: (any|undefined) }[]} [props.groups] Select and group subsets of the button data by key(s). Renders group items with props.render, wrapped in BaseControl. Use 'extra' to add custom data about a group.
 * @param {string} props.lookupKey
 * @param { (groupItems: any[], group: { id: number, title: string, keys: string[], extra: (any|undefined) }) => JSX.Element} props.render
 */
export default function GroupedListItems( { list, groups, lookupKey, render: renderFn } ) {
	const instanceId = useInstanceId( GroupedListItems, 'grouped-list-items' )

	return (
		<div id={ `${ instanceId }` } key={ instanceId }>
			{
				groups.map( ( group, index ) => {
					const grpId = `${ instanceId }-${ index }`

					// Grab groups from buttons array by key value
					const groupItems = arrayFindAll( list, group.keys, lookupKey )

					if ( ! groupItems.length ) {
						return null
					}

					return <BaseControl id={ grpId } label={ group.title } key={ grpId } >
						{ renderFn( groupItems, group ) }
					</BaseControl>
				} )
			}
		</div>
	)
}
