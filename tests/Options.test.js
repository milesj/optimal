/* eslint-disable no-new */

import Options from '../src/Options';

describe('Options', () => {
  let options;

  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  // const factory = ({ arrayOf, bool, func, string, number }) => {
  //   return {
  //     context: string(process.cwd()).notEmpty(),
  //     entry: [
  //       string().notEmpty(),
  //       arrayOf(string()),
  //       // objectOf([
  //       //   string().notEmpty(),
  //       //   arrayOf(string()),
  //       // ]),
  //       func(),
  //     ],
  //     output: {
  //       chunkFilename: string('[id].js').notEmpty(),
  //       chunkLoadTimeout: number(120000),
  //       crossOriginLoading: [
  //         bool(false).only(),
  //         string('anonymous').oneOf(['anonymous', 'use-credentials']),
  //       ],
  //       devtoolFallbackModuleFilenameTemplate: [
  //         string(),
  //         func(),
  //       ],
  //       devtoolModuleFilenameTemplate: [
  //         string(),
  //         func(),
  //       ],
  //       filename: string('bundle.js').notEmpty(),
  //       hashDigest: string('hex').oneOf(['hex', 'base64']),
  //       hashDigestLength: number(20),
  //       hashFunction: string('md5').oneOf(['md5', 'sha256', 'sha512']),
  //       hashSalt: string(),
  //       hotUpdateChunkFilename: string('[id].[hash].hot-update.js').notEmpty(),
  //       hotUpdateFunction: func(),
  //       hotUpdateMainFilename: string('[hash].hot-update.json').notEmpty(),
  //       jsonpFunction: string(),
  //       library: string(),
  //       libraryExport: [
  //         string(),
  //         arrayOf(string()),
  //       ],
  //       libraryTarget: string('var').oneOf([
  //         'var', 'this', 'window', 'global', 'assign', 'jsonp',
  //         'commonjs', 'commonjs2', 'amd', 'umd',
  //       ]),
  //       path: string().notEmpty(),
  //       pathinfo: bool(false),
  //       publicPath: string(),
  //       sourceMapFilename: string('[file].map').notEmpty(),
  //       sourcePrefix: string(),
  //       strictModuleExceptionHandling: bool(false),
  //       umdNamedDefine: bool(false),
  //     },
  //   };
  // };

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
