<?php
namespace blocky_blocks_ub;
/**
 * Plugin Name:       Universal Box v3 (part of Blocky Blocks)
 * Description:       Advanced layout and content block
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Version:           3.0.0
 * Author:            Bjornar Egede-Nissen
 * License:           MIT
 * License URI: 	  ./LICENSE
 * Text Domain:       bb-box
 *
 * @package           blocky-blocks
 */


const NS = 'blocky-blocks';
const BLOCK_NAME = 'box';
const FULL_BLOCK_NAME = NS . '/' . BLOCK_NAME;

const SETTINGS_KEYS = [
	'cssColourVariablePrefix',
	'presets',
	'utilityClassNameTemplate'
];

const DEFAULT_SETTINGS = [
	'cssColourVariablePrefix' => 'colour-',
	'themeClassPrefix' => 'theme-',
	'utilityClassNameTemplate' => 'bootstrap',
	'UniversalBox' => [
		'extraClassNames' => ['outer' => ['bb-box'], 'inner' => ['bb-box-inner']],
	],
	// 'presets' => []
];

$settings['presets']['colourThemes'] = [
	['name' => 'Blue and white', 'slug' => 'blue-white', 'color' => 'blue'],
];

add_action('init',  NS('init'), 1);
add_action( 'wp_enqueue_scripts', NS('frontend_scripts' ));

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/classes/wp_block_type/__construct/
 */
function init()
{
	add_action( 'admin_enqueue_scripts', NS('export_plugin_settings'), 9999);
	register_block_type_from_metadata(__DIR__);
}

/**
 * Export plugin settings to JS environment.
 */
function export_plugin_settings() {
	$settings = apply_filters( 'blocky_blocks_plugin_settings', DEFAULT_SETTINGS );

	error_log("HELLO WORLD");


	$settings = array_filter($settings, fn ($key) => in_array($key, SETTINGS_KEYS), ARRAY_FILTER_USE_KEY );
	$config = json_encode([
		'pluginUrl' => plugins_url('', __FILE__),
		'assetDirectory' => 'src/assets'
	]);


	$handle = NS . '-' . BLOCK_NAME . '-editor-script';

	//Export variables to JS
	wp_localize_script(
		$handle,
		'blockyBlocksPluginSettings',
		$settings
	);

	wp_localize_script(
		$handle,
		'blockyBlocksPluginConfig',
		$config
	);
}

function frontend_scripts() {
	//#todo: load scripts conditionally?
	//if ( has_block( FULL_BLOCK_NAME ) ) {

		wp_enqueue_script(
			NS . '-style-loader',
        		plugins_url( 'build/bb_style_loader.js', __FILE__ ),
			[],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/bb_style_loader.js' ),
			true
		);
}

function NS($name) {
	return __NAMESPACE__ . "\\$name";
}
