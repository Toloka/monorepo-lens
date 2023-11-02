/* eslint-disable no-undef */
import { ReportInfo } from '../model/lensResult';

export const getRepoState = async (): Promise<ReportInfo> => {
    const res: ReportInfo = {
        // @ts-ignore defined by vite
        lenses: __LENSES__,
        // @ts-ignore defined by vite
        packages: __PACKAGES__,
        dependencies: {}
    };

    for (const pkg of res.packages) {
        const allDeps = [...pkg.dependencies, ...pkg.devDependencies];
        const inRepoDeps = allDeps.filter((name) => res.packages.find((item) => item.name === name));

        res.dependencies[pkg.name] = inRepoDeps;
    }

    return res;
};
