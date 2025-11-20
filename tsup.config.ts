import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/admin.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  clean: true,
  dts: false,
  shims: false,
  minify: false,
  skipNodeModulesBundle: true,
});
