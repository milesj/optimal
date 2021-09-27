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

// CRITERIA

export interface Options {
	message?: string;
}

export interface InclusiveOptions extends Options {
	inclusive?: boolean;
}

export type CriteriaValidator<Input> = (
	value: Input,
	path: string,
	options: SchemaValidateOptions,
) => unknown;

export interface Criteria<Input> {
	skipIfNull?: boolean;
	skipIfOptional?: boolean;
	validate: CriteriaValidator<Input>;
}

export type CriteriaFactory<Input> = (
	state: SchemaState<Input>,
	...args: any[]
) => Criteria<Input> | void;

export interface CommonCriterias<S> {
	and: (...keys: string[]) => S;
	custom: (callback: CriteriaValidator<InferSchemaType<S>>) => S;
	defined: () => S;
	deprecate: (message: string) => S;
	notDefined: () => S;
	only: () => S;
	or: (...keys: string[]) => S;
	when: (condition: WhenCondition<InferSchemaType<S>>, pass: AnySchema, fail?: AnySchema) => S;
	xor: (...keys: string[]) => S;
	// Define in schemas directly
	// never: () => S;
	// notNullable: () => S;
	// nullable: () => S;
}

export interface ArrayCriterias<S> {
	notEmpty: (options?: Options) => S;
	sizeOf: (size: number, options?: Options) => S;
	// Define in schema directly
	// of: <V>(schema: Schema<V>) => S;
}

export interface DateCriterias<S> {
	after: (date: MaybeDate, options?: Options) => S;
	before: (date: MaybeDate, options?: Options) => S;
	between: (start: MaybeDate, end: MaybeDate, options?: InclusiveOptions) => S;
}

export interface NumberCriterias<S> {
	between: (min: number, max: number, options?: InclusiveOptions) => S;
	float: (options?: Options) => S;
	gt: (min: number, options?: InclusiveOptions) => S;
	gte: (min: number, options?: Options) => S;
	int: (options?: Options) => S;
	lt: (max: number, options?: InclusiveOptions) => S;
	lte: (max: number, options?: Options) => S;
	negative: (options?: Options) => S;
	positive: (options?: Options) => S;
	// Define in schema directly
	// oneOf: <I extends number>(list: I[]) => S;
}

export interface ObjectCriterias<S> {
	notEmpty: (options?: Options) => S;
	sizeOf: (size: number, options?: Options) => S;
	// Define in schema directly
	// of: <V>(schema: Schema<V>) => S;
}

export interface ShapeCriterias<S> {
	exact: (state?: boolean) => S;
}

export interface StringCriterias<S> {
	camelCase: (options?: Options) => S;
	contains: (token: string, options?: Options & { index?: number }) => S;
	kebabCase: (options?: Options) => S;
	lowerCase: (options?: Options) => S;
	match: (pattern: RegExp, options?: Options) => S;
	notEmpty: (options?: Options) => S;
	pascalCase: (options?: Options) => S;
	sizeOf: (size: number, options?: Options) => S;
	snakeCase: (options?: Options) => S;
	upperCase: (options?: Options) => S;
	// Define in schema directly
	// oneOf: <I extends string>(list: I[]) => S;
}

// SCHEMAS

export interface SchemaValidateOptions {
	collectErrors?: boolean;
	currentObject?: UnknownObject;
	rootObject?: UnknownObject;
}

export interface Schema<Output> {
	schema: () => string;
	type: () => string;
	validate: (value: unknown, path?: string, options?: SchemaValidateOptions) => Output;
}

export interface SchemaState<T> {
	defaultValue: DefaultValue<T> | undefined;
	defined: boolean;
	metadata: UnknownObject;
	never: boolean;
	nullable: boolean;
	optional: boolean;
	type: string;
}

export interface SchemaOptions<T> {
	api: Record<string, CriteriaFactory<T>>;
	cast?: (value: unknown) => T;
	defaultValue?: DefaultValue<T>;
	type: string;
}

export type InferSchemaType<T> = T extends Schema<infer U> ? U : never;

export type Blueprint<T extends object> = { [K in keyof T]-?: Schema<T[K]> };

export type Predicate<T> = (value: T | null | undefined) => boolean;

// INFER

export type InferFromObject<T> = { [K in keyof T]: Infer<T[K]> };

export type Infer<T> = T extends Schema<infer U>
	? U
	: T extends Record<string, AnySchema>
	? InferFromObject<T>
	: T extends AnySchema[]
	? InferFromObject<T>
	: never;

export type DeepPartial<T> = T extends Builtin | Primitive
	? T
	: T extends (infer I)[]
	? DeepPartial<I>[]
	: T extends object
	? { [K in keyof T]?: DeepPartial<T[K]> }
	: T;

export type NotNull<T> = T extends null ? never : T;

export type NotUndefined<T> = T extends undefined ? never : T;

// Any is required for generics to be typed correctly for consumers
/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnySchema = Schema<any>;

export type AnyFunction = (...args: any[]) => any;
