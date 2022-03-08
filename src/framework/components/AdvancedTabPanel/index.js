/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### Internal dependencies ###
 */
import Icons from '@assets/icons'

/**
 * ### External dependencies ###
 */
import classnames from 'classnames'

/**
 * ### Wordpress dependencies ###
 */
import {
	TabPanel,
} from '@wordpress/components'

import {
	Fragment,
	useReducer,
	useState,
} from '@wordpress/element'

/**
 * Augments the built-in TabPanel with some extra capabilities.
 *
 * @param {Object} props
 * @param {JSX.Element[] | ((screen: TabPanelTab) => JSX.Element)} props.children
 *
 * @param {string} [props.className=undefined]
 * @param {TabPanelTab[]} props.tabs
 * @param {'small'|'medium'|'large'|'x-large'} [props.spacing='medium'] Space around icons and labels (doesn't work with type `compact`)
 * @param {'framed'|'auto-width'|Array<'framed'|'auto-width'>} [props.style=undefined]
 * @param {'compact'|'icons'|'icons-stacked'|'icons-only'|'default'} [props.type='default']
 */
export function AdvancedTabPanel( {
	children,
	className = '',
	tabs,
	spacing = 'medium',
	style = undefined,
	type = 'default',
} ) {
	const [ currentTab, setCurrentTab ] = useReducer( ( state, tabName ) => {
		return tabs.find( ( tab ) => tab.name === tabName )
	}, tabs[ 0 ] )

	// ~ Method of calculating classes at the beginning of first render - and only then.
	// eslint-disable-next-line no-unused-vars
	const tabClassNames = useState( () => {
		if ( type.substring( 0, 5 ) === 'icons' ) {
			// Mutates `tabs`
			return tabs.map( ( tab ) => {
				const dashIcon = ! ( tab.icon in Icons )
				tab.className = classnames( {
					[ tab.className ]: tab.className,
					[ `dashicons-${ tab.icon }` ]: dashIcon,
					'dashicons-before': dashIcon,
				} )
				return tab
			} )
		}
	} )

	const styleArr = style && ( Array.isArray( style ) ? style : [ style ] )
	const styleStr = styleArr && styleArr.map( ( s ) => `atp--${ s }` )

	const componentClassName = classnames( [
		'advanced-tab-panel',
		className ?? '',
		spacing ? `atp--size-${ spacing }` : '',
		styleStr ?? styleStr,
		// style ? `atp--${ style }` : '',
		type === 'default' ? '' : `atp-${ type }`,
	] )

	// const Tab = CurrentTab( children, currentTab, tabs )

	return (
		<TabPanel
			className={ componentClassName }
			activeClass="active-tab"
			tabs={ tabs }
			onSelect={ setCurrentTab }
		>
			{ () => CurrentTab( children, currentTab, tabs ) }
		</TabPanel>
	)
}

/**
 * Component for creating individual tabs for {@link AdvancedTabPanel}.
 *
 * @param {Object} props
 * @param {JSX.Element | JSX.Element[]} props.children
 * @param {string} props.name Name matching a member of `tabs` supplied to `AdvancedTabPanel`.
 */
export function AdvancedTab( { children, name } ) {
	return <Fragment>
		{ children ?? <p>Missing tab contents for tab `{ name }`.</p> }
	</Fragment>
}

/**
 * @param {JSX.Element[] | ((screen: TabPanelTab) => JSX.Element)} children
 * @param {TabPanelTab} tab
 * @param {TabPanelTab[]} tabs
 */
function CurrentTab( children, tab, tabs ) {
	const description = tabs.find( ( s ) => s.name === tab.name ).description
	const Description = () => description
		? <div className="atp-description">
			{ description }
		</div>
		: null

	if ( typeof children === 'function' ) {
		return <Fragment>
			<Description />
			{ children( tab ) }
		</Fragment>
	}
	else if ( Array.isArray( children ) ) {
		const jsx = children.find( ( child ) => child.props.name === tab.name )

		return jsx
			? <Fragment>
				<Description />
				{ jsx }
			</Fragment>
			: <p>Error: Missing tab contents!</p>
	}

	return <p>Error: invalid tab contents!</p>
}

// 	/**
// 	 * @param {TabPanelTab} tab
// 	 */
// 	 const getTabComponent = ( tab ) => {
// 		const description = tabs.find( ( s ) => s.name === tab.name ).description
// 		const Description = () => description
// 			? <div className="atp-description">
// 				{ description }
// 			</div>
// 			: null

// 		if ( typeof children === 'function' ) {
// 			return <Fragment>
// 				<Description />
// 				{ children( tab ) }
// 			</Fragment>
// 		}
// 		else if ( Array.isArray( children ) ) {
// 			const jsx = children.find( ( child ) => child.props.name === tab.name )

// 			return jsx
// 				? <Fragment>
// 					<Description />
// 					{ jsx }
// 				</Fragment>
// 				: <p>Error: Missing tab contents!</p>
// 		}

// 		return <p>Error: invalid tab contents!</p>
// }
