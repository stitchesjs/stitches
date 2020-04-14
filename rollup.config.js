import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pascalCase from 'pascal-case';
import pkg from './package.json';

export default {
  input: 'es/index.js',
  output: {
    name: pascalCase(pkg.name),
    file: 'dist/bundle.js',
    format: 'umd',
    exports: 'named',
    sourcemap: true,
    amd: {
      id: pkg.name,
    },
  },
  plugins: [sourcemaps(), nodeResolve(), nodeGlobals(), nodeBuiltins(), commonjs(), terser()],
};
