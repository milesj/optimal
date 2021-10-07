import { id, NumberSchema } from '../../src';

describe('id()', () => {
	let schema: NumberSchema<number>;

	beforeEach(() => {
		schema = id();
	});

	it('errors if null is passed', () => {
		expect(() => {
			schema.validate(null);
		}).toThrow('Null is not allowed.');
	});

	it('errors if undefined is passed', () => {
		expect(() => {
			schema.validate(undefined);
		}).toThrow('Number must be positive, received 0.');
	});

	it('errors if a negative number is passed', () => {
		expect(() => {
			schema.validate(-1);
		}).toThrow('Number must be positive, received -1.');
	});

	it('errors if a float is passed', () => {
		expect(() => {
			schema.validate(1.2);
		}).toThrow('Number must be an integer, received 1.2.');
	});

	it('errors if zero is passed', () => {
		expect(() => {
			schema.validate(0);
		}).toThrow('Number must be positive, received 0.');
	});
});
