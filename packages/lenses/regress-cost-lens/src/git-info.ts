import simpleGit from 'simple-git';

export async function countGitCommitsSince(
    folders: string[],
    since: string = '1 month ago'
): Promise<Record<string, number>> {
    const git = simpleGit();

    const countedCommitsEntries = await Promise.all(
        folders.map(async (folder) => {
            const revListInfo = await git.raw(
                'rev-list',
                '--count',
                'HEAD',
                '--no-merges',
                `--since="${since}"`,
                folder
            );

            return [folder, Number(revListInfo)];
        })
    );

    return Object.fromEntries(countedCommitsEntries);
}
