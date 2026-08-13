import { defineConfig } from 'tsup';

export default defineConfig({
  // `dist/index.js` is the entrypoint declared in action.yml. The runner checks
  // out this repository without node_modules, so everything must be bundled.
  entry: { index: 'src/main.ts' },
  format: ['esm'],
  platform: 'node',
  target: 'node24',
  // No sourcemap and no minify: the bundle is committed, so readable output
  // keeps stack traces useful without adding a second large file to every diff.
  sourcemap: false,
  clean: true,
  dts: false,
  shims: false,
  minify: false,
  noExternal: [/.*/],
  banner: {
    // Bundled CommonJS dependencies (e.g. `tunnel`) call `require` at load time.
    // The ESM output has no `require`, so provide a real one.
    js: [
      "import { createRequire as __createRequire } from 'node:module';",
      'const require = __createRequire(import.meta.url);',
    ].join('\n'),
  },
});
