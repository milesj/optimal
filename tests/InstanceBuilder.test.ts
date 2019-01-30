import InstanceBuilder, { instance, date, regex } from '../src/InstanceBuilder';

describe('instance()', () => {
  class Foo {}

  let builder: InstanceBuilder<Foo>;

  beforeEach(() => {
    builder = instance(Foo);
  });

  describe('constructor()', () => {
    it('errors if a non-class is passed', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        builder = instance(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object is passed', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        builder = instance({});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a class is passed', () => {
      expect(() => {
        builder = instance(Foo);
      }).not.toThrowError('A class reference is required.');
    });
  });

  describe('runChecks()', () => {
    it('returns null for no data', () => {
      expect(builder.runChecks('key', null, { key: null })).toBeNull();
    });

    it('errors if a non-instance is passed', () => {
      expect(() => {
        instance().runChecks(
          'key',
          // @ts-ignore Allow invalid type
          'foo',
          { key: null },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object is passed when a class instance is required', () => {
      expect(() => {
        builder.runChecks('key', {}, { key: null });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a generic class instance is passed', () => {
      expect(() => {
        instance<Foo>().runChecks('key', new Foo(), {});
      }).not.toThrowError('Invalid field "key". Must be a class instance.');
    });

    it('errors if a non-instance is passed when a class reference is set', () => {
      expect(() => {
        instance(Foo).runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if the correct instance is passed', () => {
      expect(() => {
        instance(Foo).runChecks('key', new Foo(), {});
      }).not.toThrowError('Invalid field "key". Must be an instance of "Foo".');
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

describe('date()', () => {
  it('returns a builder for Date', () => {
    expect(date()).toBeInstanceOf(InstanceBuilder);
    expect(date().refClass).toBe(Date);
  });

  it('returns the class name for type alias', () => {
    expect(date().typeAlias()).toBe('Date');
  });
});

describe('regex()', () => {
  it('returns a builder for RegExp', () => {
    expect(regex()).toBeInstanceOf(InstanceBuilder);
    expect(regex().refClass).toBe(RegExp);
  });

  it('returns the class name for type alias', () => {
    expect(regex().typeAlias()).toBe('RegExp');
  });
});
