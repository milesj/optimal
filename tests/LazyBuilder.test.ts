import { object, shape, lazy, array } from '../src';

describe('LazyBuilder', () => {
  interface Node {
    children: Node[];
    parent: Node | null;
  }

  const node = shape({
    children: array(lazy(() => node)),
    parent: lazy(() => node),
  });
});
