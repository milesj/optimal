import { instance, InstanceSchema } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('instance()', () => {
  class Foo {}
  abstract class AbstractBar {}
  class Bar extends AbstractBar {}

  let schema: InstanceSchema<Object | null>;

  beforeEach(() => {
    schema = instance();
  });

  runCommonTests(() => instance().of(Foo), new Foo(), { nullableByDefault: true });

  describe('of()', () => {
    it('errors if a non-class declaration is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.of(123);
      }).toThrow('A class reference is required.');
    });

    it('errors if a class instance is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.of(new Foo());
      }).toThrow('A class reference is required.');
    });

    it('returns null if null is passed', () => {
      expect(schema.of(Foo).validate(null)).toBeNull();
    });

    it('supports running checks on abstract classes', () => {
      schema.of(AbstractBar);

      expect(() => {
        schema.validate(new Bar());
      }).not.toThrow();
    });

    describe('strict', () => {
      beforeEach(() => {
        schema.of(Foo);
      });

      it('errors if the wrong class is passed', () => {
        expect(() => {
          schema.validate(new Bar());
        }).toThrow('Must be an instance of "Foo".');
      });

      it('errors if the wrong class with same name is passed', () => {
        class Foo2 {}

        Object.defineProperty(Foo2, 'name', {
          value: 'Foo',
        });

        expect(() => {
          schema.validate(new Foo2());
        }).toThrow('Must be an instance of "Foo".');
      });

      it('doesnt error if the correct class is passed', () => {
        expect(() => {
          schema.validate(new Foo());
        }).not.toThrow();
      });
    });

    describe('loose', () => {
      beforeEach(() => {
        schema.of(Foo, true);
      });

      it('errors if the wrong class is passed', () => {
        expect(() => {
          schema.validate(new Bar());
        }).toThrow('Must be an instance of "Foo".');
      });

      it('doesnt error if the wrong class with same name is passed', () => {
        class Foo2 {}

        Object.defineProperty(Foo2, 'name', {
          value: 'Foo',
        });

        expect(() => {
          schema.validate(new Foo2());
        }).not.toThrow();
      });

      it('doesnt error if the correct class is passed', () => {
        expect(() => {
          schema.validate(new Foo());
        }).not.toThrow();
      });
    });

    describe('production', () => {
      it(
        'doesnt error if invalid value is passed',
        runInProd(() => {
          expect(() => {
            // @ts-expect-error Invalid type
            schema.of(new Foo());
          }).not.toThrow();
        }),
      );

      it(
        'doesnt error if the wrong class is passed',
        runInProd(() => {
          expect(() => {
            schema.validate(new Bar());
          }).not.toThrow();
        }),
      );
    });
  });

  describe('type()', () => {
    it('returns "class" when no class reference', () => {
      expect(instance().type()).toBe('class');
    });

    it('returns class name when passed an instance', () => {
      expect(instance().of(Foo).type()).toBe('Foo');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        schema.validate(123);
      }).toThrow('Must be a class instance.');
    });

    it('errors if a plain object is passed', () => {
      expect(() => {
        schema.validate({});
      }).toThrow('Must be a class instance.');
    });

    it('doesnt error if a class instance is passed', () => {
      expect(() => {
        schema.validate(new Foo());
        schema.validate(new Bar());
      }).not.toThrow();
    });

    it('doesnt error if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'doesnt error if a plain object is passed',
        runInProd(() => {
          expect(() => {
            schema.validate({});
          }).not.toThrow();
        }),
      );
    });
  });
});
