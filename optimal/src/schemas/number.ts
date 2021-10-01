import { createSchema } from '../createSchema';
import { commonCriteria, numberCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import {
	CommonCriterias,
	DefaultValue,
	InferNullable,
	NotNull,
	NotUndefined,
	NumberCriterias,
	Options,
	Schema,
} from '../types';

export interface NumberSchema<T = number>
	extends Schema<T>,
		NumberCriterias<NumberSchema<T>>,
		CommonCriterias<NumberSchema<T>> {
	never: () => NumberSchema<never>;
	notNullable: () => NumberSchema<NotNull<T>>;
	notUndefinable: () => NumberSchema<NotUndefined<T>>;
	nullable: () => NumberSchema<T | null>;
	oneOf: <I extends number = number>(
		list: I[],
		options?: Options,
	) => NumberSchema<InferNullable<T, I>>;
	undefinable: () => NumberSchema<T | undefined>;
}

function cast(value: unknown): number {
	return value === undefined ? 0 : Number(value);
}

export function number<T extends number>(defaultValue: DefaultValue<number> = 0): NumberSchema<T> {
	return createSchema(
		{
			api: { ...commonCriteria, ...numberCriteria },
			cast,
			defaultValue,
			type: 'number',
		},
		[
			{
				validate(value, path) {
					invalid(
						typeof value === 'number',
						`Must be a number, received ${typeOf(value)}.`,
						path,
						value,
					);
				},
			},
		],
	);
}
