import { instance } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('instance()', () => {
  class Foo {}
  abstract class Bar {}
  class BarImpl extends Bar {}

  runCommonTests(() => instance().of(Foo), new Foo(), { skipNullValues: true });

  describe('type()', () => {
    it('returns "class" when no class reference', () => {
      expect(instance().type()).toBe('class');
    });

    it('returns class name when passed an instance', () => {
      expect(instance().of(Foo).type()).toBe('Foo');
    });
  });
});
