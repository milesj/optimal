/* eslint-disable  */

import optimal, {
  array,
  bool,
  predicate,
  blueprint,
  func,
  number,
  string,
  shape,
  object,
  instance,
  custom,
  union,
  date,
  regex,
  ObjectOf,
  Blueprint,
} from '../src/index';

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
  sl: 'foo' | 'bar' | 'baz';
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
    sl: string().oneOf<'foo' | 'bar' | 'baz'>(['foo', 'bar', 'baz']),
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
    ic: instance(Foo),
    ir: instance(Foo).required(),
    in: instance(Foo).notNullable(),
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
    ic: instance(Foo),
    ir: instance(Foo).required(),
    in: instance(Foo).notNullable(),
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
    req: func()
      .required()
      .notNullable(),
    isNull: func().nullable(),
    notNull: func().notNullable(),
  },
);

const funcsInferred = optimal(
  {},
  {
    opt: func(),
    req: func()
      .required()
      .notNullable(),
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
    aa: array(array(string())),
    ac: array(string()),
    an: array(number().nullable()).nullable(),
    ad: array(number(), [1, 2, 3]),
  },
);

const arraysInferred = optimal(
  {},
  {
    a: array(),
    aa: array(array(string())),
    ac: array(string()),
    an: array(number().nullable()).nullable(),
    ad: array(number(), [1, 2, 3]),
  },
);

const objects: {
  o: object;
  oo: { [key: string]: { [key: string]: number } };
  oc: { [key: string]: number };
  on: { [key: string]: number | null } | null;
  od: { [key: string]: string };
} = optimal(
  {},
  {
    o: object(),
    oo: object(object(number())),
    oc: object(number()),
    on: object(number().nullable()).nullable(),
    od: object(string(), { foo: 'bar' }),
  },
);

const objectsInferred = optimal(
  {},
  {
    o: object(),
    oo: object(object(number())),
    oc: object(number()),
    on: object(number().nullable()).nullable(),
    od: object(string(), { foo: 'bar' }),
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
      h3: func(),
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

const unions: {
  a: string | boolean | number;
  an: string | boolean | number | null;
  ac: ObjectOf<string>[] | ObjectOf<Function> | { a: boolean; b: Foo | null } | null;
} = optimal(
  {},
  {
    a: union([string(), bool(), number()], ''),
    an: union([string(), bool(), number()], '').nullable(),
    ac: union(
      [
        array(object(string())),
        object(func()),
        shape({
          a: bool(),
          b: instance(Foo),
        }),
      ],
      null,
    ),
  },
);

const unionsInferred = optimal(
  {},
  {
    a: union<string | boolean | number>([string(), bool(), number()], ''),
    an: union<string | boolean | number>([string(), bool(), number()], '').nullable(),
    ac: union<ObjectOf<string>[] | ObjectOf<Function> | { a: boolean; b: Foo | null } | null>(
      [
        array(object(string())),
        object(func()),
        shape({
          a: bool(),
          b: instance(Foo),
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
    b: predicate(),
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
