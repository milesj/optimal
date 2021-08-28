export type UnknownFunction = (...args: unknown[]) => unknown;

export type UnknownObject = Record<string, unknown>;

export type MaybeDate = Date | number | string;

export type Constructor<T> = (new (...args: unknown[]) => T) | (Function & { prototype: T });

export type InferNullable<P, N> = P extends null ? N | null : N;

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
	currentObject: UnknownObject,
	rootObject: UnknownObject,
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

export type CustomCallback<Input> = (
	value: Input,
	currentObject: UnknownObject,
	rootObject: UnknownObject,
) => void;

export interface CommonCriterias<S> {
	and: (...keys: string[]) => S;
	custom: (callback: CustomCallback<InferSchemaType<S>>) => S;
	deprecate: (message: string) => S;
	notRequired: () => S;
	only: () => S;
	or: (...keys: string[]) => S;
	required: () => S;
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

export interface BooleanCriterias<S> {
	onlyFalse: (options?: Options) => S;
	onlyTrue: (options?: Options) => S;
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
	exact: () => S;
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

export interface Schema<Output, Input = Output> {
	schema: () => string;
	type: () => string;
	validate: (
		value: Input | null | undefined,
		path?: string,
		currentObject?: UnknownObject,
		rootObject?: UnknownObject,
	) => Output;
}

export interface SchemaState<T> {
	defaultValue: T | undefined;
	metadata: UnknownObject;
	never: boolean;
	nullable: boolean;
	required: boolean;
	type: string;
}

export interface SchemaOptions<T> {
	cast?: (value: unknown) => T;
	criteria: Record<string, CriteriaFactory<T>>;
	defaultValue?: T;
	type: string;
	validateType?: CriteriaFactory<T>;
}

export type InferSchemaType<T> = T extends Schema<infer U> ? U : never;

export type Blueprint<T extends object> = { [K in keyof T]-?: Schema<T[K]> };

export type Predicate<T> = (value: T | null | undefined) => boolean;

// Any is required for generics to be typed correctly for consumers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySchema = Schema<any, any>;
