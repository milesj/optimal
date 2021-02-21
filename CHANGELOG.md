### 4.3.0 - 2020-02-20

#### 🚀 Updates

- Improved error messages by including the currently invalid value.

#### 🐞 Fixes

- Fixed an issue where arrays and tuples were used at the same time in a union.

#### 🛠 Internals

- Updated union error messages to be more readable.
- Updated tuple type aliases to use "tuple<value>".

### 4.2.1 - 2020-02-11

#### 🐞 Fixes

- Fixed some object comparison checks that would fail cross-realm.

## 4.2.0 - 2020-01-26

#### 🚀 Updates

- Reworked default values to handle undefined and null by default, and in a much better fashion.

### 4.1.2 - 2020-01-26

#### 🐞 Fixes

- **[shape]** Reset schema state after validating children.
- **[array,object,string]** Updated empty checks to take nullable into account.

### 4.1.1 - 2020-01-24

#### 🐞 Fixes

- **[func]** Removed the generic constraint as it is too restrictive.

## 4.1.0 - 2020-01-20

#### 🚀 Updates

- Added `Schema#currentPath`, `currentValue`, `initialStruct`, `parentPath`, and `parentStruct`
  properties. Should make custom tree checks much easier.
- Added `Predicate#doRun`, so that sub-classes can hook into the run process.

#### 🐞 Fixes

- **[shape,tuple]** Fixed an issue where common predicate checks were not always running.

### 4.0.1 - 2020-01-19

#### 🐞 Fixes

- **[tuple]** Fixed some array type check failures.
- **[tuple]** Fixed tuples failing to validate when in a `union`.

# 4.0.0 - 2020-01-07

#### 💥 Breaking

- Updated Node.js requirement to v10.
- Values are now type cast once all checks and validations have ran. This may cause unexpected
  results in production, but is not exactly breaking.
- Updated `custom()` callbacks to receive a `Schema` as the 2nd argument instead of a struct object.
- Removed and inlined all `check*` methods as we don't want them publicly chainable.
- Renamed `Builder` to `Predicate` for all classes.
- Renamed `Builder#runChecks()` method to `Predicate#run()` and reworked the arguments.
- Renamed `builder()` to `predicate()`.
- **[ts]** Added visibility modifiers to many internal properties and methods.

#### 🚀 Updates

- Add new `Schema` class for handling the building and validation of structs.
- Add new `tuple()` predicate .
- Add support for default values via factory functions.
- Add `Predicate#default()` to return the default value.
- Add `Predicate#validate()` to run stand-alone validation with a predicate.
- **[array,object,string]** Add `sizeOf()` method.
- **[number]** Add `float()`, `int()`, `negative()`, and `positive()` methods.
- **[string]** Add `lowerCase()` and `upperCase()` methods.

#### ⚙️ Types

- Updated `object()` and `ObjectOf` to support mapped types through a keys generic.

#### 🛠 Internals

- Package is now built with Rollup to reduce filesize.

## 3.4.0 - 2019-12-28

#### 🚀 Updates

- Add `never()` for all predicates.
- **[bool]** Add `onlyFalse()` and `onlyTrue()` methods.
- **[string]** Add `camelCase()`, `kebabCase()`, `pascalCase()`, and `snakeCase()` methods.

#### ⚙️ Types

- Update `CustomCallback` with a struct generic.

#### 📦 Dependencies

- Update to latest.

## 3.3.0 - 2019-12-02

#### ⚙️ Types

- Refined types and replaced `any` with `unknown`.

## 3.2.1 - 2019-04-22

#### 🐞 Fixes

- Fixed some build issues.

## 3.2.0 - 2019-04-20

#### 🚀 Updates

- Added a `prefix` option to `optimal`, which customizes the initial object path prefix for errors.
- Builder methods can now return a value to mutate the value being checked.

#### 🐞 Fixes

- Shapes within arrays, objects, or unions are now returned with the full object.

#### 🛠 Internals

- Updated `ShapeBuilder` to call `optimal` internally, as the APIs are very similar.
- Removed `@babel/runtime-corejs3` as it wasn't saving much space.

### 3.1.1 - 2019-04-13

#### 🐞 Fixes

- Updated `StringBuilder#contains` and `StringBuilder#match` to only check when the passed value is
  not the default value _or_ the field is required.

## 3.1.0 - 2019-04-07

#### 🚀 Updates

- Added `ShapeBuilder#exact`, which throws on unknown fields and requires an exact shape.
- Updated `UnionBuilder` to support builders of the same type in parallel. For example, can now use
  2 instances of `object()`.
- Updated `UnionBuilder` to support object and shapes in parallel.
- TS: Updated `instance()` to allow abstract classes.

# 3.0.0 - 2019-04-03

#### 🚀 Updates

- Added a `builder()` predicate, which checks that a property value is a `Builder` instance.
- Added a `blueprint()` predicate, which checks that a property is an object of `Builder`s.

#### 🛠 Internals

- Updated to `@babel/runtime-corejs3`, which uses Babel v7.4 and CoreJS v3.
- TS: Updated `optimal` to return the shape wrapped in `Required`.
- TS: Updated `Blueprint` to remove optional properties (acts like `Required`).
- TS: Updated `Builder#custom` to infer the value argument based on the builder type.
- TS: Replaced some usage of `any` with `unknown`.

### 2.1.1 - 2019-02-07

#### 🐞 Fixes

- Fixed some inheritance issues for instance of checks in loose mode.

## 2.1.0 - 2019-02-06

#### 🚀 Updates

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

#### 🚀 Updates

- Added documentation.
- Added a `file` option to `optimal()` to include in error messages.
- Added a `predicates` export from the index, which is an object of all builder factory functions.
  - TS: Also added a `Predicates` type representing this shape.
- Added a `loose` option to `instance()`, so cross-realm instance checks work (compares constructor
  name).
- Added `Builder#notNullable` to disable null values.
- Added `StringBuilder#notEmpty` to require strings to not be empty.

#### 🛠 Internals

- TS: Removed `Struct` type.

## 1.2.0 - 2018-12-29

#### 🚀 Updates

- Added and ES `module` target.

### 1.1.3 - 2018-10-15

#### 🐞 Fixes

- Fixed an issue with built files.

### 1.1.2 - 2018-10-15

#### 🐞 Fixes

- Updated `shape()` to return an object with inherited or default values, instead of an empty
  object.

### 1.1.1 - 2018-09-02

#### 🐞 Fixes

- Fixed an issue with built declaration files.

## 1.1.0 - 2018-09-02

#### 🚀 Updates

- Switched to Babel 7 as the transpiler. Bumped IE requirement to v11, and Node requirement to v8.9.

# 1.0.0 - 2018-06-07

#### 🎉 Release

- Initial release.
