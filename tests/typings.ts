/* eslint-disable  */

import optimal, {
  array,
  bool,
  func,
  number,
  string,
  shape,
  object,
  instance,
  custom,
  union,
  ObjectOf,
} from '../src/index';

class Foo {}

const options = optimal(
  {},
  {
    a: array(),
    aa: array(array(string())),
    ac: array(string()),
    an: array(number().nullable()).nullable(),
    b: bool(),
    bn: bool().nullable(),
    c: custom(() => {}, ''),
    f: func(),
    i: instance(),
    ic: instance(Foo),
    ir: instance(Foo).required(),
    n: number(),
    nn: number().nullable(),
    nl: number().oneOf([1, 2, 3]),
    o: object(),
    oo: object(object(number())),
    oc: object(number()),
    on: object(number().nullable()).nullable(),
    s: string(),
    sn: string().nullable(),
    sl: string().oneOf(['foo', 'bar', 'baz']),
  },
);

const shapes = optimal(
  {},
  {
    h: shape({
      h1: string(),
      h2: bool(),
      h3: func(),
    }).nullable(),
    hn: shape({
      h1: string(),
      h2: shape({
        a: number(),
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
