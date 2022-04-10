import * as path from 'path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import rollupReplace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        rollupReplace({
            preventAssignment: true,
            values: {
                __DEV__: JSON.stringify(true),
                'process.env.NODE_ENV': JSON.stringify('development'),
            },
        }),
        solid(),
    ],
    resolve: process.env.USE_SOURCE
        ? {
              alias: {
                  '@tanstack/solid-table': path.resolve(
                      __dirname,
                      '../../packages/solid-table/src/index.ts'
                  ),
              },
          }
        : {},
})
