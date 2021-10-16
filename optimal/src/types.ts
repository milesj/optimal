export type Primitive = bigint | boolean | number | string | symbol | null | undefined;

export type Builtin = Date | Error | Function | RegExp;

export type UnknownObject = Record<string, unknown>;

export type MaybeDate = Date | number | string;

export type Constructor<T> = (abstract new (...args: any[]) => T) | (new (...args: any[]) => T);

export type InferNullable<P, N> = P extends null ? N | null : N;

export type DefaultValueInitializer<T> = (
	path: string,
	currentObject: UnknownObject,
	rootObject: UnknownObject,
) => T;

export type DefaultValue<T> = DefaultValueInitializer<T> | T;

export type ValueComparator<T> = (
	value: T,
	currentObject?: UnknownObject,
	rootObject?: UnknownObject,
) => boolean;

export type WhenCondition<T> = T | ValueComparator<T>;

export type Transformer<T> = (value: T) => T;

// CRITERIA OPTIONS

export interface Options {
	/** Custom message when the field and criteria is invalid. */
	message?: string;
}

export interface InstanceOfOptions extends Options {
	loose?: boolean;
}

export interface InclusiveOptions extends Options {
	/** Mark this criteria as inclusive (typical includes bounding edges). */
	inclusive?: boolean;
}

export interface StringContainsOptions extends Options {
	index?: number;
}

// CRITERIA

export type CriteriaValidator<Input> = (
	value: Input,
	path: string,
	options: SchemaValidateOptions,
) => unknown;

export interface Criteria<Input> {
	dontSkipIfNull?: boolean;
	dontSkipIfUndefined?: boolean;
	validate: CriteriaValidator<Input>;
}

export type CriteriaFactory<Input> = (
	state: SchemaState<Input>,
	...args: any[]
) => Criteria<Input> | void;

export interface CommonCriterias<S> {
	/** Map a list of field names that must be defined alongside this field. */
	and: (keys: string[], options?: Options) => S;
	/** Set a callback to run custom validation logic. */
	custom: (callback: CriteriaValidator<InferSchemaType<S>>) => S;
	/** Set a message to log when this field is present. */
	deprecate: (message: string) => S;
	/** Mark that this field can ONLY use a value that matches the default value. */
	only: (options?: Options) => S;
	/** Require this field to NOT be explicitly defined. */
	optional: (options?: Options) => S;
	/** Map a list of field names that must have at least 1 defined. */
	or: (keys: string[], options?: Options) => S;
	/** Require this field to be explicitly defined. */
	required: (options?: Options) => S;
	/** Transform a value before it's passed to the next criteria. */
	transform: (transformer: Transformer<InferSchemaType<S>>) => S;
	/** Validate with another schema when a condition is met. */
	when: (condition: WhenCondition<InferSchemaType<S>>, pass: AnySchema, fail?: AnySchema) => S;
	/** Map a list of field names that must not be defined alongside this field. */
	xor: (keys: string[], options?: Options) => S;
	// Define in schemas directly
	// never: () => S;
	// notNullable: () => S;
	// nullable: () => S;
	// notUndefinable: () => S;
	// undefinable: () => S;
}

export interface ArrayCriterias<S> {
	/** Require field array to not be empty. */
	notEmpty: (options?: Options) => S;
	/** Require field array to be of a specific size. */
	sizeOf: (size: number, options?: Options) => S;
	// Define in schema directly
	// of: <V>(schema: Schema<V>) => S;
}

export interface DateCriterias<S> {
	/** Require field value to be after the provided date. */
	after: (date: MaybeDate, options?: Options) => S;
	/** Require field value to be before the provided date. */
	before: (date: MaybeDate, options?: Options) => S;
	/** Require field value to be between 2 date ranges. */
	between: (start: MaybeDate, end: MaybeDate, options?: InclusiveOptions) => S;
}

export interface NumberCriterias<S> {
	/** Require field value to be between 2 numbers. */
	between: (min: number, max: number, options?: InclusiveOptions) => S;
	/** Require field value to be a float (requires a decimal). */
	float: (options?: Options) => S;
	/** Require field value to be greater than a number. */
	gt: (min: number, options?: InclusiveOptions) => S;
	/** Require field value to be greater than or equals to a number. */
	gte: (min: number, options?: Options) => S;
	/** Require field value to be an integer. */
	int: (options?: Options) => S;
	/** Require field value to be less than a number. */
	lt: (max: number, options?: InclusiveOptions) => S;
	/** Require field value to be less than or equals to a number. */
	lte: (max: number, options?: Options) => S;
	/** Require field value to be negative and _not_ zero. */
	negative: (options?: Options) => S;
	/** Require field value to be positive and _not_ zero. */
	positive: (options?: Options) => S;
	// Define in schema directly
	// oneOf: <I extends number>(list: I[]) => S;
}

