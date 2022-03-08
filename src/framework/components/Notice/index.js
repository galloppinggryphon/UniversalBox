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

import {
	Icon,
} from '@wordpress/components'

import { useInstanceId } from '@wordpress/compose'

/**
 * @param {number|undefined} [props.iconSize]
 * @typedef {Partial<{
 * 		spaceBefore: number,
 * 		spaceAfter: number
 * }>} NoticeLayout
 *
 * @typedef {Unwrap<Partial<Omit<GetTypeProp<Parameters<Notice>, number>, 'children'>>>} NoticeProps
 */

/**
 * Display generic notice.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string|undefined} [props.className]
 * @param {WP.Dashicon|undefined} [props.icon]
 * @param {number|undefined} [props.iconSize]
 * @param {boolean|undefined} [props.muted]
 * @param {NoticeLayout|undefined} [props.layout]
 */
export function Notice( { children, className, icon = undefined, iconSize = 14, layout = undefined, muted = false } ) {
	const instanceId = useInstanceId( Notice, 'Notice' )
	const classes = classnames( 'notice-component', className, {
		'notice--muted': muted,
		[ `dashicons-${ icon }` ]: ! muted && icon,
		'dashicons-before': ! muted && icon,
	} )
	let componentStyle = {}

	const { spaceBefore, spaceAfter } = layout ?? {}
	if ( spaceBefore ) {
		componentStyle.marginTop = `${ Number( spaceBefore ) }px`
	}
	if ( spaceAfter ) {
		componentStyle.marginBottom = `${ Number( spaceAfter ) }px`
	}

	componentStyle = { ...componentStyle }

	return (
		<div className={ classnames( instanceId, classes ) } style={ componentStyle }>
			{ /* { icon && ! muted && <Icon icon={ icon } size={ iconSize } className="notice-icon" /> } */ }
			{ children }
		</div>
	)
}

/**
 * Display Clue (usage tip).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|undefined} [props.iconSize]
 * @param {boolean|undefined} [props.muted]
 * @param {PlainObj<string|number>|undefined} [props.layout]
 */
export function Clue( { children, iconSize = 12, muted = false, layout = undefined } ) {
	/** @type {NoticeProps} */
	const props = {
		className: 'notice-clue',
		icon: 'lightbulb',
		iconSize,
		layout,
		muted,
	}

	return <Notice children={ children } { ...props } />
}

/**
 * Display error.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|undefined} [props.iconSize]
 * @param {boolean|undefined} [props.muted]
 * @param {PlainObj<string|number>|undefined} [props.layout]
 */
export function Error( { children, iconSize = 12, muted = false, layout = undefined } ) {
	/** @type {NoticeProps} */
	const props = {
		className: 'notice-error',
		icon: 'no',
		iconSize,
		layout,
		muted,
	}

	return <Notice children={ children } { ...props } />
}

/**
 * Display info
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|undefined} [props.iconSize]
 * @param {boolean|undefined} [props.muted]
 * @param {PlainObj<string|number>|undefined} [props.layout]
 */
export function Info( { children, iconSize = 14, muted = false, layout = undefined } ) {
	/** @type {NoticeProps} */
	const props = {
		className: 'notice-info',
		icon: 'info',
		iconSize,
		layout,
		muted,
	}

	return <Notice children={ children } { ...props } />
}

/**
 * Display Warning
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number|undefined} [props.iconSize]
 * @param {boolean|undefined} [props.muted]
 * @param {PlainObj<string|number>|undefined} [props.layout]
 */
export function Warning( { children, iconSize = 12, muted = false, layout = undefined } ) {
	/** @type {NoticeProps} */
	const props = {
		className: 'notice-warning',
		icon: 'warning',
		iconSize,
		layout,
		muted,
	}

	return <Notice children={ children } { ...props } />
}
