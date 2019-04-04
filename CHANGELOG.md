# 3.0.0 - 2019-04-03

#### 🚀 New

- Added a `builder()` predicate, which checks that a property value is a `Builder` instance.
- Added a `blueprint()` predicate, which checks that a property is an object of `Builder`s.

#### 🛠 Internal

- Updated to `@babel/runtime-corejs3`, which uses Babel v7.4 and CoreJS v3.
- TS: Updated `optimal` to return the shape wrapped in `Required`.
- TS: Updated `Blueprint` to remove optional properties (acts like `Required`).
- TS: Updated `Builder#custom` to infer the value argument based on the builder type.
- TS: Replaced some usage of `any` with `unknown`.

# 2.1.1 - 2019-02-07

#### 🐞 Fixed

- Fixed some inheritance issues for instance of checks in loose mode.

# 2.1.0 - 2019-02-06

#### 🚀 New

- Removed docblocks from source files to reduce bundle size.

# 2.0.0 - 2019-01-30

#### 💥 Breaking

- TypeScript minimum version requirement is now 3.0.
- TypeScript has been rewritten to infer builder types and structures as best it can. This may cause
  unexpected inferrence for `optimal()` usage and may require explicit generic types to be passed.
- Nested blueprints must now use `shape()` instead of a plain object.
- Collections have split into `ArrayBuilder` and `ObjectBuilder`. `array()` and `object()` are still
  the same.
- `Builder#nullable` no longer accepts an argument and instead enables nulls.
- `custom()`
  - Default value is now required at all times.
  - TS: Type will be inferred by the default value. Can be explicitly typed using generics.
- `shape()`
  - Default value has been removed (since it's inferred by nested blueprint structure).
- `string()`
  - String logic has been reversed, as they are now empty by default, instead of not empty. To
    enable the old logic, use the `notEmpty()` method.
  - The `empty()` method has been removed.
- `union()`
  - Default value is now required at all times.
  - TS: Type is `any` as unions are not inferrable. Can be explicitly typed using generics.

#### 🚀 New

- Added documentation.
- Added a `file` option to `optimal()` to include in error messages.
- Added a `predicates` export from the index, which is an object of all builder factory functions.
  - TS: Also added a `Predicates` type representing this shape.
- Added a `loose` option to `instance()`, so cross-realm instance checks work (compares constructor
  name).
- Added `Builder#notNullable` to disable null values.
- Added `StringBuilder#notEmpty` to require strings to not be empty.

#### 🛠 Internal

- TS: Removed `Struct` type.

# 1.2.0 - 2018-12-29

#### 🚀 New

- Added and ES `module` target.

# 1.1.3 - 2018-10-15

#### 🐞 Fixed

- Fixed an issue with built files.

# 1.1.2 - 2018-10-15

#### 🐞 Fixed

- Updated `shape` to return an object with inherited or default values, instead of an empty object.

# 1.1.1 - 2018-09-02

#### 🐞 Fixed

- Fixed an issue with built declaration files.

# 1.1.0 - 2018-09-02

#### 🚀 New

- Switched to Babel 7 as the transpiler. Bumped IE requirement to v11, and Node requirement to v8.9.

# 1.0.0 - 2018-06-07

#### 🎉 Release

- Initial release.
