# Universal Box - A Wordpress Block

![image](/doc-assets/ub-banner_sm.png)

- - -

<i>**This project was developed for private purposes initially, but is offered publicly as a proof-of-concept of how to create a modern, DRY Wordpress block using a shared component framework based on React hooks and function based components**</i>.

- - -

Universal Box is an advanced block for the WordPress block editor
(Gutenberg), with powerful controls to manipulate size, positioning and
look. It provides many features that Gutenberg still lacks or or is only
just getting, more than three years after its debut, including margin,
padding, width presets, background images, flex-box capabilities and
more. It can be used for everything from floating text boxes to entire
layouts, and many settings can be responsive to different screen sizes.
It can be configured (to some extent) to use the utility classes of
existing CSS frameworks like Bootstrap.

## Demonstration project 🧪

Universal Box came into being when Gutenberg was young because of personal needs for a more powerful layout block. Since then, Gutenberg has been catching up, but this block still offers options (like margins, padding and flex-box) that are *still* not offered by the vanilla editor. UB is part of a family of blocks called Blocky Blocks that also includes a slideshow block and 'post preview' block.

Version 3.0 of Universal Box represents an enormous effort to rebuild it from the ground up with modern design architecture based on React hooks and function-based components. I also wanted to create a framework with components, attributes and helper functions that could be utilized by multiple blocks. Although this project currently only contains a single block, it is based on a prototype for such a system. Additional blocks and some advanced features have not been ported yet.

## Features 🛵

* 🚩 Alignment (float)
* 🚩 Text alignment (align)
* 🚩 Width (with presets)
* 🚩 Margin and padding (with presets)
* 🚩 Colour themes (harmonic background and foreground colour)
* 🚩 Background colour
* 🚩 Background image
* 🚩 Responsive control -- control most options for different screen sizes
* 🚩 Custom per-block CSS
* 🚩 Foreground colour (TODO)
* 🚩 Advanced layouts using flex-box (TODO)

## Screenshots

![Preview of Universal Box blocks rendered on front-end](/doc-assets/block-preview-1.png)

![Hello wor](/doc-assets/ub-preview-large.png)

## Block attribute controls 🔧

### Block ID

Each block is given an auto-generated, unique class name. This name can be edited in case it's desirable that it is more human-readable. The block ID can be used to keep track of blocks, describe their role, or make them addressable by scripts. All class names are prefixed by `bb-block-`.

### Alignment - block and text

Hooks into Wordpress alignment system. Supports wide and full alignment, if enabled by the theme. Alignments utilize Wordpress class names: alignleft, alignright, etc.

### Margin and padding

Select margin preset or set custom margins in pixels. UB aims to support the use of utility classes from non-WP CSS frameworks, e.g. Bootstrap, Bulma and others. Currently only Bootstrap is supported.

### Width

Choose between configurable presets or set custom width in relative proportions or pixels. Supports responsive settings.

### Theme

Set up presets to configure the look and feel of blocks, e.g. with background and foreground colour.

**Preset configuration**

```
$settings['presets']['colourThemes'] = [
    [
        'name' => 'Blue and white', //REQUIRED
        'slug' => 'blue-white', //REQUIRED
        'category': 'Main colours', //OPTIONAL
        'className' => 'blue-white', //OPTIONAL
        'color' => 'blue'], //REQUIRED
    ]
];
```

**Categories**

Themes can be divided into categories or sets using the category key. This is optional.

**Auto class name generation with prefix**

Providing a class name is optional - instead, it can be generated automatically from the slug name and a prefix. E.g. `colour-theme-` + `blue-white` --> `colour-theme-blue-white`. If a class name is provided, it will be used, unprefixed.
<br>
```
$settings['themeClassPrefix'] = 'theme-';
```

### Background colour

