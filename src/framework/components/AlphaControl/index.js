import { RangeControl } from '@wordpress/components'
import { useInstanceId } from '@wordpress/compose'

/**
 * Transparency control
 *
 * @param {Object} props
 * @param {string} [props.ariaLabel] Help for screen readers
 * @param {string} [props.help] Optional additional help/instructions
 * @param {string} [props.label] Slider label
 * @param {(alpha: number) => void} props.setAlpha Update alpha avalue
 * @param {string} [props.title] Title
 * @param {number} props.value Alpha value (raw)
 */
export default function AlphaControl( {
	ariaLabel = 'Control transparency (alpha value)',
	help = undefined,
	label = '0% ◀ Transparent | Opaque ▶ 100%',
	setAlpha,
	title = 'Transparency',
	value,
} ) {
	const instanceId = useInstanceId( AlphaControl, 'AlphaControl' )

	const alphaPct = value === undefined || value < 0 || value > 1
		? 100
		: value * 100

	const onChange = ( pctValue ) => {
		const alphaValue = pctValue < 0 || pctValue > 100
			? null
			: pctValue / 100
		setAlpha( alphaValue )
	}

	return (
		<div className={ `${ instanceId }` } key={ instanceId }>
			<h4>{ title }</h4>
			<RangeControl
				aria-label={ ariaLabel }
				label={ label }
				help={ help }
				value={ alphaPct }
				min={ 0 }
				max={ 100 }
				onChange={ onChange }
			/>
		</div>
	)
}
