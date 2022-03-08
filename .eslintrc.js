module.exports = {
	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'./node_modules/logbookjs/.eslintrc',
	],
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@wordpress/babel-preset-default' ) ],
		},
	},
	globals: {
		blockyBlocksPluginSettings: 'readonly',
	},
	env: {
		browser: true,
	},
	rules: {
		// === WP ===
		'@wordpress/no-unused-vars-before-return': 'off',

		// === Disable eslint-plugin-prettier ===
		'prettier/prettier': 'off',

		// === Import resolver ===
		// This triggers an error when importing packages that are dependencies of other packages (e.g. @wordpress packages)
		'import/no-extraneous-dependencies': 'off',
		// 'import/named': 'off',

		// === Off ===
		'arrow-spacing': 'off',
		'no-mixed-spaces-and-tabs': 'warn',
		'import/no-unresolved': 'off',
		'no-var': 'off',
		'no-nested-ternary': 'off',
		'no-undef': 'off',

		// === Eslint ===
		'array-bracket-spacing': [ 'warn', 'always' ],
		'arrow-parens': [ 'warn', 'always' ],
		'brace-style': [ 'warn', 'stroustrup' ],
		'comma-dangle': [ 'warn', 'always-multiline' ],
		'comma-spacing': [ 'warn', { before: false, after: true } ],
		// "consistent-return":"warn",
		'computed-property-spacing': [ 'warn', 'always' ],
		curly: [ 'warn', 'all' ],
		eqeqeq: [ 'error', 'smart' ],
		'func-call-spacing': [ 'warn', 'never' ],
		indent: [
			'warn',
			'tab',
			{
				SwitchCase: 1,
			},
		],
		'key-spacing': [
			'warn',
			{
				beforeColon: false,
				afterColon: true,
			},
		],
		'keyword-spacing': [
			'warn',
			{
				before: true,
				after: true,
			},
		],
		'no-console': 'off',
		'no-lonely-if': 'warn',
		'no-multi-spaces': [ 'warn', { ignoreEOLComments: true } ],
		'no-shadow': 'error',
		'no-unreachable': 'warn',
		'no-unused-vars': 'warn',
		'no-useless-return': 'warn',
		'no-trailing-spaces': 'warn',
		'object-curly-spacing': [ 'warn', 'always' ],
		'prefer-template': 'warn',
		'padded-blocks': [ 'warn', 'never' ],
		semi: [
			'warn',
			'never',
			{ beforeStatementContinuationChars: 'always' },
		],
		'semi-spacing': [ 'warn', { before: false, after: true } ],
		'space-before-blocks': 'warn',
		'spaced-comment': [ 'warn', 'always' ],
		'space-in-parens': [ 'warn', 'always' ],
		'space-infix-ops': [ 'warn' ],
		'space-unary-ops': [
			'warn',
			{
				words: true,
				nonwords: false,
				overrides: {
					'!': true,
					'!!': true,
				},
			},
		],
		'switch-colon-spacing': [ 'warn' ],
		'template-curly-spacing': [ 'warn', 'always' ],
		'template-tag-spacing': [ 'warn', 'always' ],
		// ==========
		'no-case-declarations': 'off',
		'no-multiple-empty-lines': [ 'warn', { max: 1 } ],
		quotes: [
			'warn',
			'single',
			{ avoidEscape: true, allowTemplateLiterals: true },
		],

		// === React ===
		'react/jsx-curly-spacing': 'warn',
		'react/jsx-indent': 'warn',
		'react/jsx-indent-props': 'warn',

		// === JSDOC ===
		// @see https://github.com/gajus/eslint-plugin-jsdoc
		// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/eslint-plugin/configs/jsdoc.js
		'jsdoc/check-line-alignment': [
			'error',
			'never',
			{
				tags: [ 'param', 'arg', 'argument', 'property', 'prop' ],
				preserveMainDescriptionPostDelimiter: false,
			},
		],
		'jsdoc/check-tag-names': [
			'error',
			{ definedTags: [ 'todo', 'internal' ] },
		],
		'jsdoc/no-undefined-types': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/require-param-name': 'off',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-property': 'off',
		'jsdoc/require-property-description': 'off',
		'jsdoc/require-property-name': 'off',
		'jsdoc/require-property-type': 'off',
		'jsdoc/require-returns-check': 'off',
		'jsdoc/require-returns-description': 'off',
		'jsdoc/require-returns-type': 'off',
	},
	settings: {
		// 'import/resolver': {},
		jsdoc: {
			mode: 'typescript',
		},
	},
}
