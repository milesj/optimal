import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
    },
    {
      file: 'esm/index.js',
      format: 'esm',
    },
  ],
  plugins: [
    resolve({ extensions }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
};
