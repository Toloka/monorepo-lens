import { countGitCommitsSince } from './git-info';

const stubFolders = [__dirname];

describe('git-plugin', () => {
    it('should correctly count commits', async () => {
        const result = await countGitCommitsSince(stubFolders, '10 years ago');

        expect(result[stubFolders[0]]).toBeGreaterThan(0);
    });

    it('should use since option', async () => {
        const result = await countGitCommitsSince(stubFolders, '1 second ago');

        expect(result[stubFolders[0]]).toEqual(0);
    });
});
