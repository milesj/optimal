/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import optimal from './optimal';
import Predicate, { custom, func } from './Predicate';
import ArrayPredicate, { array } from './predicates/Array';
import BooleanPredicate, { bool } from './predicates/Boolean';
import InstancePredicate, { date, instance, predicate, regex } from './predicates/Instance';
import NumberPredicate, { number } from './predicates/Number';
import ObjectPredicate, { blueprint, object } from './predicates/Object';
import ShapePredicate, { shape } from './predicates/Shape';
import StringPredicate, { string } from './predicates/String';
import TuplePredicate, { tuple } from './predicates/Tuple';
import UnionPredicate, { union } from './predicates/Union';
import Schema from './Schema';

export const predicates = {
  array,
  blueprint,
  bool,
  custom,
  date,
  func,
  instance,
  number,
  object,
  predicate,
  regex,
  shape,
  string,
  tuple,
  union,
};

export {
  array,
  blueprint,
  bool,
  custom,
  date,
  func,
  instance,
  number,
  object,
  predicate,
  regex,
  shape,
  string,
  tuple,
  union,
};

export {
  ArrayPredicate,
  BooleanPredicate,
  InstancePredicate,
  NumberPredicate,
  ObjectPredicate,
  Predicate,
  Schema,
  ShapePredicate,
  StringPredicate,
  TuplePredicate,
  UnionPredicate,
};

export type Predicates = typeof predicates;

export * from './types';

export default optimal;
