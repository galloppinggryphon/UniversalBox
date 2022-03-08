/**
 * ### Internal dependencies ###
 */

import {
	gutterDimensions,
	breakpointConfig as screenConfig,
	spacingDimensions,
} from '~/plugin-config'

import {
	getAttrProps,
} from '@framework/plugin-utils'

import {
	AdvancedTabPanel,
	RangeControlWithReset,
} from '@framework/components'

/**
 * ### Wordpress dependencies ###
 */

import { Fragment } from '@wordpress/element'

import {
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components'

import { __ } from '@wordpress/i18n'

/**
 * Inspector control for spacing attributes: gutter, padding, margin.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'margin'|'padding'|'gutter'>} props.block
 * @param {SpacingAttributesList} props.attribute
 * @param {SpacingPreset[]} props.presets
 */
export default function SpacingControl( { block, attribute, presets } ) {
	const { attributes, setProps } = block
	const { attributeConfig } = block.settings

	const dimensions = attribute === 'gutter' ? gutterDimensions : spacingDimensions

	const { enableLock, maxRange } = attributeConfig?.[ attribute ]?.__config || {}

	/**
	 * ! This is a hack
	 *
	 *  @type {any}
	 */
	const allScreens = getAttrProps( attributes, attribute, 'all' )

	_L1( 'spacingcontrol' )
	_log( block )
	_log( attributes.padding )

	return (
		<Fragment>
			{
				attribute === 'padding' && block.hasBackground &&

				<ToggleControl
					label={ `Default background padding` }
					checked={ ! attributes?.[ attribute ]?.noAutoBgPadding }
					onChange={ ( value ) =>
						setProps(
							attribute,
							{ noAutoBgPadding: ! value }
						)
					}
				/>
			}

			{
				( ( attribute === 'margin' || attribute === 'padding' ) && ! ( attribute === 'padding' && attributes?.[ attribute ]?.noAutoBgPadding !== true ) ) &&

				<SelectControl
					label="Select preset"
					value={ attributes?.[ attribute ]?.preset ?? '' }
					options={ presets }
					onChange={ ( value ) => setProps( attribute, { preset: value } ) }
				/>

			}

			{
				attribute !== 'gutter' &&

				<ToggleControl
					label={ `Custom ${ attribute }` }
					checked={ attributes?.[ attribute ]?.enableCustom ?? false }
					onChange={ ( value ) => setProps( attribute, { enableCustom: value } ) }
				/>
			}

			{
				( attribute === 'gutter' || attributes?.[ attribute ]?.enableCustom ) &&

				<AdvancedTabPanel type="icons-only" spacing="medium" tabs={ screenConfig }>
					{ ( screen ) => {
						if ( attributes?.[ attribute ]?.responsiveProps?.[ screen.name ]?.disabled ) {
							return
						}

						if ( attribute === 'gutter' ) {
							const props = getAttrProps( attributes, attribute, screen.name ) || {}

							return (
								<Fragment>
									<SelectControl
										label="Horizontal preset (top and bottom)"
										value={ props.horizontalPreset ?? '' }
										options={ presets }
										onChange={ ( value ) =>
											setProps( attribute, { horizontalPreset: value }, screen.name )
										}
									/>
									<SelectControl
										label="Vertical preset (left and right side)"
										value={ props.verticalPreset ?? '' }
										options={ presets }
										onChange={ ( value ) =>
											setProps( attribute, { verticalPreset: value }, screen.name )
										}
									/>
								</Fragment>
							)
						}

						const attrProps = attributes?.[ attribute ] ?? {}
						const props = getAttrProps( attributes, attribute, screen.name ) ?? {}

						_yellow( `ATTRIBUTES` )
						_log( 'attrProps: ', attrProps )
						_log( 'PROPS:', props )

						return (
							<Fragment>
								{
									attrProps.enableCustom && enableLock &&

									<ToggleControl
										label="Lock sides"
										checked={ props.locked ?? false }
										onChange={ ( value ) => setProps( attribute, { locked: value }, screen.name ) }
									/>
								}

								{
									attrProps.enableCustom && props.locked &&

									<RangeControlWithReset
										onReset={ () => setProps( attribute, { all: undefined }, 'all' ) }
									>
										<RangeControl
											label={ __( 'All sides' ) }
											// key={ `RangeControlAll${ controlKey }` }
											value={ allScreens?.all }
											min={ 0 }
											max={ maxRange }
											onChange={ ( value ) => setProps( attribute, { all: value }, 'all' ) }
										/>
									</RangeControlWithReset>
								}

								{
									attrProps.enableCustom && ! props.locked &&

										dimensions.map( ( dimension ) => {
											const [ rangeKey, rangelabel ] = Object.entries( dimension )[ 0 ]

											return (
												<RangeControlWithReset
													key={ rangeKey }
													onReset={ () => setProps( attribute, { [ rangeKey ]: undefined }, screen.name ) }
												>
													<RangeControl
														label={ rangelabel }
														value={ props[ rangeKey ] }
														min={ 0 }
														max={ maxRange }
														onChange={ ( value ) => setProps( attribute, { [ rangeKey ]: value }, screen.name ) }
													/>
												</RangeControlWithReset>
											)
										} )
								}

							</Fragment>
						)
					} }
				</AdvancedTabPanel>
			}
		</Fragment>
	)
}
