import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [ 'src/index.mts' ],
  format: [ 'esm', 'cjs' ],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
});
