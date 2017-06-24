# Optimal [DEV]

Options object builder and validator.

## Usage

Pass a plain object and a factory function to `Options`. The factory defines a
blueprint for every property, and its value, within the options object.

The plain object is then validated, built, and returned.

```js
const baseOptions = {
  bool: false,
  number: 10,
};

const options = new Options(baseOptions, ({ bool, string, number, func }) => ({
  bool: bool(true),
  string: string('foo').notEmpty(),
  number: number(5).between(0, 10),
  func: func(),
}));

/*
{
  bool: true,
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
