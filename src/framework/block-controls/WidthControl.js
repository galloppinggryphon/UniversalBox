import {
	ButtonGroupControl,
	AdvancedTabPanel,
	GroupedListItems,
	RangeControlWithReset,
	Spacer,
} from '@framework/components'

import {
	getAttrProps,
	pluginSettings,
} from '@framework/plugin-utils'

import {
	RangeControl,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'

/**
 * Inspector control for width.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'width'>} props.block
 */
export default function WidthControl( { block } ) {
	const attributes = block.attributes
	const { width = {} } = attributes

	const { setWidthPreset } = block

	const { widthPresets } = pluginSettings.presets

	const groups = [
		{ id: 1, title: 'Basic presets', extra: 'Choose width preset among basic presets.', keys: [ 'auto', 'content' ] },
		{ id: 2, title: 'Advanced presets', extra: 'Choose width preset among advanced presets.', keys: [ 'layout' ] },
		{ id: 3, title: 'Custom width', extra: 'Select to use custom width.', keys: [ 'custom' ] },
	]

	return (
		<Fragment>
			<GroupedListItems
				list={ widthPresets }
				groups={ groups }
				lookupKey="category"
				render={ ( groupItems, group ) => (
					<ButtonGroupControl
						label={ group.extra }
						selected={ width.preset ?? '' }
						buttons={ groupItems }
						buttonStyle="large"
						perRow={ 4 }
						showInfo={ false }
						onClick={ ( option ) => setWidthPreset( option ) }
					/>
				) }
			/>

			{ width.preset === 'custom' && ( () => {
				return true
			} )() && <CustomWidthControl block={ block } />
			}
		</Fragment>
	)
}

/**
 * @param {Object} props
 * @param {ComposeBlockFramework< 'width'>} props.block
 */
function CustomWidthControl( { block } ) {
	const { attributes, setProps } = block
	const maxRange = block.settings.attributeConfig?.width?.__config?.maxRange || 1100

	const { breakpointConfig, widthPresets } = pluginSettings.presets

	const widthType = [
		{ label: 'Disabled', title: 'Rules for this screen size are disabled.', value: undefined },
		{ label: 'Relative', title: 'Set the size in percent.', value: 'relative' },
		{ label: 'Absolute', title: 'Set the size in pixels.', value: 'absolute' },
	]

	return (

		<AdvancedTabPanel type="icons-only" tabs={ breakpointConfig }>
			{ ( screen ) => {
				if ( attributes?.width?.responsiveProps?.[ screen.name ]?.disabled ) {
					return
				}

				const props = getAttrProps( attributes, 'width', screen.name ) ?? {}

				return ( <Fragment>
					<ButtonGroupControl
						label="Custom size control"
						selected={ props.type }
						buttons={ widthType }
						// iconSize={ 100 }
						onClick={ ( type ) => {
							const newProps = {
								type,
							}

							if ( type === 'absolute' ) {
								newProps.absoluteWidth = props.absoluteWidth ?? maxRange
							}
							else if ( type === 'relative' ) {
								newProps.relativeWidth = props.relativeWidth ?? 100
							}

							setProps( 'width', newProps, screen.name )
						} }
					/>

					<Spacer height="20" />

					{ props.type === 'relative' &&
						<RangeControlWithReset
							onReset={ () => setProps( 'width', { relativeWidth: undefined }, screen.name ) }
						>
							<RangeControl
								label={ 'Width (%)' }
								value={ props.relativeWidth }
								min={ 0 }
								max={ 100 }
								initialPosition={ 100 }
								key={ `${ screen.name }.type` }
								onChange={ ( value ) => {
									setProps( 'width', { relativeWidth: value }, screen.name )
								} }
							/>
						</RangeControlWithReset>
					}

					{ props.type === 'absolute' &&
						<RangeControlWithReset
							onReset={ () => setProps( 'width', { absoluteWidth: undefined }, screen.name ) }
						>
							<RangeControl
								label={ 'Width (px)' }
								value={ props.absoluteWidth }
								min={ 0 }
								max={ maxRange }
								onChange={ ( value ) => {
									setProps( 'width', { absoluteWidth: value }, screen.name )
								} }
							/>
						</RangeControlWithReset>
					}
				</Fragment> )
			}
			}
		</AdvancedTabPanel>
	)
}
