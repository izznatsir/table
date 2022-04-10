import { build } from 'esbuild'
import babel from '@chialab/esbuild-plugin-babel'

const formats = [
    ['cjs', '.cjs'],
    ['esm', '.mjs'],
]

function main() {
    formats.forEach(async (format) => {
        await build({
            bundle: true,
            entryPoints: ['packages/table-core/src/index.ts'],
            format: format[0],
            outdir: 'packages/table-core/dist',
            outExtension: { '.js': format[1] },
            sourcemap: true,
            write: true,
        })

        await build({
            bundle: true,
            entryPoints: ['packages/table-solid/src/index.tsx'],
            external: ['solid-js'],
            format: format[0],
            outdir: 'packages/table-solid/dist',
            outExtension: { '.js': format[1] },
            plugins: [
                babel({
                    presets: ['@babel/preset-typescript', 'babel-preset-solid'],
                }),
            ],
            sourcemap: true,
            write: true,
        })
    })
}

main()
