import { build } from 'esbuild'
import babel from '@chialab/esbuild-plugin-babel'

async function main() {
    await build({
        bundle: true,
        entryPoints: ['packages/table-core/src/index.ts'],
        format: 'esm',
        outdir: 'packages/table-core/dist',
        sourcemap: true,
        write: true,
    })

    await build({
        bundle: true,
        entryPoints: ['packages/table-solid/src/index.tsx'],
        external: ['solid-js'],
        format: 'esm',
        outdir: 'packages/table-solid/dist',
        plugins: [
            babel({
                presets: ['@babel/preset-typescript', 'babel-preset-solid'],
            }),
        ],
        sourcemap: true,
        write: true,
    })
}

main()
