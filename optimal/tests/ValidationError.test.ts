import { ValidationError } from '../src';

describe('ValidationError', () => {
	let error: ValidationError;

	it('supports an empty path/value', () => {
		error = new ValidationError('Error');

		expect(error.message).toBe('Error');
		expect(error.path).toBe('');
		expect(error.value).toBeUndefined();
	});

	it('can pass a path/value', () => {
		error = new ValidationError('Error', 'foo', 123);

		expect(error.message).toBe('Invalid field "foo". Error');
		expect(error.path).toBe('foo');
		expect(error.value).toBe(123);
	});

	it('can set a path/value with an empty message', () => {
		error = new ValidationError('', 'foo', 123);

		expect(error.message).toBe('Invalid field "foo".');
		expect(error.path).toBe('foo');
		expect(error.value).toBe(123);
	});

	it('returns last key in path', () => {
		error = new ValidationError('Error', 'foo.bar.baz', 123);

		expect(error.message).toBe('Invalid field "baz". Error');
	});

	it('supports array index like paths', () => {
		error = new ValidationError('Error', 'foo[0]', 123);

		expect(error.message).toBe('Invalid member "[0]". Error');
	});

	describe('addErrors()', () => {
		describe('with path and message', () => {
			beforeEach(() => {
				error = new ValidationError('Oops', 'some.path', 123);
			});

			it('doesnt inline error if only 1', () => {
				error.addErrors([new Error('Failure!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\". Oops
  - Failure!"
`);
			});

			it('doesnt inline error if only 1 and error is a list', () => {
				error.addErrors([new Error('- Failure 1!\n- Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\". Oops
  - Failure 1!
  - Failure 2!"
`);
			});

			it('renders multiple errors as a list', () => {
				error.addErrors([new Error('Failure 1!'), new Error('Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\". Oops
  - Failure 1!
  - Failure 2!"
`);
			});

			it('renders multiple errors that contain nested lists', () => {
				error.addErrors([
					new Error('Failure 1!'),
					new ValidationError('Nested oops', 'some.path.nested').addErrors([
						new Error('Nested 1'),
						new Error('Nested 2'),
					]),
					new ValidationError(
						[new Error('Nested 3'), new Error('Nested 4')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\". Oops
  - Failure 1!
  - Invalid field \\"nested\\". Nested oops
    - Nested 1
    - Nested 2
  - Invalid field \\"nestedNoMessage\\".
    - Nested 3
    - Nested 4"
`);
			});
		});

		describe('with path and without message', () => {
			beforeEach(() => {
				error = new ValidationError('', 'some.path', 123);
			});

			it('inlines error if only 1', () => {
				error.addErrors([new Error('Failure!')]);

				expect(error.message).toMatchInlineSnapshot(`"Invalid field \\"path\\". Failure!"`);
			});

			it('doesnt inline error if only 1 and error is a list', () => {
				error.addErrors([new Error('- Failure 1!\n- Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\".
  - Failure 1!
  - Failure 2!"
`);
			});

			it('doesnt inline error if only 1 and a validation error with path', () => {
				error.addErrors([
					new ValidationError(
						[new Error('Nested 1'), new Error('Nested 2')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\".
  - Invalid field \\"nestedNoMessage\\".
    - Nested 1
    - Nested 2"
`);
			});

			it('renders multiple errors as a list', () => {
				error.addErrors([new Error('Failure 1!'), new Error('Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\".
  - Failure 1!
  - Failure 2!"
`);
			});

			it('renders multiple errors that contain nested lists', () => {
				error.addErrors([
					new Error('Failure 1!'),
					new ValidationError('Nested oops', 'some.path.nested').addErrors([
						new Error('Nested 1'),
						new Error('Nested 2'),
					]),
					new ValidationError(
						[new Error('Nested 3'), new Error('Nested 4')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"Invalid field \\"path\\".
  - Failure 1!
  - Invalid field \\"nested\\". Nested oops
    - Nested 1
    - Nested 2
  - Invalid field \\"nestedNoMessage\\".
    - Nested 3
    - Nested 4"
`);
			});
		});

		describe('without path and with message', () => {
			beforeEach(() => {
				error = new ValidationError('Oops');
			});

			it('doesnt inline error if only 1', () => {
				error.addErrors([new Error('Failure!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Oops
  - Failure!"
`);
			});

			it('doesnt inline error if only 1 and error is a list', () => {
				error.addErrors([new Error('- Failure 1!\n- Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Oops
  - Failure 1!
  - Failure 2!"
`);
			});

			it('doesnt inline error if only 1 and a validation error with path', () => {
				error.addErrors([
					new ValidationError(
						[new Error('Nested 1'), new Error('Nested 2')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"Oops
  - Invalid field \\"nestedNoMessage\\".
    - Nested 1
    - Nested 2"
`);
			});

			it('renders multiple errors as a list', () => {
				error.addErrors([new Error('Failure 1!'), new Error('Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"Oops
  - Failure 1!
  - Failure 2!"
`);
			});

			it('renders multiple errors that contain nested lists', () => {
				error.addErrors([
					new Error('Failure 1!'),
					new ValidationError('Nested oops', 'some.path.nested').addErrors([
						new Error('Nested 1'),
						new Error('Nested 2'),
					]),
					new ValidationError(
						[new Error('Nested 3'), new Error('Nested 4')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"Oops
  - Failure 1!
  - Invalid field \\"nested\\". Nested oops
    - Nested 1
    - Nested 2
  - Invalid field \\"nestedNoMessage\\".
    - Nested 3
    - Nested 4"
`);
			});
		});

		describe('without path and message', () => {
			beforeEach(() => {
				error = new ValidationError('');
			});

			it('inlines error if only 1', () => {
				error.addErrors([new Error('Failure!')]);

				expect(error.message).toMatchInlineSnapshot(`"Failure!"`);
			});

			it('inlines error if only 1 and error is a list', () => {
				error.addErrors([new Error('- Failure 1!\n- Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"- Failure 1!
- Failure 2!"
`);
			});

			it('renders multiple errors as a list', () => {
				error.addErrors([new Error('Failure 1!'), new Error('Failure 2!')]);

				expect(error.message).toMatchInlineSnapshot(`
"- Failure 1!
- Failure 2!"
`);
			});

			it('renders multiple errors that contain nested lists', () => {
				error.addErrors([
					new Error('Failure 1!'),
					new ValidationError('Nested oops', 'some.path.nested').addErrors([
						new Error('Nested 1'),
						new Error('Nested 2'),
					]),
					new ValidationError(
						[new Error('Nested 3'), new Error('Nested 4')],
						'some.path.nestedNoMessage',
					),
				]);

				expect(error.message).toMatchInlineSnapshot(`
"- Failure 1!
- Invalid field \\"nested\\". Nested oops
  - Nested 1
  - Nested 2
- Invalid field \\"nestedNoMessage\\".
  - Nested 3
  - Nested 4"
`);
			});
		});
	});
});
