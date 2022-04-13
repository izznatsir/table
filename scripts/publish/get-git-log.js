import { execSync } from 'child_process'

/**
 * @param { Buffer } buffer
 * @returns { string }
 */
function parseGitLogBuffer(buffer) {
    return buffer.toString()
}

/**
 * @param { string } [range] - Commit or tag range to log.
 * @returns { Buffer }
 */
function getRawGitLog(range) {
    const args = ['--decorate']

    if (range) {
        args.push(range)
    }

    console.log(`git log ${args.join(' ')}`)
    return execSync(`git log ${args.join(' ')}`)
}

/**
 * @param { string } [range] - Commit or tag range to log.
 */
export function getGitLog(range) {
    const buffer = getRawGitLog(range)
    return parseGitLogBuffer(buffer)
}
