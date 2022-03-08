/**
 * ### Internal dependencies ###
 */

import { pluginSettings } from '@framework/plugin-utils'

import {
	AdvancedColourSelector,
	Clue,
	Spacer,
} from '@framework/components'

/**
 * ### Wordpress dependencies ###
 */

import {
	ToggleControl,
} from '@wordpress/components'

import {
	Fragment,
} from '@wordpress/element'
import { arrayFind } from '@framework/utils'

/**
 * Create colour control for a given colour attribute (e.g. background). Returns inspector control component and colour setter.
 *
 * @param {Object} props
 * @param {ComposeBlockFramework<'colourTheme'>} props.block
 */
export default function ColourThemeControl( { block } ) {
	const { colourTheme } = block.attributes
	const { setColourTheme, setProps } = block

	const {
		colourThemes,
	} = pluginSettings.presets

	const colourThemeCategories = Array.from( new Set( [ ...colourThemes.map( ( x ) => x.category ) ] ) )

	if ( ! colourThemeCategories.length ) {
		colourThemeCategories.push( null )
	}
	const theme = arrayFind( colourThemes, colourTheme?.name, 'slug' )
	_log( '  theme  ', theme )

	return <Fragment>
		<Clue>Predefined sets of background and foreground colour.</Clue>
		{ theme &&
		<Fragment>
			<Spacer height={ 10 } />
			<ToggleControl
				label={ 'Enable theme background' }
				checked={ ! colourTheme?.disableBackgroundColour }
				onChange={ ( value ) => {
					setProps( 'colourTheme', { disableBackgroundColour: ! value } )
				} }
			/>
		</Fragment>
		}

		{
			colourThemeCategories.map( ( category, index ) => {
				const colours = category ? colourThemes.filter( ( x ) => x.category === category ) : colourThemes
				const label = category ? category : 'Colour themes'

				return 	<AdvancedColourSelector
					label={ label }
					key={ label.replace( ' ', '_' ) }
					colours={ colours }
					selected={ theme }
					onChange={ setColourTheme }
					largeSwatches={ true }
					swatchesPerRow={ 6 }
					disableCustomColours={ true }
					showIndicator={ ! index }
					showLabel={ true }
					clearable={ ! index ? 'top' : ( index === ( colourThemeCategories.length - 1 ) && 'bottom' ) }
				/>
			} )
		}
	</Fragment>
}
