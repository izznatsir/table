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
})
