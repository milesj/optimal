import {
	AnyFunction,
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
} from '../src';

type BasicBlueprint = Blueprint<{
	foo: string;
	bar: number | null;
}>;

type MixedOptionalRequiredBlueprint = Blueprint<{
	foo: string;
	bar?: number | null;
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
	sdu: string | undefined;
} = optimal({
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
	sdu: string('foo').undefinable(),
}).validate({});

const primitivesInferred = optimal({
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
	sdu: string('foo').undefinable(),
}).validate({});

const other: {
	c: string;
	f: (() => void) | undefined;
	i: Object | null;
	ic: Foo | null;
	ir: Foo | undefined;
	in: Foo;
	d: Date | null;
	r: RegExp | null;
} = optimal({
	c: custom(() => {}, ''),
	f: func(),
	i: instance(),
	ic: instance().of(Foo),
	ir: instance().of(Foo).notNullable().undefinable(),
	in: instance().of(Foo).notNullable(),
	d: date(),
	r: regex(),
}).validate({});

const otherInferred = optimal({
	c: custom(() => {}, ''),
	f: func(),
	i: instance(),
	ic: instance().of(Foo),
	ir: instance().of(Foo).notNullable().undefinable(),
	in: instance().of(Foo).notNullable(),
	d: date(),
	r: regex(),
}).validate({});

const funcs: {
	opt?: (() => void) | undefined;
	req: () => void;
	isNull: (() => void) | null | undefined;
} = optimal({
	opt: func().undefinable(),
	req: func().notUndefinable(),
	isNull: func().nullable(),
}).validate({});

const funcsInferred = optimal({
	opt: func().undefinable(),
	req: func().notUndefinable(),
	isNull: func().nullable(),
}).validate({});

const arrays: {
	a: unknown[];
	aa: string[][];
	ac: string[];
	an: (number | null)[] | null;
	au: (number | undefined)[];
	ad: number[];
} = optimal({
	a: array(),
	aa: array().of(array().of(string())),
	ac: array().of(string()),
	an: array().nullable().of(number().nullable()),
	au: array().of(number().undefinable()),
	ad: array([1, 2, 3]).of(number()),
}).validate({});

const arraysInferred = optimal({
	a: array(),
	aa: array().of(array().of(string())),
	ac: array().of(string()),
	an: array().of(number().nullable()).nullable(),
	au: array().of(number().undefinable()),
	ad: array([1, 2, 3]).of(number()),
}).validate({});

const objects: {
	o: object;
	oo: Record<string, Record<string, number>>;
	oc: Record<string, number>;
	on: Record<string, number | null> | null;
	od: Record<string, string>;
	ou: Record<string, string | undefined>;
} = optimal({
	o: object(),
	oo: object().of(object().of(number())),
	oc: object().of(number()),
	on: object().of(number().nullable()).nullable(),
	od: object({ foo: 'bar' }).of(string()),
	ou: object().of(string().undefinable()),
}).validate({});

const objectsInferred = optimal({
	o: object(),
	oo: object().of(object().of(number())),
	oc: object().of(number()),
	on: object().of(number().nullable()).nullable(),
	od: object({ foo: 'bar' }).of(string()),
	ou: object().of(string().undefinable()),
}).validate({});

const shapes: {
	h: {
		h1: string;
		h2: boolean;
		h3: (() => void) | undefined;
		h4: string;
	} | null;
	hn: {
		h1: string;
		h2:
			| {
					a: number;
					b: Object | null;
					c: 'foo';
			  }
			| undefined;
		h3: (() => void) | undefined;
	};
} = optimal({
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
		}).undefinable(),
		h3: func<() => void>(),
	}),
}).validate({});

const shapesInferred = optimal({
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
		}).undefinable(),
		h3: func(),
	}),
}).validate({});

type UnionType = boolean | number | string;

type ComplexUnionType =
	| Record<string, AnyFunction>
	| Record<string, string>[]
	| { a: boolean; b: Foo | null };

const unions: {
	a: UnionType;
	an: UnionType | null;
	ac: ComplexUnionType | null;
} = optimal({
	a: union<UnionType>('').of([string(), bool(), number()]),
	an: union<UnionType | null>('').of([string(), bool(), number()]).nullable(),
	ac: union<ComplexUnionType | null>(null)
		.of([
			array().of(object().of(string())),
			object().of(func()),
			shape({
				a: bool(),
				b: instance().of(Foo),
			}),
		])
		.nullable(),
}).validate({});

const unionsInferred = optimal({
	a: union<UnionType>('').of([string(), bool(), number()]),
	an: union<UnionType>('').of([string(), bool(), number()]).nullable(),
	ac: union<ComplexUnionType | null>(null)
		.of([
			array().of(object().of(string())),
			object().of(func()),
			shape({
				a: bool(),
				b: instance().of(Foo),
			}),
		])
		.nullable(),
}).validate({});

const bp = optimal({
	a: blueprint(),
	b: schema(),
}).validate({
	a: {
		str: string(),
	},
	b: number(),
});

interface MaybeNeverProperty<T> {
	foo: string;
	bar: T extends number ? number : never;
	baz: boolean;
}

type NonNeverBlueprint = Blueprint<MaybeNeverProperty<number>>;
type NeverBlueprint = Blueprint<MaybeNeverProperty<string>>;

const nonNever: MaybeNeverProperty<number> = optimal({
	foo: string(),
	bar: number(),
	baz: bool(),
}).validate({});

const nonNeverInferred = optimal({
	foo: string(),
	bar: number(),
	baz: bool(),
}).validate({});

const never: MaybeNeverProperty<string> = optimal({
	foo: string(),
	bar: number().never(),
	baz: bool(),
}).validate({});

const neverInferred = optimal({
	foo: string(),
	bar: number().never(),
	baz: bool(),
}).validate({});

type Keys = 'bar' | 'baz' | 'foo';
type MappedObj<T extends string = Keys> = { [K in T]: string };
type MappedObjBlueprint = Blueprint<MappedObj>;

interface Mapped {
	object: MappedObj;
}

const mappedInferred = optimal({
	object: object<string, Keys>().of(string()),
}).validate({});
