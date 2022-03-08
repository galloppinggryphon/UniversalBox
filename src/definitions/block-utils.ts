/**
 * Compose block framework by decorating base type.
 *
 * Decorators: {@link BlockExtensions}
 *
 * Block: {@link BlockFramework}
 *
 * Attributes: {@link GetAttributeProps}
 */
type ComposeBlockFramework<
	Decorators extends keyof BlockExtensions = any,
	Framework = {},
	$BlockExtensions = void extends Decorators
		? BlockExtensions["baseline"]
		: BlockExtensions["baseline" | Decorators]
> = Framework &
	BlockFrameworkBase &
	Partial<UnionToIntersection<$BlockExtensions>>;


/**
 * Universal shim for WP props.
 *
 * #Todo: Use built-in props type.
 *
 */
interface BlockProps {
	[key: string]: any;
	attributes: BlockAttributes.attributes;
	setAttributes(attributes: PlainObj): any;
}

/**
 * Object containing output or input for styling functions (css, class names).
 */
type BlockData<Type = string> = {
	[Key in BlockScope]: Type;
};

/**
 * Get block attribute and unwrap from root key.
 *
 * @example
 * BlockAttributes.colourTheme = { colourTheme: { ... } } => { ... }
 */
type GetAttribute<
	AttrName extends keyof BlockAttributes,
	$Attr = BlockAttributes[AttrName]
> = AttrName extends keyof $Attr ? $Attr[AttrName] : AttrName;

/**
 * Pick deeply nested values from a given {@link BlockAttributes} attribute. Returns correct typing when used in functions.
 *
 * Arguments: `<AttrObj, AttrKey, Screen = unknown>`
 */
type GetAttributeProps<
	AttrObj extends BlockAttributes.Root,
	AttrKey extends keyof AttrObj,
	Screen = unknown,
	$AttrV = FilterMissingTypeArg<AttrObj[AttrKey]>,
	$Screens = GetObjPropByKey<
		$AttrV,
		"responsiveProps"
	> extends infer $ScreenCollection
		? $ScreenCollection
		: never
> = void extends Screen
	? $AttrV
	: $Screens extends never
	? never
	: Unwrap<GetObjPropByKey<$Screens, 0>>;

type GetPropKeyIf<
	Type,
	Key
	// $Key = Key extends keyof Type ? FilterMissingTypeArg<Key> : never
> = IsSingleType<Key> extends true
	? Key extends keyof Type
		? Type[Key]
		: never
	: Type;

type IsSingleType<Type> = UnionToIntersection<Type> extends never
	? false
	: true;


/**
 * Decorator constructor function - return props to merge with {@link BlockFramework}.
 */
type DecoratorConstructor = (block: BlockFramework) => any;

/**
 * Extract return types from array of functions passed as arguments, return as intersection.
 */
type ExtractReturnTypes<Func extends readonly ((i: any) => any)[]> =
	UnionToIntersection<
		[
			...{
				[Keys in keyof Func]: Func[Keys] extends (i: any) => infer $Return
					? Unwrap<$Return>
					: never;
			}
		][number]
	>;

/**
 * Add extensions to block.
 *
 * Apply {@link DecoratorConstructor} to block, return new props.
 */
type BlockExtender<Decorators extends readonly DecoratorConstructor[]> =
	void extends ReturnType<Decorators[number]>
		? {}
		: ExtractReturnTypes<Decorators>;

/**
 * Retrieve type for a given {@link BlockExtensions}.
 */
type GetBlockExtensions<Extensions extends keyof BlockExtensions> =
	BlockExtensions[Extensions];

/**
 * Create key list of extensions that manipulate colour. List is retrieved from `keyof` {@link ColourExtensionsAttributeMap}, with validation against {@link BlockExtensions}.
 */
type ColourExtensionsList =
	keyof ColourExtensionsAttributeMap extends infer $Key
		? $Key extends keyof BlockExtensions
			? $Key
			: never
		: never;

/**
 * Return list of valid {@link BlockAttributes.ColourProps} keys in a given {@link BlockAttributes} attribute.
 */
type BlockAttributeColourProps<
	Attribute extends keyof BlockAttributes.attributes
> = FilterObjectPropsByType<
	GetTypeProp<BlockAttributes.attributes, Attribute>,
	BlockAttributes.ColourProps
>;

/**
 * Colour decorator factory function.
 */
type WithColour<ExtensionName extends ColourExtensionsList> = (
	block: BlockFramework
) => GetBlockExtensions<ExtensionName>;
