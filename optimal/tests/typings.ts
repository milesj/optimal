import {
	array,
	Blueprint,
	blueprint,
	bool,
	custom,
	date,
	func,
	instance,
	number,
	object,
	optimal,
	regex,
	schema,
	shape,
	string,
	union,
	UnknownFunction,
} from '../src';

type BasicBlueprint = Blueprint<{
	foo: string;
	bar: number | null;
}>;

type OptionalPropsBlueprint = Blueprint<{
	foo?: string;
	bar?: number | null;
}>;

type PartialPropsBlueprint = Blueprint<
	Partial<{
		foo: string;
		bar: number | null;
	}>
>;

type RequiredPropsBlueprint = Blueprint<
	Required<{
		foo?: string;
		bar?: number | null;
	}>
>;

class Foo {}

const primitives: {
	b: boolean;
	bn: boolean | null;
	bd: boolean;
	n: number;
	nn: number | null;
	nl: 1 | 2 | 3;
	nd: number;
	s: string;
	sn: string | null;
	sl: 'bar' | 'baz' | 'foo';
	sd: string;
} = optimal(
	{},
	{
		b: bool(),
		bn: bool().nullable(),
		bd: bool(true),
		n: number(),
		nn: number().nullable(),
		nl: number().oneOf([1, 2, 3]),
		nd: number(123),
		s: string(),
		sn: string().nullable(),
		sl: string().oneOf(['foo', 'bar', 'baz']),
		sd: string('foo'),
	},
);

const primitivesInferred = optimal(
	{},
	{
		b: bool(),
		bn: bool().nullable(),
		bd: bool(true),
		n: number(),
		nn: number().nullable(),
		nl: number().oneOf<1 | 2 | 3>([1, 2, 3]),
		nd: number(123),
		s: string(),
		sn: string().nullable(),
		sl: string().oneOf<'bar' | 'baz' | 'foo'>(['foo', 'bar', 'baz']),
		sd: string('foo'),
	},
);

const other: {
	c: string;
	f: (() => void) | null;
	i: Object | null;
	ic: Foo | null;
	ir: Foo | null;
	in: Foo;
	d: Date | null;
	r: RegExp | null;
} = optimal(
	{},
	{
		c: custom(() => {}, ''),
		f: func(),
		i: instance(),
		ic: instance().of(Foo),
		ir: instance().of(Foo).required(),
		in: instance().of(Foo).notNullable(),
		d: date(),
		r: regex(),
	},
);

const otherInferred = optimal(
	{},
	{
		c: custom(() => {}, ''),
		f: func(),
		i: instance(),
		ic: instance().of(Foo),
		ir: instance().of(Foo).required(),
		in: instance().of(Foo).notNullable(),
		d: date(),
		r: regex(),
	},
);

const funcs: {
	opt?: (() => void) | null;
	req: () => void;
	isNull: (() => void) | null;
	notNull: () => void;
} = optimal(
	{},
	{
		opt: func(),
		req: func().required().notNullable(),
		isNull: func().nullable(),
		notNull: func().notNullable(),
	},
);

const funcsInferred = optimal(
	{},
	{
		opt: func(),
		req: func().required().notNullable(),
		isNull: func().nullable(),
		notNull: func().notNullable(),
	},
);

const arrays: {
	a: unknown[];
	aa: string[][];
	ac: string[];
	an: (number | null)[] | null;
	ad: number[];
} = optimal(
	{},
	{
		a: array(),
		aa: array().of(array().of(string())),
		ac: array().of(string()),
		an: array().nullable().of(number().nullable()),
		ad: array([1, 2, 3]).of(number()),
	},
);

const arraysInferred = optimal(
	{},
	{
		a: array(),
		aa: array().of(array().of(string())),
		ac: array().of(string()),
		an: array().of(number().nullable()).nullable(),
		ad: array([1, 2, 3]).of(number()),
	},
);

const objects: {
	o: object;
	oo: Record<string, Record<string, number>>;
	oc: Record<string, number>;
	on: Record<string, number | null> | null;
	od: Record<string, string>;
} = optimal(
	{},
	{
		o: object(),
		oo: object().of(object().of(number())),
		oc: object().of(number()),
		on: object().of(number().nullable()).nullable(),
		od: object({ foo: 'bar' }).of(string()),
	},
);

