/* eslint-disable no-new */

import Options from '../src/Options';

class Plugin {}

describe('Options', () => {
  let options;

  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  // eslint-disable-next-line
  const factory = ({ arrayOf, instanceOf, objectOf, bool, func, string, number, regex }) => ({
    context: string(process.cwd()).notEmpty(),
    entry: [
      string().notEmpty(),
      arrayOf(string()),
      objectOf([
        string().notEmpty(),
        arrayOf(string()),
      ]),
      func(),
    ],
    output: {
      chunkFilename: string('[id].js').notEmpty(),
      chunkLoadTimeout: number(120000),
      crossOriginLoading: [
        bool(false).only(),
        string('anonymous').oneOf(['anonymous', 'use-credentials']),
      ],
      filename: string('bundle.js').notEmpty(),
      hashFunction: string('md5').oneOf(['md5', 'sha256', 'sha512']),
      path: string().notEmpty(),
      publicPath: string(),
    },
    module: {
      noParse: [
        regex(),
        arrayOf(regex()),
        func(),
      ],
    },
    resolve: {
      alias: objectOf(string()),
      extensions: arrayOf(string()),
      plugins: arrayOf(instanceOf(Plugin)),
    },
  });

  describe('constructor()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        new Options([]);
      }).toThrowError('Options require a plain object, found object.');

      expect(() => {
        new Options(123);
      }).toThrowError('Options require a plain object, found number.');

      expect(() => {
        new Options('foo');
      }).toThrowError('Options require a plain object, found string.');

      expect(() => {
        new Options(() => {});
      }).toThrowError('Options require a plain object, found function.');
    });

    it('errors if a non-function is passed as a factory', () => {
      expect(() => {
        new Options({}, 123);
      }).toThrowError('An options factory function is required.');
    });

    it('sets object keys as class properties', () => {
      options = new Options({
        foo: 123,
        bar: true,
      }, ({ number, bool, string }) => ({
        foo: number(0),
        bar: bool(true),
        baz: string(),
      }));

      expect(options.foo).toBe(123);
      expect(options.bar).toBe(true);
      expect(options.baz).toBe('');
      expect(options).toEqual({
        foo: 123,
        bar: true,
        baz: '',
      });
    });
  });
});
