export interface Package {
    name: string
    dir: string
    deps?: string[]
}

export type NpmTag = 'latest' | 'beta' | 'alpha' | 'next'

export type NpmTags = {
    [Branch: string]: NpmTag
}

export interface BranchReleaseConfig {
    pre_release: boolean
    github_release: boolean
}
