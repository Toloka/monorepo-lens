import { ICollectorResult } from '@monorepo-lens/schemas';

import lens from './regress-cost-lens';

const stubCollectorResult: ICollectorResult = [
    {
        name: '@monorepo-lens/stub-lens',
        location: '/Users/test-user/project/packages/lenses/stub-lens',
        dependencies: ['@monorepo-lens/git-plugin', '@monorepo-lens/schemas'],
        devDependencies: ['@monorepo-lens/dev', 'typescript']
    },
    {
        name: '@monorepo-lens/regress-cost-lens',
        location: '/Users/test-user/project/packages/lenses/regress-cost-lens',
        dependencies: ['@monorepo-lens/git-plugin', '@monorepo-lens/schemas'],
        devDependencies: ['@monorepo-lens/dev', 'typescript']
    },
    {
        name: '@monorepo-lens/git-plugin',
        location: '/Users/test-user/project/packages/plugins/git-plugin',
        dependencies: ['@monorepo-lens/schemas', 'simple-git'],
        devDependencies: ['@monorepo-lens/dev', 'typescript']
    }
];

jest.mock('./git-info', () => ({
    countGitCommitsSince: jest.fn().mockResolvedValue({
        '/Users/test-user/project/packages/lenses/stub-lens': 5,
        '/Users/test-user/project/packages/lenses/regress-cost-lens': 5,
        '/Users/test-user/project/packages/plugins/git-plugin': 10
    })
}));

describe('regress-cost-lens', () => {
    it('should produce right info', async () => {
        const result = await lens(stubCollectorResult, {});

        expect(result.name).toEqual('regress-cost');
        expect(result.values['@monorepo-lens/git-plugin']).toEqual({ value: 20 });
    });
});
