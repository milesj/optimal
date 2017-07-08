import InstanceBuilder, { instance, date, regex } from '../src/InstanceBuilder';

class Foo {}

describe('InstanceBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new InstanceBuilder(Foo);
  });

  describe('constructor()', () => {
    it('errors if a class is not passed', () => {
      expect(() => {
        builder = new InstanceBuilder();
      }).toThrowError('A class reference is required.');
    });

    it('errors if a non-class is passed', () => {
      expect(() => {
        builder = new InstanceBuilder(123);
      }).toThrowError('A class reference is required.');
    });

    it('errors if an object is passed', () => {
      expect(() => {
        builder = new InstanceBuilder({});
      }).toThrowError('A class reference is required.');
    });

    it('doesnt error if a class is passed', () => {
      expect(() => {
        builder = new InstanceBuilder(Foo);
      }).not.toThrowError('A class reference is required.');
    });
  });

  describe('runChecks()', () => {
    it('returns null for no data', () => {
      expect(builder.runChecks('key')).toBe(null);
    });

    it('errors if a non-instance is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be an instance of "Foo".');
    });

    it('doesnt error if the correct instance is passed', () => {
      expect(() => {
        builder.runChecks('key', new Foo());
      }).not.toThrowError('Invalid option "key". Must be an instance of "Foo".');
    });
  });
});

describe('instance()', () => {
  it('returns a builder', () => {
    expect(instance(Foo)).toBeInstanceOf(InstanceBuilder);
  });
});

describe('date()', () => {
  it('returns a builder for Date', () => {
    expect(date()).toBeInstanceOf(InstanceBuilder);
    expect(date().refClass).toBe(Date);
  });
});

describe('regex()', () => {
  it('returns a builder for RegExp', () => {
    expect(regex()).toBeInstanceOf(InstanceBuilder);
    expect(regex().refClass).toBe(RegExp);
  });
});
