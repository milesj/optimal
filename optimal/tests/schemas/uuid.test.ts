/* eslint-disable jest/require-to-throw-message */

import { StringSchema, uuid } from '../../src';

describe('uuid()', () => {
	const v1 = '857b7826-a777-11e5-bf7f-feff819cdc9f';
	const v2 = '019f5500-f8c2-2c89-8a55-fb30cb9fcc4f';
	const v3 = 'e023d5bd-5c1b-3b47-8646-cacb8b8e3634';
	const v4 = '70e197fc-202f-4679-bf1a-3700ee99a716';
	const v5 = '5b14f23a-165c-52c8-9613-2e8c93bb9cd4';
	const nil = '00000000-0000-0000-0000-000000000000';

	let schema: StringSchema<string>;

	beforeEach(() => {
		schema = uuid();
	});

	it('errors if null is passed', () => {
		expect(() => {
			schema.validate(null);
		}).toThrow('Null is not allowed.');
	});

	it('errors if undefined is passed', () => {
		expect(() => {
			schema.validate(undefined);
		}).toThrow('String cannot be empty.');
	});

	it('errors if an empty string is passed', () => {
		expect(() => {
			schema.validate('');
		}).toThrow('String cannot be empty.');
	});

	it('doesnt error for v1 UUIDs', () => {
		expect(() => {
			schema.validate(v1);
		}).not.toThrow();
	});

	it('doesnt error for v2 UUIDs', () => {
		expect(() => {
			schema.validate(v2);
		}).not.toThrow();
	});

	it('doesnt error for v3 UUIDs', () => {
		expect(() => {
			schema.validate(v3);
		}).not.toThrow();
	});

	it('doesnt error for v4 UUIDs', () => {
		expect(() => {
			schema.validate(v4);
		}).not.toThrow();
	});

	it('doesnt error for v5 UUIDs', () => {
		expect(() => {
			schema.validate(v5);
		}).not.toThrow();
	});

	it('doesnt error for nil UUIDs', () => {
		expect(() => {
			schema.validate(nil);
		}).not.toThrow();
	});

	it('doesnt error for capital UUIDs', () => {
		expect(() => {
			schema.validate(v1.toUpperCase());
		}).not.toThrow();
	});

	describe('v1', () => {
		it('errors for other versions', () => {
			schema = uuid(1);

			expect(() => schema.validate(v1)).not.toThrow();
			expect(() => schema.validate(v2)).toThrow();
			expect(() => schema.validate(v3)).toThrow();
			expect(() => schema.validate(v4)).toThrow();
			expect(() => schema.validate(v5)).toThrow();
		});
	});

	describe('v2', () => {
		it('errors for other versions', () => {
			schema = uuid(2);

			expect(() => schema.validate(v1)).toThrow();
			expect(() => schema.validate(v2)).not.toThrow();
			expect(() => schema.validate(v3)).toThrow();
			expect(() => schema.validate(v4)).toThrow();
			expect(() => schema.validate(v5)).toThrow();
		});
	});

	describe('v3', () => {
		it('errors for other versions', () => {
			schema = uuid(3);

			expect(() => schema.validate(v1)).toThrow();
			expect(() => schema.validate(v2)).toThrow();
			expect(() => schema.validate(v3)).not.toThrow();
			expect(() => schema.validate(v4)).toThrow();
			expect(() => schema.validate(v5)).toThrow();
		});
	});

	describe('v4', () => {
		it('errors for other versions', () => {
			schema = uuid(4);

			expect(() => schema.validate(v1)).toThrow();
			expect(() => schema.validate(v2)).toThrow();
			expect(() => schema.validate(v3)).toThrow();
			expect(() => schema.validate(v4)).not.toThrow();
			expect(() => schema.validate(v5)).toThrow();
		});
	});

	describe('v5', () => {
		it('errors for other versions', () => {
			schema = uuid(5);

			expect(() => schema.validate(v1)).toThrow();
			expect(() => schema.validate(v2)).toThrow();
			expect(() => schema.validate(v3)).toThrow();
			expect(() => schema.validate(v4)).toThrow();
			expect(() => schema.validate(v5)).not.toThrow();
		});
	});
});
