# Optimal v0.14.0
[![Build Status](https://travis-ci.org/milesj/optimal.svg?branch=master)](https://travis-ci.org/milesj/optimal)

Options object builder and validator.

## Usage

Pass a plain object and a blueprint to `Options`. The blueprint defines every property,
its type, and its value within the options object.

The plain object is then validated, built, and returned.

```js
import Options, { bool, string, number, func } from 'optimal';

const options = new Options({
  bool: false,
  number: 10,
  object: {
    foo: 'A',
  },
}, {
  bool: bool(true),
  string: string('foo'),
  number: number(5).between(0, 10),
  func: func(),
  object: {
    foo: string('a').oneOf(['a', 'b', 'c']),
    bar: string('b'),
  },
}));

/*
{
  bool: false,
  string: 'foo',
  number: 10,
  func: null,
  object: {
    foo: 'A',
    bar: 'b',
  },
}
*/

const {
  string, // foo
  number, // 10
} = options;
```
