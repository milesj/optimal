import { instance, date, regex, InstanceSchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

describe('instance()', () => {
  class Foo {}
  abstract class Bar {}
  class BarImpl extends Bar {}

  let schema: InstanceSchema<Foo | null>;

  beforeEach(() => {
    schema = instance().of(Foo);
  });

  it('errors if a non-class is passed', () => {
    expect(() => {
      // @ts-expect-error Test invalid type
      instance(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object is passed', () => {
    expect(() => {
      // @ts-expect-error Test invalid type
      instance({});
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a class is passed', () => {
    expect(() => {
      instance().of(Foo);
    }).not.toThrow();
  });

  it('returns null for no data', () => {
    expect(runChecks(schema, null)).toBeNull();
  });

  it('errors if a non-instance is passed', () => {
    expect(() => {
      runChecks(
        instance(),
        // @ts-expect-error
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object is passed when a class instance is required', () => {
    expect(() => {
      runChecks(schema, {});
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a generic class instance is passed', () => {
    expect(() => {
      runChecks(instance<Foo>(), new Foo());
    }).not.toThrow();
  });

  it('errors if a non-instance is passed when a class reference is set', () => {
    expect(() => {
      runChecks(schema, 'foo');
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if the correct instance is passed', () => {
    expect(() => {
      runChecks(schema, new Foo());
    }).not.toThrow();
  });

  it('returns the word class when no reference class', () => {
    expect(instance().type()).toBe('class');
  });

  it('returns the class name when a reference class is defined', () => {
    expect(instance().of(Buffer).type()).toBe('Buffer');
  });

  it('handles an instance of the same name when passed in loose mode', () => {
    class Foo2 {}

    Object.defineProperty(Foo2, 'name', {
      value: 'Foo',
    });

    expect(() => {
      runChecks(schema, new Foo2());
    }).toThrow('Invalid field "key". Must be an instance of "Foo".');

    expect(() => {
      runChecks(instance().of(Foo, true), new Foo2());
    }).not.toThrow();
  });

  it('supports running checks on abstract classes', () => {
    expect(() => {
      runChecks(instance().of(Bar), new BarImpl());
    }).not.toThrow();
  });

  describe('production', () => {
    it(
      'returns null if value is empty',
      runInProd(() => {
        expect(runChecks(schema, null)).toBeNull();
      }),
    );

    // it(
    //   'returns default value if value is undefined',
    //   runInProd(() => {
    //     const foo = new Foo();

    //     inst = instance(Foo, foo);

    //     expect(runChecks(inst)).toBe(foo);
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(runChecks(schema, {})).toEqual({});
      }),
    );
  });
});

describe('date()', () => {
  it('returns the class name for type alias', () => {
    expect(date().type()).toBe('Date');
  });

  it('errors if a non-Date is passed', () => {
    expect(() => {
      runChecks(date(), 123);
    }).toThrow('Invalid field "key". Must be an instance of "Date".');
  });
});

describe('regex()', () => {
  it('returns the class name for type alias', () => {
    expect(regex().type()).toBe('RegExp');
  });

  it('errors if a non-RegExp is passed', () => {
    expect(() => {
      runChecks(
        regex(),
        // @ts-expect-error Allow invalid type
        123,
      );
    }).toThrow('Invalid field "key". Must be an instance of "RegExp".');
  });
});
