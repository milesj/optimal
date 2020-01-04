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
  ObjectOf,
} from '../src';
import { runInProd } from './helpers';

class Plugin {}

describe('Optimal', () => {
  type PrimitiveType = string | number | boolean;
  type ConditionType = string | Function | RegExp | RegExp[] | ObjectOf<RegExp>;

  // This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
  // Webpack provides a pretty robust example of how to use this library.
  const primitive = union<PrimitiveType>([string(), number(), bool()], false);

  const condition = union<ConditionType>(
    [string(), func(), regex(), array(regex()), object(regex())],
    '',
  );

  const rule = shape({
    enforce: string('post').oneOf<'pre' | 'post'>(['pre', 'post']),
    exclude: condition,
    include: condition,
    issuer: condition,
    parser: object(bool()),
    resource: condition,
    use: array(
      union<string | object>(
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

  type EntryType = string | string[] | ObjectOf<string | string[]> | Function;
  type CrossOriginType = 'anonymous' | 'use-credentials';
  type HashType = 'md5' | 'sha256' | 'sha512';
  type NoParseType = RegExp | RegExp[] | Function;
  type TargetType =
    | 'async-node'
    | 'electron-main'
    | 'electron-renderer'
    | 'node'
    | 'node-webkit'
    | 'web'
    | 'webworker';
  type NodeType = 'mock' | 'empty';

  const blueprint = {
    context: string(process.cwd()),
    entry: union<EntryType>(
      [string(), array(string()), object(union([string(), array(string())], '')), func()],
      [],
    ).nullable(),
    output: shape({
      chunkFilename: string('[id].js'),
      chunkLoadTimeout: number(120000),
      crossOriginLoading: union<false | CrossOriginType>(
        [
          bool(false).only(),
          string('anonymous').oneOf<CrossOriginType>(['anonymous', 'use-credentials']),
        ],
        false,
      ),
      filename: string('bundle.js'),
      hashFunction: string('md5').oneOf<HashType>(['md5', 'sha256', 'sha512']),
      path: string(),
      publicPath: string(),
    }),
    module: shape({
      noParse: union<NoParseType | null>([regex(), array(regex()), func()], null).nullable(),
      rules: array(rule),
    }),
    resolve: shape({
      alias: object(string()),
      extensions: array(string()),
      plugins: array(instance(Plugin)),
      resolveLoader: object(array(string())),
    }),
    plugins: array(instance(Plugin)),
    target: string('web').oneOf<TargetType>([
      'async-node',
      'electron-main',
      'electron-renderer',
      'node',
      'node-webkit',
      'web',
      'webworker',
    ]),
    watch: bool(false),
    node: object(
      union<boolean | NodeType>(
        [bool(), string('mock').oneOf<NodeType>(['mock', 'empty'])],
        false,
      ),
    ),
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

  it('errors if a non-predicate is passed within the blueprint', () => {
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
    }).toThrow(
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
    }).toThrowErrorMatchingSnapshot();
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
    }).toThrow(
      'Invalid FooBar field "entry". Type must be one of: string, array<string>, object<string | array<string>>, function',
    );
  });

  describe('production', () => {
    it(
      'sets and returns correct propertes',
      runInProd(() => {
        const options = optimal(
          {
            entry: ['foo.js'],
            output: {
              hashFunction: 'sha256',
            },
            module: {
              noParse: /foo/u,
            },
            // Invalid, should not error
            target: 'unknown',
          },
          blueprint,
        );

        expect(options).toEqual({
          context: process.cwd(),
          entry: ['foo.js'],
          output: {
            chunkFilename: '[id].js',
            chunkLoadTimeout: 120000,
            crossOriginLoading: false,
            filename: 'bundle.js',
            hashFunction: 'sha256',
            path: '',
            publicPath: '',
          },
          module: {
            noParse: /foo/u,
            rules: [],
          },
          resolve: {
            alias: {},
            extensions: [],
            plugins: [],
            resolveLoader: {},
          },
          plugins: [],
          target: 'unknown',
          watch: false,
          node: {},
        });
      }),
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
      }).not.toThrow();
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
      }).not.toThrow();

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
      }).not.toThrow();
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
      }).not.toThrow();

      expect(() => {
        optimal(
          {
            bar: 'b',
          },
          or,
        );
      }).not.toThrow();

      expect(() => {
        optimal(
          {
            baz: 'c',
          },
          or,
        );
      }).not.toThrow();

      expect(() => {
        optimal(
          {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
          or,
        );
      }).not.toThrow();
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
      }).not.toThrow();

      expect(() => {
        optimal(
          {
            bar: 'b',
          },
          xor,
        );
      }).not.toThrow();

      expect(() => {
        optimal(
          {
            baz: 'c',
          },
          xor,
        );
      }).not.toThrow();

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
