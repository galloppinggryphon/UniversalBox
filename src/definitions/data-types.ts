interface ButtonConfig {
	label?: string;
	title?: string;
	value: string;
	icon?: IconsSets;
	disabled?: boolean;
}

interface ButtonGroupButtonConfig extends ButtonConfig {
	description?: string;
}

interface BlockInfoPanelCell {
	name: string;
	title: string;
	className?: string;
	body: React.ReactNode;
	footer?: React.ReactNode;
	bgColour?: string;
	colour?: string;
	style?: React.CSSProperties | undefined;
	onClick?: () => void;
}

interface ColourThemePreset {
	name: string; //'Primary',
	category?: string;
	slug: string; //'primary',
	class: string; //'colour-theme-primary',
	color: string; //'var(--dd-colour-primary)'
}

interface HasBackground {
	any: boolean;
	theme: boolean;
	image: boolean;
	colour: boolean;
}

interface SpacingPreset {
	label: string;
	value: string;
}

interface TabPanelTab {
	label?: string;
	name: string;
	title: string;
	description?: string;
	className?: string;
	icon?: WP.Dashicon;
}

interface ScreenSize extends TabPanelTab {
	altTitle: string;
	maxWidth?: number;
	minWidth?: number;
}

interface WidthPreset {
	label: string;
	title: string;
	category: WidthPresetCategories;
	value: string;
	valuePx?: number;
	icon: IconsSets;
	help: string;
}
