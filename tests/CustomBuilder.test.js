import CustomBuilder, { custom } from '../src/CustomBuilder';

describe('CustomBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new CustomBuilder(() => {});
  });

  describe('constructor()', () => {
    it('errors if no callback', () => {
      expect(() => new CustomBuilder())
        .toThrowError('Custom blueprints require a validation function.');
    });

    it('errors if callback is not a function', () => {
      expect(() => new CustomBuilder(123))
        .toThrowError('Custom blueprints require a validation function.');
    });

    it('sets default value', () => {
      builder = new CustomBuilder(() => {}, 123);

      expect(builder.defaultValue).toBe(123);
    });
  });

  describe('runChecks()', () => {
    it('triggers callback function', () => {
      builder = new CustomBuilder(function check(path, value) {
        if (path === 'error') {
          this.invariant(false, 'This will error!', path);
        }

        return value;
      });

      expect(() => {
        builder.runChecks('error', 123);
      }).toThrowError('Invalid option "error". This will error!');

      expect(() => {
        builder.runChecks('key', 123);
      }).not.toThrowError('Invalid option "error". This will error!');
    });

    it('supports null', () => {
      expect(builder.runChecks('key', null)).toBe(null);
    });
  });
});

describe('custom()', () => {
  it('returns a builder', () => {
    expect(custom(() => {})).toBeInstanceOf(CustomBuilder);
  });

  it('sets default value', () => {
    const builder = custom(() => {}, 123);

    expect(builder.defaultValue).toBe(123);
  });
});
