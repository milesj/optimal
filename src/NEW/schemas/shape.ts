import { commonCriteria, shapeCriteria } from '../criteria';
import createSchema from '../createSchema';
import { createObject, invariant, isObject } from '../helpers';
import { Blueprint, CommonCriterias, Schema, InferNullable } from '../types';

export interface ShapeSchema<T> extends Schema<T>, CommonCriterias<ShapeSchema<T>> {
  never: () => ShapeSchema<never>;
  notNullable: () => ShapeSchema<NonNullable<T>>;
  nullable: () => ShapeSchema<T | null>;
  of: <S extends object>(schema: Blueprint<S>) => ShapeSchema<InferNullable<T, S>>;
}

function validateType(value: unknown, path: string) {
  invariant(isObject(value), 'Must be a shaped object.', path);
}

export function shape<T extends object>(blueprint: Blueprint<T>, defaultValue?: T): ShapeSchema<T> {
  return createSchema<T>({
    cast: createObject,
    criteria: { ...commonCriteria, ...shapeCriteria },
    defaultValue,
    type: 'shape',
    validateType,
  }).of(blueprint);
}
