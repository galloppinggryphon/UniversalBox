/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### External dependencies ###
 */
import classnames from 'classnames'

/**
 * ### Wordpress dependencies ###
 */
import { useInstanceId } from '@wordpress/compose'

import {
	Button,
	Icon,
} from '@wordpress/components'

import {
	useState,
} from '@wordpress/element'

/**
 * Create InspectorPanel component, an (almost) drop-in replacement for PanelBody with support for nesting.
 *
 * @param {Object} props
 * @param {boolean} [props.initialOpen] [false]
 * @param {string} props.title
 * @param {boolean} [props.isSubPanel] [false]
 * @param {React.ReactNode} props.children
 */
export default function InspectorPanel( { initialOpen = false, isSubPanel = false, title, children } ) {
	const instanceId = useInstanceId( InspectorPanel, 'inspector-panel' )

	const [ isOpened, setIsOpened ] = useState( initialOpen )

	const classNames = classnames( 'inspector-panel', {
		'is-opened': isOpened,
		'inspector-panel--top-panel': ! isSubPanel,
		'inspector-panel--sub-panel': isSubPanel,
	} )

	const icon = isOpened ? 'arrow-down' : 'arrow-right'

	return (
		<div className={ classNames } aria-expanded={ isOpened } id={ `${ instanceId }` } key={ instanceId }>
			<h3 className="inspector-panel-header">
				<Button
					className="inspector-panel-toggle"
					onClick={ () => setIsOpened( ( x ) => ! x ) }
				>
					<Icon icon={ icon } size={ 24 } />
					{ title }
				</Button>
			</h3>
			{ isOpened &&
			<div className="inspector-panel-body">
				{ children }
			</div>
			}
		</div>
	)
}
