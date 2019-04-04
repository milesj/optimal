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

const primitives = optimal(
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

const other = optimal(
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

const arrays = optimal(
  {},
  {
    a: array(),
    aa: array(array(string())),
    ac: array(string()),
    an: array(number().nullable()).nullable(),
    ad: array(number(), [1, 2, 3]),
  },
);

const objects = optimal(
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
