import Builder from '../src/Builder';
import InstanceBuilder, { instance, builder, date, regex } from '../src/InstanceBuilder';
import runChecks from './helpers';

describe('instance()', () => {
  class Foo {}
  abstract class Bar {}
  class BarImpl extends Bar {}

  let inst: InstanceBuilder<Foo>;

  beforeEach(() => {
    inst = instance(Foo);
  });

  it('errors if a non-class is passed', () => {
    expect(() => {
      // @ts-ignore Test invalid type
      instance(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object is passed', () => {
    expect(() => {
      // @ts-ignore Test invalid type
      instance({});
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a class is passed', () => {
    expect(() => {
      instance(Foo);
    }).not.toThrow();
  });

  describe('runChecks()', () => {
    it('returns null for no data', () => {
      expect(runChecks(inst, null)).toBeNull();
    });

    it('errors if a non-instance is passed', () => {
      expect(() => {
        runChecks(
          instance(),
          // @ts-ignore Allow invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object is passed when a class instance is required', () => {
      expect(() => {
        runChecks(inst, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a generic class instance is passed', () => {
      expect(() => {
        runChecks(instance<Foo>(), new Foo());
      }).not.toThrow();
    });

    it('errors if a non-instance is passed when a class reference is set', () => {
      expect(() => {
        runChecks(instance(Foo), 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if the correct instance is passed', () => {
      expect(() => {
        runChecks(instance(Foo), new Foo());
      }).not.toThrow();
    });

    it('handles an instance of the same name when passed in loose mode', () => {
      class Foo2 {}

      Object.defineProperty(Foo2, 'name', {
        value: 'Foo',
      });

      expect(() => {
        runChecks(instance(Foo), new Foo2());
      }).toThrow('Invalid field "key". Must be an instance of "Foo".');

      expect(() => {
        runChecks(instance(Foo, true), new Foo2());
      }).not.toThrow();
    });

    it('supports running checks on abstract classes', () => {
      expect(() => {
        runChecks(instance(Bar), new BarImpl());
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the word class when no reference class', () => {
      expect(instance().typeAlias()).toBe('class');
    });

    it('returns the class name when a reference class is defined', () => {
      expect(instance(Buffer).typeAlias()).toBe('Buffer');
    });
  });
});

describe('builder()', () => {
  it('returns a builder instance', () => {
    expect(builder()).toBeInstanceOf(InstanceBuilder);
    // @ts-ignore Allow access
    expect(builder().refClass).toBe(Builder);
  });

  it('returns the class name for type alias', () => {
    expect(builder().typeAlias()).toBe('Builder');
  });

  it('errors if a non-builder is passed', () => {
    expect(() => {
      runChecks(
        builder(),
        // @ts-ignore Allow invalid type
        123,
      );
    }).toThrow('Invalid field "key". Must be an instance of "Builder".');
  });
});

describe('date()', () => {
  it('returns a builder for Date', () => {
    expect(date()).toBeInstanceOf(InstanceBuilder);
    // @ts-ignore Allow access
    expect(date().refClass).toBe(Date);
  });

  it('returns the class name for type alias', () => {
    expect(date().typeAlias()).toBe('Date');
  });

  it('errors if a non-Date is passed', () => {
    expect(() => {
      runChecks(
        date(),
        // @ts-ignore Allow invalid type
        123,
      );
    }).toThrow('Invalid field "key". Must be an instance of "Date".');
  });
});

describe('regex()', () => {
  it('returns a builder for RegExp', () => {
    expect(regex()).toBeInstanceOf(InstanceBuilder);
    // @ts-ignore Allow access
    expect(regex().refClass).toBe(RegExp);
  });

  it('returns the class name for type alias', () => {
    expect(regex().typeAlias()).toBe('RegExp');
  });

  it('errors if a non-RegExp is passed', () => {
    expect(() => {
      runChecks(
        regex(),
        // @ts-ignore Allow invalid type
        123,
      );
    }).toThrow('Invalid field "key". Must be an instance of "RegExp".');
  });
});
