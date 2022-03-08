/**
 * ### External dependencies ###
 */
import React from 'react'

import _ from 'lodash'

/**
 * ### Internal dependencies ###
 */

// @see https://www.npmjs.com/package/@wordpress/scripts#using-css
import './editor.scss'
import '@framework/css/editor.scss'

import * as settings from './settings'

import { pluginSettings } from '@framework/plugin-utils'

import {
	AdvancedTab,
	AdvancedTabPanel,
	BlockInfoPanel,
	InspectorPanel,
} from '@framework/components'

import useBlockFramework from '@framework/block-framework'

import useAlign from '@extensions/align'
import withColourTheme from '@extensions/colour-theme'
import { withBackgroundColour, withOverlayColour } from '@extensions/colour'
import withBackgroundImage from '@extensions/background-image'
import withWidth from '@extensions/width'

import {
	AlignControl,
	AttributeInspectorControl,
	BackgroundImageControl,
	BlockClassControl,
	BlockIdControlFactory,
	BlockCssControl,
	BackgroundColourControl,
	ColourThemeControl,
	SpacingControl,
	WidthControl,
} from '@block-controls'

/**
 * ### Wordpress dependencies ###
 */
import {
	Fragment,
} from '@wordpress/element'

import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor'

import {
	Button,
	PanelBody,
} from '@wordpress/components'

// @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
// import { __ } from '@wordpress/i18n'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {BlockProps} props
 * @return {WP.WPElement} Element to render.
 */
export default function Edit( props ) {
	// _L1( `################ Edit (UniversalBox) ################` )

	const {
		blockSetup,
		inspectorTabs,
	} = settings

	// ### Init block framework ###
	const block = useBlockFramework( props, blockSetup, [
		useAlign,
		withWidth,
		withBackgroundColour,
		withBackgroundImage,
		withColourTheme,
		withOverlayColour,
	] )

	// ### Prepare render ###
	const presets = pluginSettings.presets
	const {
		marginPresets,
		paddingPresets,
		textAlignments,
	} = presets

	const { attributes } = props
	const { textAlign } = attributes
	const { BlockId, EditBlockId } = BlockIdControlFactory( block.blockId, block.setProps )
	const blockProps = block.useBlockProps()
	const innerBlockProps = block.useInnerBlockProps()
	const { parent } = block.related
	const blockInfoCells = [
		{
			name: 'blockId',
			title: 'Block ID',
			body: <BlockId />,
			footer: <EditBlockId />,
		},
		{
			name: 'parent',
			title: 'Parent block',
			body: <Fragment>
				{ parent ? parent.name : <span style={ { opacity: 0.5 } }>n/a</span> }
			</Fragment>,
			footer: <Fragment>
				{ parent
					? <Button onClick={ block.related.selectParent }>Select</Button>
					: <Button disabled>Select</Button>
				}
			</Fragment>,
		},
	]

	const inspectorControls =
		<InspectorControls>
			<BlockInfoPanel
				cells={ blockInfoCells }
			/>

			<AdvancedTabPanel
				type="icons-stacked"
				style={ [ 'framed', 'auto-width' ] }
				spacing="large"
				tabs={ inspectorTabs }
			>
				<AdvancedTab name="style">
					<InspectorPanel title="Colour Theme" initialOpen={ false }>
						<ColourThemeControl block={ block } />
					</InspectorPanel>
					<InspectorPanel title="Background Colour" initialOpen={ false }>
						<BackgroundColourControl block={ block } />
					</InspectorPanel>
					<InspectorPanel title="Background Image" initialOpen={ false }>
						<BackgroundImageControl block={ block } />
					</InspectorPanel>
				</AdvancedTab>

				<AdvancedTab name="layout">
					<InspectorPanel title="Alignment" initialOpen={ false }>
						<AlignControl block={ block } />
					</InspectorPanel>
					<InspectorPanel title="Padding" initialOpen={ false }>
						<SpacingControl block={ block } attribute="padding" presets={ paddingPresets } />
					</InspectorPanel>
					<InspectorPanel title="Margin" initialOpen={ false }>
						<SpacingControl block={ block } attribute="margin" presets={ marginPresets } />
					</InspectorPanel>
					<InspectorPanel title="Width" initialOpen={ false }>
						<WidthControl block={ block } />
					</InspectorPanel>
				</AdvancedTab>

				{ /* <AdvancedTab name="advanced">
		</AdvancedTab> */ }

			</AdvancedTabPanel>

			<PanelBody title="Block Classes" initialOpen={ false }>
				<BlockClassControl block={ block } />
			</PanelBody>
			<PanelBody title="Block CSS" initialOpen={ false }>
				<BlockCssControl css={ () => block.generateFrontendCss() } />
			</PanelBody>
			<PanelBody title="Attribute Inspector" initialOpen={ false }>
				<AttributeInspectorControl attributes={ attributes } />
			</PanelBody>
		</InspectorControls>

	const blockContents =
		<div { ...blockProps }>
			<BlockControls>
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => block.setAttr( { textAlign: value } ) }
					alignmentControls={ textAlignments }
				/>
			</BlockControls>

			{ /* This replaces <InnerBlocks> */ }
			<div { ...innerBlockProps }>
				{ innerBlockProps.children }
			</div>
		</div>

	return (
		<React.StrictMode>
			{ inspectorControls }
			{ blockContents }
		</React.StrictMode>
	)
}
