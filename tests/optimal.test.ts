import optimal, {
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
} from '../src';

class Plugin {}

describe('Optimal', () => {
  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  const primitive = union([string(), number(), bool()], false);

  const condition = union([string(), regex(), func(), array(regex()), object(regex())], false);

  const rule = shape({
    enforce: string('post').oneOf(['pre', 'post']),
    exclude: condition,
    include: condition,
    issuer: condition,
    parser: object(bool()),
    resource: condition,
    use: array(
      union(
        [
          string(),
          shape({
            loader: string(),
            options: object(primitive),
          }),
        ],
        [],
      ),
    ),
  });

  const blueprint = {
    context: string(process.cwd()),
    entry: union(
      [string(), array(string()), object(union([string(), array(string())], '')), func()],
      [],
    ).nullable(),
    output: shape({
      chunkFilename: string('[id].js'),
      chunkLoadTimeout: number(120000),
      crossOriginLoading: union(
        [bool(false).only(), string('anonymous').oneOf(['anonymous', 'use-credentials'])],
        false,
      ),
      filename: string('bundle.js'),
      hashFunction: string('md5').oneOf(['md5', 'sha256', 'sha512']),
      path: string(),
      publicPath: string(),
    }),
    module: shape({
      noParse: union([regex(), array(regex()), func()], null).nullable(),
      rules: array(rule),
    }),
    resolve: shape({
      alias: object(string()),
      extensions: array(string()),
      plugins: array(instance(Plugin)),
      resolveLoader: object(array(string())),
    }),
    plugins: array(instance(Plugin)),
    target: string('web').oneOf([
      'async-node',
      'electron-main',
      'electron-renderer',
      'node',
      'node-webkit',
      'web',
      'webworker',
    ]),
    watch: bool(false),
    node: object(union([bool(), string('mock').oneOf(['mock', 'empty'])], false)),
  };

  it('errors if a non-object is passed', () => {
    expect(() => {
      optimal([], {});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      optimal(123, {});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      // @ts-ignore
      optimal('foo', {});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      optimal(() => {}, {});
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if a non-object is passed as a blueprint', () => {
    expect(() => {
      // @ts-ignore
      optimal({}, 123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if a non-builder is passed within the blueprint', () => {
    expect(() => {
      optimal(
        {},
        {
          // @ts-ignore
          foo: 123,
        },
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if a non-object config is passed', () => {
    expect(() => {
      // @ts-ignore
      optimal({}, blueprint, 123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('sets object keys as class properties', () => {
    const options = optimal<{
      foo: number;
      bar: boolean;
      baz: string;
    }>(
      {
        foo: 123,
        bar: true,
      },
      {
        foo: number(0),
        bar: bool(true),
        baz: string(),
      },
    );

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
    const options = optimal({}, blueprint);

    expect(options).toEqual({
      context: process.cwd(),
      entry: [],
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
      optimal(
        {
          entry: 123,
        },
        blueprint,
      );
    }).toThrowError(
      'Invalid field "entry". Type must be one of: string, array<string>, object<string | array<string>>, function',
    );
  });

  it('runs checks for nested level values', () => {
    expect(() => {
      optimal(
        {
          output: {
            crossOriginLoading: 'not-anonymous',
          },
        },
        blueprint,
      );
    }).toThrowError(
      'Invalid field "output.crossOriginLoading". String must be one of: anonymous, use-credentials',
    );
  });

  it('includes a custom `name` in the error message', () => {
    expect(() => {
      optimal(
        {
          entry: 123,
        },
        blueprint,
        {
          name: 'FooBar',
        },
      );
    }).toThrowError(
      'Invalid FooBar field "entry". Type must be one of: string, array<string>, object<string | array<string>>, function',
    );
  });

  describe('unknown fields', () => {
    it('errors for unknown fields', () => {
      expect(() => {
        optimal(
          {
            foo: 123,
            bar: 456,
          },
          blueprint,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error for unknown fields if `unknown` is true', () => {
      expect(() => {
        optimal(
          {
            foo: 123,
            bar: 456,
          },
          blueprint,
          {
            unknown: true,
          },
        );
      }).not.toThrowError('Unknown fields: foo, bar.');
    });

    it('sets unknown fields', () => {
      expect(
        optimal(
          {
            foo: 123,
            bar: 456,
          },
          blueprint,
          {
            unknown: true,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          foo: 123,
          bar: 456,
        }),
      );
    });
  });

  describe('logical operators', () => {
    it('handles AND', () => {
      const and = {
        foo: string('a').and('bar', 'baz'),
        bar: string('b').and('foo', 'baz'),
        baz: string('c').and('foo', 'bar'),
      };

      // Dont error if all are undefined
      expect(() => {
        optimal(
          {},
          {
            foo: string('a').and('bar', 'baz'),
            bar: string('b').and('foo', 'baz'),
            baz: string('c').and('foo', 'bar'),
          },
        );
      }).not.toThrowError('All of these fields must be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            foo: 'a',
          },
          and,
        );
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        optimal(
          {
            foo: 'a',
            bar: 'b',
          },
          and,
        );
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        optimal(
          {
            foo: 'a',
            baz: 'c',
          },
          and,
        );
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        optimal(
          {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
          and,
        );
      }).not.toThrowError('All of these fields must be defined: foo, bar, baz');
    });

    it('handles OR', () => {
      const or = {
        foo: string('a').or('bar', 'baz'),
        bar: string('b').or('foo', 'baz'),
        baz: string('c').or('foo', 'bar'),
      };

      expect(() => {
        optimal({}, or);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        optimal(
          {
            foo: 'a',
          },
          or,
        );
      }).not.toThrowError('At least one of these fields must be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            bar: 'b',
          },
          or,
        );
      }).not.toThrowError('At least one of these fields must be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            baz: 'c',
          },
          or,
        );
      }).not.toThrowError('At least one of these fields must be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
          or,
        );
      }).not.toThrowError('At least one of these fields must be defined: foo, bar, baz');
    });

    it('handles XOR', () => {
      const xor = {
        foo: string('a').xor('bar', 'baz'),
        bar: string('b').xor('foo', 'baz'),
        baz: string('c').xor('foo', 'bar'),
      };

      expect(() => {
        optimal({}, xor);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        optimal(
          {
            foo: 'a',
          },
          xor,
        );
      }).not.toThrowError('Only one of these fields may be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            bar: 'b',
          },
          xor,
        );
      }).not.toThrowError('Only one of these fields may be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            baz: 'c',
          },
          xor,
        );
      }).not.toThrowError('Only one of these fields may be defined: foo, bar, baz');

      expect(() => {
        optimal(
          {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
          xor,
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
