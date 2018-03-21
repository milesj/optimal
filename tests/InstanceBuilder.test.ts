import InstanceBuilder, { instance, date, regex } from '../src/InstanceBuilder';

describe('instance()', () => {
  class Foo {}

  describe('constructor()', () => {
    it('errors if a non-class is passed', () => {
      expect(() => {
        instance(123);
      }).toThrowError('A class reference is required.');
    });

    it('errors if an object is passed', () => {
      expect(() => {
        instance({});
      }).toThrowError('A class reference is required.');
    });

    it('doesnt error if a class is passed', () => {
      expect(() => {
        instance(Foo);
      }).not.toThrowError('A class reference is required.');
    });
  });

  describe('runChecks()', () => {
    it('returns null for no data', () => {
      expect(instance(Foo).runChecks('key')).toBeNull();
    });

    it('errors if a non-instance is passed', () => {
      expect(() => {
        instance().runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be a class instance.');
    });

    it('errors if an object is passed when a class instance is required', () => {
      expect(() => {
        instance().runChecks('key', {});
      }).toThrowError('Invalid option "key". Must be a class instance.');
    });

    it('doesnt error if a generic class instance is passed', () => {
      expect(() => {
        instance().runChecks('key', new Foo());
      }).not.toThrowError('Invalid option "key". Must be a class instance.');
    });

    it('errors if a non-instance is passed when a class reference is set', () => {
      expect(() => {
        instance(Foo).runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be an instance of "Foo".');
    });

    it('doesnt error if the correct instance is passed', () => {
      expect(() => {
        instance(Foo).runChecks('key', new Foo());
      }).not.toThrowError('Invalid option "key". Must be an instance of "Foo".');
    });
  });

  describe('typeAlias()', () => {
    it('returns the word class when no reference class', () => {
      expect(instance().typeAlias()).toBe('class');
    });

    it('returns the class name when a reference class is defined', () => {
      expect(instance(FormData).typeAlias()).toBe('FormData');
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
