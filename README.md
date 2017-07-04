# Optimal v0.0.0
[![Build Status](https://travis-ci.org/milesj/optimal.svg?branch=master)](https://travis-ci.org/milesj/optimal)

Options object builder and validator.

## Usage

Pass a plain object and a factory function to `Options`. The factory defines a
blueprint for every property, and its value, within the options object.

The plain object is then validated, built, and returned.

```js
const baseOptions = {
  bool: false,
  number: 10,
  object: {
    foo: 'b',
  },
};

const options = new Options(baseOptions, (o) => ({
  bool: o.bool(true),
  string: o.string('foo'),
  number: o.number(5).between(0, 10),
  func: o.func(),
  object: {
    foo: o.string().oneOf(['a', 'b', 'c']),
  },
}));

/*
{
  bool: false,
  string: 'foo',
  number: 10,
  func: null,
}
*/

const {
  string, // foo
  number, // 10
} = options;
```