Choose background colour preset or select a custom colour. Presets have to be configured with the WP function `add_theme_support`.
<br>
```
add_theme_support('editor-color-palette', [
    [
        'name' => 'Red',
        'slug' => 'red',
        'color' => 'red'
    ],
]);
```

**Dynamic colours with custom CSS properties**

Colours don't have to be hard-coded, they can be defined with CSS variables. E.g.: `'color' => 'var(--theme-colour--red)`. or `var(--wp-preset--colour-red)`.

It's important to use a consistent prexix and to register it in the plugin configuration.
<br>
```
$settings['cssColourVariablePrefix'] = 'colour-';
```

### Background image

Select an image to use as the background for the block. It is also possible to select an overlay colour, with configurable transparency.

### Custom classes and custom CSS

Add custom class names or CSS to both the outer and inner HTML element. Custom CSS also supports responsive settings.

## Navigation and inspection controls

### Attribute inspector

This control provides an overview of all the block's attributes. It is read-only.

### Select parent block

When creatind advanced layouts, it's often necessary to nest UB blocks. This control makes it easier to select the parent of the currently selected block. Though Wordpress already has this feature in the editor toolbar, this control makes the functionality more accessible. The goal is to create a control that can also show children of the current block.

## Pending block controls

Version 2 of Universal Box had several advanced controls that have not yet made its way into v3.

### Advanced layouts using flex box

This enables truly powerful layouts using UB. It's comparable to the built-in `columns` block, but far more powerful.

Features

* Flex mode: columns or rows
* Vertical and horizontal alignment (align-content/justify-content)
* Equalize vertical height
* Block wrapping
* Gutters
* Vertical and horizontal dividers
* Convert columns to rows on small screens
* Responsive control - all settings can be configured per screen

### Blocks inside a flex box

Blocks inside a flex box block behave according to the settings in its parents. In addition, two settings can be configured per-block. Both can be responsive.

**Block order:**

Force block to be rendered before or after adjacent blocks

**Block width:**

* Grow to fit (default): Expand proportionally to fit available horizontal space.
* Fit content exactly: Shrink to the size of the content.
* Flexible size: Set minimum and maximum size. The block will adjust automatically depending on adjacent blocks.
* Fixed size: Block will match an exact width and will never grow or shrink.

### Box type

Control what kind of HTML element is used for the outer element: `div`, `aside`, `figure` or `section`. Using different HTML elements conveys is [an important method of conveying semantic meaning](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics) for content, relied on by screen readers. Implementing this in an intuitive way for end-users of the WP block editor, however, is difficult. This implementation is only prototype and is not yet included in v3.

### Text options

Control font styles and colour of all text inside a block. It is in most cases better to apply settings directly to text blocks. CSS specificity rules may prevent block settings from being applied.

### Advanced block behaviour

This feature is not fully developed. The goal of this control is to provide blocks with more advanced, scriptable capabilities. Initially, the only option is to hide a block (prevent it from being rendered). Unfortunately, this also makes it hidden in the editor, and the only way to unhide it is through the code editor.

## Responsive settings

Many settings can be configured according to . The default is to apply settings to all screens.

Currently, only three break-points are supported.

| Size | Breakpoint |
| ---- | ---------- |
| large | \>= 1024px |
| medium | < 1024px && >= 768px |
| small | < 768px |

Break-point values can be modified -- this sets the *minimum* width of each, in pixels:
<br>
```
$settings['cssColourVariablePrefix'] = [
    'large' => 1024,
    'medium' => 768,
    'small' => 0,
];
```

## Architecture 🏢

To provide advanced features, Universal Box is composed of two HTML elements, one wrapped inside the other. In effect, settings that modify a UB’s relationship to other blocks are applied to the outer element, while settings that modify its children or its appearance are applied to the inner block.

**Outer block:**

Controls external positioning vis-a-vis adjacent elements. Specifically, margin, alignment and width.

**Inner block:**

Controls the visible portions of the block, internal behaviour/layouts and styling, including margins, padding and background

### Important implications

1. Combining margins with alignment (specifically centre, wide and full alignment). Block margins are applied to the inner block in order not to interfere with the behaviour of the box vis-a-vis other elements. Some alignment options (e.g. centre) uses left and right margins.
2. No collapsing margins. Margins and padding are fixed and entirely predictable by front-end users without a degree in CSS-ology.
3. Background options like colour and image are applied to the inner block.
4. Flex-box options are applied to both the inner and outer box. Flexbox container options are applied to the inner box, e.g. display: flex, flex-direction, flex-wrap, etc. Options that affect flexbox children (boxes inside flexbox containers) are applied to the outer box, e.g. order, flex-grow, align-self (these three are not currently enabled).
5. Flexbox children can have even gutters/gaps between them and remain evenly aligned with outer (left, right, top, bottom) container edges.
6. Flexbox children can also have dividers.

## Applying styles

Ideally, block styling is done with classes, but sometimes, custom settings are required. These are translated into CSS, which has to be delivered on the front-end. I've experimented with a few options of including that CSS. Inline styling is not workable since the block needs to control CSS options like media queries. Scoped CSS would be ideal, but has no native support. I also tried using the 'meta' attribute option (now deprecated, fortunately!) to save the CSS, along with PHP code to serve the CSS on the front-end, but this became horribly convoluted and complex.

The current solution adds a `script` tag with CSS encoded as `application/json` inside the HTML output. A global script is run in the footer, scans the page for these script tags, and applies the styling. This script is included only when content with Universal Box is detected.

In the future, I may include the script as an immediately invoked function with each block.

## Installation 💾

This project is currently intended as a demonstration of a Wordpress custom block framework. However, it can be installed. It is based on the official create-block NPM package, so it can be compiled with `npm start` or `npm run build`. Wordpress version v5.9 or higher is required.

To make the block work with a theme, it is necessary to include some CSS and to provide configuration options in `functions.php`.

### Configuration 🧰

In `functions.php`, add the following template:
<br>
```
add_filter('blocky_blocks_plugin_settings', function ($settings)
{
  //$settings[...] = ...
  return $settings;
});
```

**Supported settings:**
<br>
```
cssColourVariablePrefix
themeClassPrefix
presets:
    colourThemes
