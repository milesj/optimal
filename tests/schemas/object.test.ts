import { object, blueprint, string, number, ObjectSchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

describe('object()', () => {
  let schema: ObjectSchema<Record<string, string>>;

  beforeEach(() => {
    schema = object().of(string());
  });

  it('errors if a non-predicate is passed', () => {
    expect(() => {
      // @ts-expect-error Allow non-predicate
      schema = object(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate is not passed', () => {
    expect(() => {
      object();
    }).not.toThrow();
  });

  it('doesnt error if a predicate is passed', () => {
    expect(() => {
      schema = object().of(string());
    }).not.toThrow();
  });

  it('returns an empty object for no data', () => {
    expect(runChecks(schema)).toEqual({});
  });

  it('errors if a non-object is passed', () => {
    expect(() => {
      runChecks(
        schema,
        // @ts-expect-error Test invalid type
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if a non-object is passed, when not using a predicate', () => {
    expect(() => {
      runChecks(
        object(),
        // @ts-expect-error Test invalid type
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias when no contents', () => {
    expect(object().type()).toBe('object');
  });

  it('returns the type alias with contents type', () => {
    expect(object().of(number()).type()).toBe('object<number>');
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(object({ foo: 'foo' }).of(string()))).toEqual({ foo: 'foo' });
  });

  // it('returns default value from factory if value is undefined', () => {
  //   expect(
  //     runChecks(
  //       object(string(), () => ({ foo: 'bar' })),
  //       undefined,
  //       {
  //         struct: { multiplier: 3 },
  //       },
  //     ),
  //   ).toEqual({ foo: 'bar' });
  // });

  it('checks each item in the object', () => {
    expect(() => {
      runChecks(schema, {
        a: 'foo',
        b: 'bar',
        // @ts-expect-error Test invalid type
        c: 123,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object item is invalid; persists path with index', () => {
    expect(() => {
      runChecks(schema, {
        // @ts-expect-error Test invalid type
        foo: 123,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  it('supports objects of objects', () => {
    const nestedPredicate = object().of(object().of(string()));

    const data = {
      a: {
        foo: '123',
        bar: '456',
      },
      b: {
        baz: '789',
      },
    };

    expect(runChecks(nestedPredicate, data)).toEqual(data);
  });

  it('errors correctly for objects in objects', () => {
    const nestedPredicate = object().of(object().of(string()));

    expect(() => {
      runChecks(nestedPredicate, {
        a: {
          foo: '123',
          // @ts-expect-error Test invalid type
          bar: 456,
        },
        b: {
          baz: '789',
        },
      });
    }).toThrowErrorMatchingSnapshot();
  });

  describe('production', () => {
    it(
      'returns an empty object if value is object',
      runInProd(() => {
        expect(runChecks(schema, {})).toEqual({});
      }),
    );

    it(
      'returns default value if value is undefined',
      runInProd(() => {
        const def = { foo: 'foo' };

        schema = object(def);

        expect(runChecks(schema)).toEqual(def);
      }),
    );

    // it(
    //   'returns default value from factory if value is undefined',
    //   runInProd(() => {
    //     expect(runChecks(object(string(), () => ({ foo: 'foo' })))).toEqual({ foo: 'foo' });
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(
          runChecks(
            schema,
            // @ts-expect-error Test invalid type
            { foo: 123 },
          ),
        ).toEqual({ foo: '123' });
      }),
    );
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      schema.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(schema, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(schema, { foo: '123' });
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        schema.nullable();

        runChecks(schema, null);
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      schema.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(schema, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(schema, { a: '1', b: '2', c: '3' });
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        schema.nullable();

        runChecks(schema, null);
      }).not.toThrow();
    });
  });
});

describe('blueprint()', () => {
  it('errors if a non-predicate is passed', () => {
    expect(() => {
      runChecks(
        blueprint(),
        // @ts-expect-error Allow invalid type
        { value: 123 },
      );
    }).toThrow('Invalid field "key.value". Must be an instance of "Predicate".');
  });
});