export interface ObjectCriterias<S> {
	/** Require field object keys to be of a string schema type. */
	keysOf: (schema: Schema<string>, options?: Options) => S;
	/** Require field object to not be empty. */
	notEmpty: (options?: Options) => S;
	/** Require field object to be of a specific size. */
	sizeOf: (size: number, options?: Options) => S;
	// Define in schema directly
	// of: <V>(schema: Schema<V>) => S;
}

export interface ShapeCriterias<S> {
	/** Require a shape to be an exact. No more and no less of the same properties. */
	exact: (state?: boolean) => S;
}

export interface StringCriterias<S> {
	/** Require field value to be formatted in camel case (fooBar). */
	camelCase: (options?: Options) => S;
	/** Require field value to contain a provided string. */
	contains: (token: string, options?: StringContainsOptions) => S;
	/** Require field value to be formatted in kebab case (foo-bar). */
	kebabCase: (options?: Options) => S;
	/** Require field value to be of a specific string length. */
	lengthOf: (size: number, options?: Options) => S;
	/** Require field value to be all lower case. */
	lowerCase: (options?: Options) => S;
	/** Require field value to match a defined regex pattern. */
	match: (pattern: RegExp, options?: Options) => S;
	/** Require field value to not be an empty string. */
	notEmpty: (options?: Options) => S;
	/** Require field value to be formatted in pascal case (FooBar). */
	pascalCase: (options?: Options) => S;
	/** Require field value to be formatted in snake case (foo_bar). */
	snakeCase: (options?: Options) => S;
	/** Require field value to be all upper case. */
	upperCase: (options?: Options) => S;
	// Define in schema directly
	// oneOf: <I extends string>(list: I[]) => S;
}

// SCHEMAS

export interface SchemaValidateOptions<
	RO extends object = UnknownObject,
	CO extends object = UnknownObject,
> {
	/** The current object for the depth being validated. */
	currentObject?: CO;
	/** The root/original object, regardless of validation depth. */
	rootObject?: RO;
}

export interface Schema<Output> {
	/** The type of schema. */
	schema: () => string;
	/** The internal state object. Contains useful metadata. */
	state: () => SchemaState<Output>;
	/** The type of schema and it's children (when applicable). */
	type: () => string;
	/**
	 * Run all validation checks that have been enqueued and return a type casted value.
	 * If a value is undefined, inherit the default value, otherwise throw if required.
	 * If nullable and the value is null, return early.
	 */
	validate: (value: unknown, path?: string, options?: SchemaValidateOptions) => Output;
}

export interface SchemaState<T> {
	defaultValue: DefaultValue<T> | undefined;
	metadata: UnknownObject;
	never: boolean;
	nullable: boolean;
	required: boolean;
	type: string;
	undefinable: boolean;
}

export interface SchemaOptions<T> {
	/** A mapping of criteria to factories, to provide chainable validations. */
	api: Record<string, CriteriaFactory<T>>;
	/** Function to cast the value when all validations pass. */
	cast?: (value: unknown) => T;
	/** Default value to return when an undefined value is validated. */
	defaultValue?: DefaultValue<T>;
	/** Type of schema. */
	type: string;
}

export type InferSchemaType<T> = T extends Schema<infer U> ? U : never;

export type Blueprint<T extends object> = { [K in keyof T]-?: Schema<T[K]> };

export type Predicate<T> = (value: T | null | undefined) => boolean;

// OPTIMAL

export interface OptimalOptions {
	/** Include a filename in validation error messages. Can be used in conjunction with
  `name`. */
	file?: string;
	/** Include a unique identifier in validation error messages. Can be used in conjunction
  with `file`. */
	name?: string;
	/** @internal */
	prefix?: string;
	/** Allow unknown fields to be passed within the object being validated. Otherwise, an error will
  be thrown. */
	unknown?: boolean;
}

// INFER

export type InferFromObject<T> = { [K in keyof T]: Infer<T[K]> };

/** Infer the underlying type from a schema. */
export type Infer<T> = T extends Schema<infer U>
	? U
	: T extends Record<string, AnySchema>
	? InferFromObject<T>
	: T extends AnySchema[]
	? InferFromObject<T>
	: never;

export type DeepPartial<T> = T extends Builtin | Primitive | unknown[]
	? T
	: T extends object
	? { [K in keyof T]?: DeepPartial<T[K]> }
	: T;

export type NotNull<T> = T extends null ? never : T;

export type NotUndefined<T> = T extends undefined ? never : T;

// Any is required for generics to be typed correctly for consumers
/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnySchema = Schema<any>;

export type AnyFunction = (...args: any[]) => any;
