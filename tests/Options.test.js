/* eslint-disable no-new */

import Options from '../src/Options';

class Plugin {}

describe('Options', () => {
  let options;

  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  // eslint-disable-next-line
  const factory = ({
    arrayOf,
    bool,
    func,
    instanceOf,
    number,
    objectOf,
    regex,
    shape,
    string,
    union,
  }) => {
    const primitive = union([
      string(),
      number(),
      bool(),
    ]);

    const condition = union([
      string(),
      regex(),
      func(),
      arrayOf(regex()),
      objectOf(regex()),
    ]);

    const rule = shape({
      enforce: string('post').oneOf(['pre', 'post']),
      exclude: condition,
      include: condition,
      issuer: condition,
      parser: objectOf(bool()),
      resource: condition,
      use: arrayOf(union([
        string(),
        shape({
          loader: string(),
          options: objectOf(primitive),
        }),
      ])),
    });

    return {
      context: string(process.cwd()),
      entry: union([
        string(),
        arrayOf(string()),
        objectOf(union([
          string(),
          arrayOf(string()),
        ])),
        func(),
      ]),
      output: {
        chunkFilename: string('[id].js'),
        chunkLoadTimeout: number(120000),
        crossOriginLoading: union([
          bool(false).only(),
          string('anonymous').oneOf(['anonymous', 'use-credentials']),
        ]),
        filename: string('bundle.js'),
        hashFunction: string('md5').oneOf(['md5', 'sha256', 'sha512']),
        path: string().empty(),
        publicPath: string().empty(),
      },
      module: {
        noParse: union([
          regex(),
          arrayOf(regex()),
          func(),
        ]),
        rules: arrayOf(rule),
      },
      resolve: {
        alias: objectOf(string()),
        extensions: arrayOf(string()),
        plugins: arrayOf(instanceOf(Plugin)),
        resolveLoader: objectOf(arrayOf(string())),
      },
      plugins: arrayOf(instanceOf(Plugin)),
      target: string('web').oneOf([
        'async-node', 'electron-main', 'electron-renderer',
        'node', 'node-webkit', 'web', 'webworker',
      ]),
      watch: bool(false),
      node: objectOf(union([
        bool(),
        string('mock').oneOf(['mock', 'empty']),
      ])),
    };
  };

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
        baz: string().empty(),
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
