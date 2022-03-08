// ### WP definition aliases ###
// Simplified access to internal WP types + tools and shims for WP types.

import Blocks from "@wordpress/blocks";
import BlockEditor from "@wordpress/block-editor";
import Components from "@wordpress/components";
import Notices from '@wordpress/notices'
import Element from '@wordpress/element'

declare global {
	/**
	 * Aliases, shims and tools for utilizing internal WP types.
	 *
	 * Access with `WP.*`.
	 *
	 * Note: Aliases do _not_ match internal names perfectly.
	 */
	namespace WP {
		/**
		 * Recreate and simplify WP's BlockAttributes type.
		 * This one is really tricky.
		 */
		export type BlockAttributes = {
			[string: string]: Blocks.BlockAttribute<PlainObj>;
		};

		/** Block settings object  */
		export type Block = PartialDeep<Writable<Blocks.Block<PlainObj>>>

		export type BlockConfiguration = Blocks.BlockConfiguration

		/** Blocks returned by useSelect */
		export type BlockInstance = Blocks.BlockInstance

		/** ColorPalette.Color */
		export type Colour = Components.ColorPalette.Color;

		/** Dashicon.Icon, usewith `keyof` for autocomplete. */
		export type Dashicon = Components.Dashicon.Icon;

		/** EditorSettings */
		export type EditorSettings = BlockEditor.EditorSettings;

		/** EditorColor */
		export type EditorColour = Partial<BlockEditor.EditorColor>;

		/** CreateNotice status type. */
		export type NoticeStatus = Notices.Status

		/** textAlignment object */
		export type textAlignment =
			BlockEditor.AlignmentToolbar.Props["alignmentControls"][0];

		/** Access EditorSettings by key. Supports autocomplete with `keyof`. */
		export type ThemeSettings<Key extends keyof BlockEditor.EditorSettings> =
			BlockEditor.EditorSettings[Key];

		export type WPElement = Element.WPElement
	}
}
