/**
 * Get value of Type.
 */
type ValueOf<Type> = Type[keyof Type];

/**
 * Object type guard.
 */
type IsObject = (value: any) => value is object;

/**
 * Make all properties and nested properties optional, disable object literal constraints (e.g. imposed by interfaces).
 */
type PartialDeep<Obj> = {
	[Key in keyof Obj]?: PartialDeep<Obj[Key]>;
};

/**
 * Make all properties of object writeable.
 */
type Writable<Obj> = { -readonly [Keys in keyof Obj]: Obj[Keys] };

/**
 * Unwrap aliased types or types wrapped in other types, exposing their members directly.
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
type Unwrap<Source> = Source extends infer Parent
	? { [Key in keyof Parent]: Parent[Key] }
	: never;

// ! Not in use
// expands object types recursively
type UnwrapDeep<Type> = Type extends object
	? Type extends infer O
		? { [K in keyof O]: UnwrapDeep<O[K]> }
		: never
	: Type;

/**
 * Transform union type to intersection type.
 *
 * Source and explanation: @see https://github.com/microsoft/TypeScript/issues/29594
 */
type UnionToIntersection<Union> = (
	Union extends any ? (Key: Union) => void : never
) extends (Key: infer $Intersection) => void
	? $Intersection
	: never;


type Consumer<Value> = (value: Value) => void;

type IntersectionFromUnion<Union> =
    (Union extends unknown ? Consumer<Union> : never) extends (Consumer<infer ResultIntersection>)
    ? ResultIntersection
    : never;


/**
 * Filter missing types/arguments when passed on from another utility type. Returns never if required type argument is missing.
 */
type FilterMissingTypeArg<Val> = ValueOf<Val> extends never
	? never
	: Unwrap<Val>;

/**
 * Retrieve value from type object by key, or never if the key does not exist.
 */
type GetObjPropByKey<Obj, Key> = Key extends keyof Obj ? Obj[Key] : never;

/**
 * Access single member/property of a type object. Necessary since bracket notation doesn't work in JSDoc.
 */
type GetTypeProp<Type, Key extends keyof Type> = Type[Key];

/**
 * Filter members/properties of an interface/object by type. Returns filtered object.
 */
type FilterObjectPropsByType<
	Type,
	Filter,
	$Keys = {
		[Key in keyof Type]: Type[Key] extends Filter ? Key : never;
	}[keyof Type]
> = (
	$Keys extends keyof Type
		? {
				[Key in $Keys]: Type[Key];
		  }
		: never
) extends infer $Obj
	? UnionToIntersection<$Obj> extends infer $Result
		? unknown extends $Result
			? never
			: $Result
		: never
	: never;

/**
 * Return uncapitalized object keys as array
 */
type UncapitalizeObjectKeys<Obj> = {
	[Key in keyof Obj as Uncapitalize<
		Key extends string ? Key : never
	>]: Obj[Key];
};
