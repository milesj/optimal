/* eslint-disable  */

import optimal, { array, bool, number, string, shape, object, instance } from '../src/index';

class Foo {}

const a = optimal({
  a: bool(),
  b: number(),
  c: string(),
  d: array(number()),
  e: array(),
  f: object(string()),
  g: object(),
  h: instance(Foo),
  i: instance(),
  j: shape({
    j1: string().nullable(),
    j2: number().nullable(),
  }),
});

// const b = optimal(
//   {},
//   {
//     foo: bool(),
//     bar: {
//       baz: string(),
//       qux: array(string()),
//     },
//   },
// );

// const b2 = optimal(
//   {},
//   {
//     foo: bool(),
//     bar: shape({
//       baz: string(),
//       qux: array(string()),
//     }),
//   },
// );
