import currentGitBranch from 'current-git-branch'
import { examplesDir, packages, rootDir, npm_tags } from './config.js'
import { getGitLog } from './get-git-log.js'

/**
 * @param {string} version
 * @returns {string}
 */
function create_commit_message(version) {
    return `release: v${version}`
}

/**
 * @param {string} npm_tag - NPM version tag assoicated with the branch
 * @returns { import('./types').BranchReleaseConfig }
 */
function create_release_config(npm_tag) {
    const config = {
        pre_release: false,
        github_release: false,
    }

    switch (npm_tag) {
        case 'latest': {
            config.github_release = true
        }
        case 'beta':
        case 'alpha':
        case 'next': {
            config.pre_release = true
            config.github_release = true
        }
        default:
    }

    return config
}

function main() {
    /** @type {string | false} */
    const branch = process.env.BRANCH
        ? process.env.BRANCH
        : process.env.PR_NUMBER
        ? `pr-${process.env.PR_NUMBER}`
        : currentGitBranch()

    console.log(branch)
    if (!branch) return

    /** @type {import('./types').NpmTag | undefined} */
    const npm_tag = npm_tags[branch]

    if (!npm_tag) return

    const branch_release_config = create_release_config(npm_tag)

    getGitLog()

    // TODO: Check branch changes since last release, skip if RELEASE_ALL flag is set

    // TODO: Build packages

    // TODO: Generate changelog

    // TODO: Publish
}

main()
