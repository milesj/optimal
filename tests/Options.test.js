/* eslint-disable no-new */

import Options from '../src/Options';

class Plugin {}

describe('Options', () => {
  let options;

  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  const factory = ({
    array,
    bool,
    func,
    instance,
    number,
    object,
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
      array(regex()),
      object(regex()),
    ]);

    const rule = shape({
      enforce: string('post').oneOf(['pre', 'post']),
      exclude: condition,
      include: condition,
      issuer: condition,
      parser: object(bool()),
      resource: condition,
      use: array(union([
        string(),
        shape({
          loader: string(),
          options: object(primitive),
        }),
      ])),
    });

    return {
      context: string(process.cwd()),
      entry: union([
        string(),
        array(string()),
        object(union([
          string(),
          array(string()),
        ])),
        func(),
      ]).nullable(),
      output: {
        chunkFilename: string('[id].js'),
        chunkLoadTimeout: number(120000),
        crossOriginLoading: union([
          bool(false).only(),
          string('anonymous').oneOf(['anonymous', 'use-credentials']),
        ], false),
        filename: string('bundle.js'),
        hashFunction: string('md5').oneOf(['md5', 'sha256', 'sha512']),
        path: string().empty(),
        publicPath: string().empty(),
      },
      module: {
        noParse: union([
          regex(),
          array(regex()),
          func(),
        ]).nullable(),
        rules: array(rule),
      },
      resolve: {
        alias: object(string()),
        extensions: array(string()),
        plugins: array(instance(Plugin)),
        resolveLoader: object(array(string())),
      },
      plugins: array(instance(Plugin)),
      target: string('web').oneOf([
        'async-node', 'electron-main', 'electron-renderer',
        'node', 'node-webkit', 'web', 'webworker',
      ]),
      watch: bool(false),
      node: object(union([
        bool(),
        string('mock').oneOf(['mock', 'empty']),
      ])),
    };
  };

  it('errors if a non-object is passed', () => {
    expect(() => {
      new Options([]);
    }).toThrowError('Options require a plain object, found array.');

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

  it('errors if a non-builder is passed within the factory', () => {
    expect(() => {
      new Options({}, () => ({
        foo: 123,
      }));
    }).toThrowError('Unknown blueprint option. Must be a builder or plain object.');
  });

  it('errors for unknown options', () => {
    expect(() => {
      new Options({
        foo: 123,
        bar: 456,
      }, factory);
    }).toThrowError('Unknown options foo, bar.');
  });

  it('doesnt error for unknown options if `unknown` is true', () => {
    expect(() => {
      new Options({
        foo: 123,
        bar: 456,
      }, factory, {
        unknown: true,
      });
    }).not.toThrowError('Unknown options foo, bar.');
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

  it('sets default values', () => {
    options = new Options({}, factory);

    expect(options).toEqual({
      context: process.cwd(),
      entry: null,
      output: {
        chunkFilename: '[id].js',
        chunkLoadTimeout: 120000,
        crossOriginLoading: false,
        filename: 'bundle.js',
        hashFunction: 'md5',
        path: '',
        publicPath: '',
      },
      module: {
        noParse: null,
        rules: [],
      },
      resolve: {
        alias: {},
        extensions: [],
        plugins: [],
        resolveLoader: {},
      },
      plugins: [],
      target: 'web',
      watch: false,
      node: {},
    });
  });

  it('runs checks for root level values', () => {
    expect(() => {
      options = new Options({
        entry: 123,
      }, factory);
    }).toThrowError('Invalid option "entry". Type must be one of: string, array, object, function.');
  });

  it('runs checks for nested level values', () => {
    expect(() => {
      options = new Options({
        output: {
          crossOriginLoading: 'not-anonymous',
        },
      }, factory);
    }).toThrowError('Invalid option "output.crossOriginLoading". String must be one of: anonymous, use-credentials');
  });

  it('includes a custom `name` in the error message', () => {
    expect(() => {
      options = new Options({
        entry: 123,
      }, factory, {
        name: 'FooBar',
      });
    }).toThrowError('Invalid `FooBar` option "entry". Type must be one of: string, array, object, function.');
  });
});