const objectsInferred = optimal(
	{},
	{
		o: object(),
		oo: object().of(object(number())),
		oc: object().of(number()),
		on: object().of(number().nullable()).nullable(),
		od: object({ foo: 'bar' }).of(string()),
	},
);

const shapes: {
	h: {
		h1: string;
		h2: boolean;
		h3: (() => void) | null;
		h4: string;
	} | null;
	hn: {
		h1: string;
		h2: {
			a: number;
			b: Function | null;
			c: 'foo';
		} | null;
		h3: (() => void) | null;
	};
} = optimal(
	{},
	{
		h: shape({
			h1: string(),
			h2: bool(),
			h3: func(),
			h4: string('foo'),
		}).nullable(),
		hn: shape({
			h1: string(),
			h2: shape({
				a: number(123),
				b: instance<Function>(),
				c: string().oneOf<'foo'>(['foo']),
			}).nullable(),
			h3: func<() => void>(),
		}),
	},
);

const shapesInferred = optimal(
	{},
	{
		h: shape({
			h1: string(),
			h2: bool(),
			h3: func(),
			h4: string('foo'),
		}).nullable(),
		hn: shape({
			h1: string(),
			h2: shape({
				a: number(123),
				b: instance(),
				c: string().oneOf<'foo'>(['foo']),
			}).nullable(),
			h3: func(),
		}),
	},
);

type UnionType = boolean | number | string;
type ComplexUnionType =
	| Record<string, string>[]
	| Record<string, UnknownFunction>
	| { a: boolean; b: Foo | null };

const unions: {
	a: UnionType;
	an: UnionType | null;
	ac: ComplexUnionType | null;
} = optimal(
	{},
	{
		a: union<UnionType>([string(), bool(), number()], ''),
		an: union<UnionType | null>([string(), bool(), number()], '').nullable(),
		ac: union<ComplexUnionType | null>(
			[
				array().of(object().of(string())),
				object().of(func()),
				shape({
					a: bool(),
					b: instance().of(Foo),
				}),
			],
			null,
		),
	},
);

const unionsInferred = optimal(
	{},
	{
		a: union<UnionType>([string(), bool(), number()], ''),
		an: union<UnionType>([string(), bool(), number()], '').nullable(),
		ac: union<ComplexUnionType | null>(
			[
				array().of(object().of(string())),
				object().of(func()),
				shape({
					a: bool(),
					b: instance().of(Foo),
				}),
			],
			null,
		),
	},
);

const bp = optimal(
	{
		a: {
			str: string(),
		},
		b: number(),
	},
	{
		a: blueprint(),
		b: schema(),
	},
);

interface MaybeNeverProperty<T> {
	foo: string;
	bar: T extends number ? number : never;
	baz: boolean;
}

type NonNeverBlueprint = Blueprint<MaybeNeverProperty<number>>;
type NeverBlueprint = Blueprint<MaybeNeverProperty<string>>;

const nonNever: MaybeNeverProperty<number> = optimal(
	{},
	{
		foo: string(),
		bar: number(),
		baz: bool(),
	},
);

const nonNeverInferred = optimal(
	{},
	{
		foo: string(),
		bar: number(),
		baz: bool(),
	},
);

const never: MaybeNeverProperty<string> = optimal(
	{},
	{
		foo: string(),
		bar: number().never(),
		baz: bool(),
	},
);

const neverInferred = optimal(
	{},
	{
		foo: string(),
		bar: number().never(),
		baz: bool(),
	},
);

type Keys = 'bar' | 'baz' | 'foo';
type MappedObj<T extends string = Keys> = { [K in T]: string };
type MappedObjBlueprint = Blueprint<MappedObj>;

interface Mapped {
	object: MappedObj;
}

const mapped: Mapped = optimal(
	{},
	{
		object: object().of(string()),
	},
);

const mappedInferred = optimal(
	{},
	{
		object: object<string, Keys>().of(string()),
	},
);