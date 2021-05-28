import { DateSchema, date } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('date()', () => {
  let schema: DateSchema;
  const now = new Date();

  beforeEach(() => {
    schema = date();
  });

  runCommonTests(() => date(now), now, {
    defaultValue: now,
  });

  describe('after()', () => {
    it('errors if a non-date value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.after([]);
      }).toThrow('After date must be a valid date.');
    });

    it('errors if value comes before provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.after(base).validate(base - 1000);
      }).toThrow(`Date must come after ${new Date(base).toLocaleDateString()}.`);
    });

    it('errors if value equals provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.after(base).validate(base);
      }).toThrow(`Date must come after ${new Date(base).toLocaleDateString()}.`);
    });

    it('doesnt error if value comes after provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.after(base).validate(base + 1000);
      }).not.toThrow();
    });
  });

  describe('before()', () => {
    it('errors if a non-date value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.before([]);
      }).toThrow('Before date must be a valid date.');
    });

    it('errors if value comes after provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.before(base).validate(base + 1000);
      }).toThrow(`Date must come before ${new Date(base).toLocaleDateString()}.`);
    });

    it('errors if value equals provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.before(base).validate(base);
      }).toThrow(`Date must come before ${new Date(base).toLocaleDateString()}.`);
    });

    it('doesnt error if value comes before provided date', () => {
      const base = Date.now();

      expect(() => {
        schema.before(base).validate(base - 1000);
      }).not.toThrow();
    });
  });

  describe('between()', () => {
    it('errors if a non-date start value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.between([]);
      }).toThrow('Between start date must be a valid date.');
    });

    it('errors if a non-date end value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.between(Date.now(), []);
      }).toThrow('Between end date must be a valid date.');
    });

    describe('non-inclusive', () => {
      const start = Date.now();
      const end = Date.now() + 1000;
      const error = `Date must be between ${new Date(start).toLocaleDateString()} and ${new Date(
        end,
      ).toLocaleDateString()}.`;

      it('errors if value comes before provided dates', () => {
        expect(() => {
          schema.between(start, end).validate(start - 1000);
        }).toThrow(error);
      });

      it('errors if value comes after provided dates', () => {
        expect(() => {
          schema.between(start, end).validate(end + 1000);
        }).toThrow(error);
      });

      it('errors if value is on start date', () => {
        expect(() => {
          schema.between(start, end).validate(start);
        }).toThrow(error);
      });

      it('errors if value is on end date', () => {
        expect(() => {
          schema.between(start, end).validate(start);
        }).toThrow(error);
      });

      it('doesnt error if value is between provided dates', () => {
        expect(() => {
          schema.between(start, end).validate(start + 500);
        }).not.toThrow();
      });
    });

    describe('inclusive', () => {
      const start = Date.now();
      const end = Date.now() + 1000;
      const error = `Date must be between ${new Date(start).toLocaleDateString()} and ${new Date(
        end,
      ).toLocaleDateString()} inclusive.`;

      it('errors if value comes before provided dates', () => {
        expect(() => {
          schema.between(start, end, { inclusive: true }).validate(start - 1000);
        }).toThrow(error);
      });

      it('errors if value comes after provided dates', () => {
        expect(() => {
          schema.between(start, end, { inclusive: true }).validate(end + 1000);
        }).toThrow(error);
      });

      it('doesnt error if value is on start date', () => {
        expect(() => {
          schema.between(start, end, { inclusive: true }).validate(start);
        }).not.toThrow();
      });

      it('doesnt error if value is on end date', () => {
        expect(() => {
          schema.between(start, end, { inclusive: true }).validate(start);
        }).not.toThrow();
      });

      it('doesnt error if value is between provided dates', () => {
        expect(() => {
          schema.between(start, end, { inclusive: true }).validate(start + 500);
        }).not.toThrow();
      });
    });
  });

  describe('type()', () => {
    it('returns "Date"', () => {
      expect(date().type()).toBe('date');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-date value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate([]);
      }).toThrow('Must be a string, number, or `Date` that resolves to a valid date.');
    });

    it('doesnt error if a `Date` is passed', () => {
      expect(() => {
        schema.validate(new Date());
      }).not.toThrow();
    });

    it('doesnt error if a number is passed', () => {
      expect(() => {
        schema.validate(Date.now());
      }).not.toThrow();
    });

    it('doesnt error if a string is passed', () => {
      expect(() => {
        schema.validate(new Date().toString());
      }).not.toThrow();
    });

    it('doesnt error if null is passed (if nullable)', () => {
      expect(() => {
        schema.nullable().validate(null);
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'doesnt error if a non-date value is passed',
        runInProd(() => {
          expect(() => {
            // @ts-expect-error Invalid type
            schema.validate([]);
          }).not.toThrow();
        }),
      );
    });
  });
});
