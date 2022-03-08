/**
 * Baseline block framework.
 */
interface BlockFrameworkBase {
	/**
	 * All the block's attributes and all the block's men.
	 */
	attributes: {}; //BlockAttributes.Root;

	/**
	 * Track attribute changes. attributeChangeSignal is increased when there is a mismatch between current and previous attributes.
	 *
	 * Useful in dependency arrays, e.g. useEffect(() => {}, [attributeChangeSignal])
	 */
	attributeChangeSignal(): number;
	attributeChangeSignalX?: number;
	props: BlockProps; // { clientId: string; isSelected: boolean };
	settings: BlockConfig;
	blockId: React.MutableRefObject<string>;
	isMounting: boolean;
	hasBackground: boolean;
	css: BlockData;
	classNames: BlockData<string[]>;

	/**
	 * Related blocks
	 */
	related: {
		parent: WP.BlockInstance
		selectParent(): void
	},

	/**
	 * Provide props for block component wrapper.
	 *
	 * Invokes built-in useBlockProps.
	 *
	 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
	 */
	useBlockProps(): PlainObj;

	/**
	 * Provide markup for inner block.
	 *
	 * Invokes built-in useInnerBlockProps.
	 */
	useInnerBlockProps(): PlainObj;

	/**
	 * Change block ID.
	 *
	 * @param blockId
	 */
	setBlockId(blockId: string): void;

	/**
	 * Wrapper for props.setAttributes().
	 *
	 * Changes are merged with existing properties.
	 *
	 * Attribute values of undefined or null are deleted.
	 */
	setAttr(newAttributes?: PlainObj): void;

	/**
	 * Set attribute props.
	 *
	 * @param attrName - Name of the attribute to work on.
	 * @param newProps - Props to write to the attribute
	 * @param screen - Set props for a particular screen
	 * @param options
	 * @param options.overwrite - [true] Overwrite existing props
	 * @param options.removeEmpty - [true] Delete empty strings
	 * @param options.updateLinked - [true] Look for other attributes that have to change as a consequence of this update
	 */
	setProps<
		AttrName extends keyof BlockAttributes.attributes, // & ExtraBlockAttributtes,
		Screen extends string = never
	>(
		attrName: AttrName,
		newProps: PlainObj|string|number|boolean, //array not supported currently
		screen?: Screen,
		options?: {
			defer?: boolean;
			overwrite?: boolean;
			removeEmpty?: boolean;
			updateLinked?: boolean;
		}
	): void;

	/**
	 * Compile block CSS for the front-end.
	 */
	generateFrontendCss(): BlockData;

	/**
	 * Extend the block framework with decorators (functions).
	 *
	 * @param decorators List of callback factory functions that create decorators. Each callback must return an object literal with new functionality. This object is merged into `block`.
	 */
	extend<Decorators extends readonly DecoratorConstructor[]>(...decorators: Decorators): void
}

/**
 * Type for root block - adds `baseline` attributes.
 */
type BlockFramework = ComposeBlockFramework;