UniversalBox:
    extraClassNames
```

For details on each, see sections above on block attribute controls.

**UniversalBox configuration**

Configure *additional* class names that are applied to both the inner and outer HTML element:
<br>
```
$settings['UniversalBox'] = [
    'outer' => ['box'],
    'inner' => ['box-inner']
];
```

UB will always apply the classes `bb-box` and `bb-box-inner`.

### Theme support

Some features require explicit theme support with the WP function `add_theme_support`:

* align-wide
* editor-color-palette

To learn more about either option, see [](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-support/).

### Theme features (add\_theme\_supports)

For the best experience, two settings need to be enabled and/or configured in `functions.php` using `add_theme_supports()`: `align-wide` and `editor-color-palette`. Note that neither are necessary to use this plugin. Both options require explicit support by the theme -- it's not enough to enable these if the theme does not have the underlying capability.

add\_theme\_supports() needs to be invoked in `functions.php`:
<br>
```
function theme_setup() {
	//add_theme_support(...);
}
add_action('after_setup_theme', 'theme_setup');
```
<br>
To learn more about either option, see [https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-support/](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-support/).

## Planned features 🧩

New features or to be ported from version 2.0:

* [ ] Tag name control
* [ ] Re-implement flex-box support with better UI and more options (e.g. order)
* [ ] Better responsive control UI and more options
* [ ] Borders
* [ ] Height (partial control exists with flex-box)
* [ ] Presets or block patterns (maybe)
* [ ] Text size and colour
* [ ] Front-end component behaviour (e.g. box hiding)

# License

Author: Bjornar Egede-Nissen

License: MIT ([License terms](/LICENSE))
