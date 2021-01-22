import { date, DateSchema } from '../../src/NEW';
import { runChecks } from '../helpers';

describe('date()', () => {
  let schema: DateSchema;

  beforeEach(() => {
    schema = date();
  });

  it('returns the class name for type alias', () => {
    expect(schema.type()).toBe('date');
  });

  it('errors if a non-Date value is passed', () => {
    expect(() => {
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
