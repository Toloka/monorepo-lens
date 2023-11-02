import { ELenseType, ILenseResult, Lense } from '@monorepo-lens/schemas';

import { countGitCommitsSince } from './git-info';

const lens: Lense = async (collectorResult, options) => {
    const gitInfo = await countGitCommitsSince(
        collectorResult.map((pkg) => pkg.location),
        options.since
    );
    const monorepoPackages = new Set(collectorResult.map((pkg) => pkg.name));
    const dependentMap = collectorResult.reduce<Record<string, Set<string>>>((acc, pkg) => {
        addDepsToSetMap(pkg.name, pkg.dependencies, acc);
        addDepsToSetMap(pkg.name, pkg.devDependencies, acc);

        return acc;
    }, {});

    const values = collectorResult.reduce<ILenseResult['values']>((acc, pkg) => {
        const dependentPackages = Array.from(dependentMap[pkg.name] || []).filter((dep) => monorepoPackages.has(dep));

        acc[pkg.name] = {
            value: dependentPackages.length * gitInfo[pkg.location]
        };

        return acc;
    }, {});

    return {
        name: 'regress-cost',
        type: ELenseType.heat,
        values
    };
};

function addDepsToSetMap(pkgName: string, deps: string[], setMap: Record<string, Set<string>>) {
    deps.forEach((dep) => {
        if (!setMap[dep]) {
            setMap[dep] = new Set();
        }
        setMap[dep].add(pkgName);
    });
}

export default lens;
