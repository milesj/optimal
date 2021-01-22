/* eslint-disable no-magic-numbers */

import { CommonCriterias, Schema } from '../../src';
import { runInProd } from '../helpers';

interface TestCriterias<S> extends CommonCriterias<S> {
  never: () => S;
  notNullable: () => S;
  nullable: () => S;
}

export function runCommonTests<T>(
  factory: (initialValue?: T) => Schema<T | null> & CommonCriterias<Schema<T | null>>,
  value: T | null = null,
  {
    defaultValue = null,
    skipNullValues,
  }: { defaultValue?: T | null; skipNullValues?: boolean } = {},
) {
  let schema: Schema<T> & TestCriterias<Schema<T>>;

  beforeEach(() => {
    // eslint-disable-next-line
    schema = factory(defaultValue!) as any;
  });

  describe('and()', () => {
    beforeEach(() => {
      schema.and('a', 'c');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        schema.and();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not all properties are defined', () => {
      expect(() => {
        schema.validate(value, 'a', {
          a: 'a',
          b: 'b',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    if (!skipNullValues) {
      it('errors if not all properties are defined and null is passed', () => {
        expect(() => {
          schema.validate(null, 'a', {
            a: 'a',
            b: 'b',
          });
        }).toThrowErrorMatchingSnapshot();
      });
    }

    it('doesnt error if all are defined', () => {
      expect(() => {
        schema.validate(value, 'a', {
          a: 'a',
          b: 'b',
          c: 'c',
        });
      }).not.toThrow();
    });

    if (!skipNullValues) {
      it('doesnt error if all are defined and null is passed', () => {
        expect(() => {
          schema.validate(null, 'a', {
            a: 'a',
            b: 'b',
            c: 'c',
          });
        }).not.toThrow();
      });
    }

    describe('production', () => {
      it(
        'doesnt error if no keys are defined',
        runInProd(() => {
          expect(() => {
            schema.and();
          }).not.toThrow();
        }),
      );

      it(
        'doesnt error if not all properties are defined',
        runInProd(() => {
          expect(() => {
            schema.validate(value, 'a', {
              a: 'a',
              b: 'b',
            });
          }).not.toThrow();
        }),
      );
    });
  });

  describe('custom()', () => {
    it('errors if no callback', () => {
      expect(() =>
        // @ts-expect-error
        schema.custom(),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if callback is not a function', () => {
      expect(() =>
        // @ts-expect-error
        schema.custom(123),
      ).toThrowErrorMatchingSnapshot();
    });

    it('triggers callback function', () => {
      const spy = jest.fn();

      schema.custom(spy).validate(value, 'key', { key: null }, { root: true });

      expect(spy).toHaveBeenCalledWith(value, { key: null }, { root: true });
    });

    it('catches and re-throws errors', () => {
      expect(() =>
        schema
          .custom(() => {
            throw new Error('Oops');
          })
          .validate(value, 'key'),
      ).toThrow('Oops');
    });

    describe('production', () => {
      it(
        'doesnt error if no callback',
        runInProd(() => {
          expect(() =>
            // @ts-expect-error
            schema.custom(),
          ).not.toThrow();
        }),
      );

      it(
        'doesnt error if callback is not a function',
        runInProd(() => {
          expect(() =>
            // @ts-expect-error
            schema.custom(123),
          ).not.toThrow();
        }),
      );

      it(
        'doesnt catch and re-throws errors',
        runInProd(() => {
          expect(() =>
            schema
              .custom(() => {
                throw new Error('Oops');
              })
              .validate(value, 'key'),
          ).not.toThrow('Oops');
        }),
      );
    });
  });

  describe('deprecate()', () => {
    it('errors if no message', () => {
      expect(() =>
        // @ts-expect-error
        schema.deprecate(),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors if empty message', () => {
      expect(() => schema.deprecate('')).toThrowErrorMatchingSnapshot();
    });

    it('errors if invalid message type', () => {
      expect(() =>
        // @ts-expect-error
        schema.deprecate(123),
      ).toThrowErrorMatchingSnapshot();
    });

    it('logs a message when validating', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();

      schema.deprecate('Migrate away!').validate(value, 'key', {});

      expect(spy).toHaveBeenCalledWith('Field "key" is deprecated. Migrate away!');

      spy.mockRestore();
    });

    describe('production', () => {
      it(
        'doesnt error if no message',
        runInProd(() => {
          expect(() =>
            // @ts-expect-error
            schema.deprecate(),
          ).not.toThrow();
        }),
      );

      it(
        'doesnt log a message when validating',
        runInProd(() => {
          const spy = jest.spyOn(console, 'info').mockImplementation();

          schema.deprecate('Migrate away!').validate(value, 'key', {});

          expect(spy).not.toHaveBeenCalled();

          spy.mockRestore();
        }),
      );
    });
  });

  describe('never()', () => {
    it('errors when validating', () => {
      expect(() => schema.never().validate(value)).toThrowErrorMatchingSnapshot();
    });

    describe('production', () => {
      it(
        'doesnt error when validating',
        runInProd(() => {
          expect(() => schema.never().validate(value)).not.toThrow();
          expect(schema.never().validate(value)).toBe(value);
        }),
      );
    });
  });

  describe('nullable()', () => {
    beforeEach(() => {
      schema.nullable();
    });

    it('returns null when null is passed', () => {
      expect(schema.validate(null)).toBe(null);
    });

    it('returns default value when undefined is passed', () => {
      expect(schema.validate(undefined)).toBe(defaultValue);
    });

    it('returns value when a valid value is passed', () => {
      expect(schema.validate(value)).toBe(value);
    });

    it('doesnt error when null is passed', () => {
      expect(() => schema.validate(null)).not.toThrow();
    });

    it('doesnt error when undefined is passed', () => {
      expect(() => schema.validate(undefined)).not.toThrow();
    });

    it('doesnt error when a valid value is passed', () => {
      expect(() => schema.validate(value)).not.toThrow();
    });
  });

  describe('notNullable()', () => {
    beforeEach(() => {
      schema.notNullable();
    });

    it('returns value when a valid value is passed', () => {
      expect(schema.validate(value)).toBe(value);
    });

    it('errors when null is passed', () => {
      expect(() => schema.validate(null)).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error when a valid value is passed', () => {
      expect(() => schema.validate(value)).not.toThrow();
    });

    if (defaultValue !== null) {
      it('returns default value when undefined is passed', () => {
        expect(schema.validate(undefined)).toBe(defaultValue);
      });

      it('doesnt error when undefined is passed', () => {
        expect(() => schema.validate(undefined)).not.toThrow();
      });
    }

    describe('production', () => {
      it(
        'doesnt error when null is passed',
        runInProd(() => {
          expect(() => schema.validate(null)).not.toThrow();
          expect(schema.validate(null)).toBeNull(); // How to handle?
        }),
      );
    });
  });

  describe('required()', () => {
    beforeEach(() => {
      schema.required();
    });

    it('returns value when a valid value is passed', () => {
      expect(schema.validate(value)).toBe(value);
    });

    it('errors when undefined is passed', () => {
      expect(() => schema.validate(undefined)).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error when a valid value is passed', () => {
      expect(() => schema.validate(value)).not.toThrow();
    });

    describe('production', () => {
      it(
        'doesnt error when undefined is passed',
        runInProd(() => {
          expect(() => schema.validate(undefined)).not.toThrow();
          expect(schema.validate(undefined)).toBe(defaultValue);
        }),
      );
    });
  });

  describe('notRequired()', () => {
    beforeEach(() => {
      schema.notRequired();
    });

    it('returns default value when undefind is passed', () => {
      expect(schema.validate(undefined)).toBe(defaultValue);
    });

    it('doesnt error when undefined is passed', () => {
      expect(() => schema.validate(undefined)).not.toThrow();
    });

    it('doesnt error when a valid value is passed', () => {
      expect(() => schema.validate(value)).not.toThrow();
    });
  });

  if (defaultValue !== null) {
    describe('only()', () => {
      beforeEach(() => {
        schema.only();
      });

      it('errors if default value is not the same type', () => {
        expect(() => {
          factory(defaultValue).only();
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors if value doesnt match the default value', () => {
        expect(() => {
          schema.validate(value);
        }).toThrowErrorMatchingSnapshot();
      });

      it('doesnt error if value matches default value', () => {
        expect(() => {
          schema.validate(defaultValue);
        }).not.toThrow();
      });

      describe('production', () => {
        it(
          'doesnt error if default value is not the same type',
          runInProd(() => {
            expect(() => {
              factory(defaultValue).only();
            }).not.toThrow();
          }),
        );

        it(
          'doesnt error if value doesnt match the default value',
          runInProd(() => {
            expect(() => {
              schema.validate(value);
            }).not.toThrow();
          }),
        );
      });
    });
  }

  describe('or()', () => {
    beforeEach(() => {
      schema.or('a', 'b');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        schema.or();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not 1 option is defined', () => {
      expect(() => {
        schema.validate(value, 'a', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if at least 1 option is defined', () => {
      expect(() => {
        schema.validate(value, 'a', { a: 'a' });
      }).not.toThrow();
    });

    it('doesnt error if at least 1 option is defined that isnt the main field', () => {
      expect(() => {
        schema.validate(value, 'a', { b: 'b' });
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'errors if no keys are defined',
        runInProd(() => {
          expect(() => {
            schema.or();
          }).not.toThrow();
        }),
      );

      it(
        'errors if not 1 option is defined',
        runInProd(() => {
          expect(() => {
            schema.validate(value, 'a', {});
          }).not.toThrow();
        }),
      );
    });
  });

  describe('xor()', () => {
    beforeEach(() => {
      schema.xor('b', 'c');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        schema.xor();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if no options are defined', () => {
      expect(() => {
        schema.validate(value, 'a', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if more than 1 option is defined', () => {
      expect(() => {
        schema.validate(value, 'a', { a: 'a', b: 'b' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if only 1 option is defined', () => {
      expect(() => {
        schema.validate(value, 'a', { a: 'a' });
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'doesnt error if no keys are defined',
        runInProd(() => {
          expect(() => {
            schema.xor();
          }).not.toThrow();
        }),
      );

      it(
        'doesnt error if no options are defined',
        runInProd(() => {
          expect(() => {
            schema.validate(value, 'a', {});
          }).not.toThrow();
        }),
      );

      it(
        'doesnt error if more than 1 option is defined',
        runInProd(() => {
          expect(() => {
            schema.validate(value, 'a', { a: 'a', b: 'b' });
          }).not.toThrow();
        }),
      );
    });
  });

  describe('validate()', () => {});
}
