import { InstanceSchema, regex } from '../../src/NEW';
import { runChecks } from '../helpers';

describe('regex()', () => {
  let schema: InstanceSchema<RegExp | null>;

  beforeEach(() => {
    schema = regex();
  });

  it('returns the class name for type alias', () => {
    expect(schema.type()).toBe('RegExp');
  });

  it('errors if a non-regex value is passed', () => {
    expect(() => {
      // @ts-expect-error
      runChecks(schema, 123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if `null`', () => {
    expect(() => {
      runChecks(schema, null);
    }).not.toThrow();
  });

  it('returns `null` if nullable', () => {
    expect(runChecks(schema, null)).toBeNull();
  });

  it('errors if `null` and not nullable', () => {
    expect(() => {
      runChecks(schema.notNullable(), null);
    }).toThrowErrorMatchingSnapshot();
  });
});
