import * as path from 'path'

/** @type { import('./types').Package[] } */
const packages = [
    { name: '@natstack/table-core', dir: 'packages/table-core' },
    { name: '@natstack/table-solid', dir: 'packages/table-solid', deps: ['@natstack/table-core'] },
]

/**
 * @type { import('./types').NpmTags }
 *
 * GIT branches to NPM version tags mapping.
 **/
const npm_tags = {
    main: 'latest',
    beta: 'beta',
    alpha: 'alpha',
    next: 'next',
}

// Project root directory absolute path.
const rootDir = path.resolve(import.meta.url, '../../..')
const examplesDir = path.resolve(rootDir, 'examples')

export { examplesDir, packages, rootDir, npm_tags }
