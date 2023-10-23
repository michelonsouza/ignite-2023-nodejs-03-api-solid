/* eslint-disable import/no-extraneous-dependencies */
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    threads: false,
  },
  plugins: [tsConfigPaths()],
});
