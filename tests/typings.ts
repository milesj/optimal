/* eslint-disable  */

import optimal, {
  array,
  bool,
  builder,
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
    nl: number().oneOf([1, 2, 3]),
    nd: number(123),
    s: string(),
    sn: string().nullable(),
    sl: string().oneOf(['foo', 'bar', 'baz']),
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
    req: func().required(),
    isNull: func().nullable(),
    notNull: func(),
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

const shapes = optimal(
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
        c: string().oneOf(['foo']),
      }).nullable(),
      h3: func(),
    }),
  },
);

const unions = optimal(
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
    b: builder(),
  },
);
