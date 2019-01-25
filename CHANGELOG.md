# Changelog

# 2.0.0

#### 💥 Breaking

- TypeScript minimum version requirement is now 3.0.
- TypeScript has been rewritten to infer builder types and structures as best it can. This may cause
  unexpected inferrence for `optimal` usage and may require explicit generic types to be passed.
  Some caveats:
  - Union types are not inferrable and are typed as `any`.
  - String enums (`oneOf()`) are not inferrable and are typed as `string`.
- `CollectionBuilder` has split into `ArrayBuilder` and `ObjectBuilder`. `array()` and `object()`
  are still the same.
- `shape()` default value is now `null` instead of an empty object, but the structure should be
  auto-built based on the defined builder.

#### 🚀 New

- Added a `file` option to `optimal` to include in error messages.

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
