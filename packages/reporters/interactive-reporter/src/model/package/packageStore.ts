import { ILenseResult } from '@monorepo-lens/schemas';
import { makeAutoObservable } from 'mobx';

import { mapObject } from '../../lib/mapObject';
import { GraphAggregations } from '../graph/graphStore';
import { ReportInfo } from '../lensResult';

type PackageLens = Omit<ILenseResult, 'values'> & { value: number; comment?: string };

export type Package = {
    name: string;
    directDependencies: string[];
    allDependencies: string[];
    allConsumers: string[];

    lens: { [name: string]: PackageLens };
};

export type Packages = { [name: string]: Package };

export const createPackageStore = (repoDTO: ReportInfo, graphAggregations: GraphAggregations) => {
    const packages: Packages = makeAutoObservable(
        mapObject(repoDTO.dependencies, (deps, pkg): Package => {
            const thisPkgLens = repoDTO.lenses.map((lense) => ({ ...lense, ...lense.values[pkg] }));
            const lens2value: Package['lens'] = {};

            for (const lens of thisPkgLens) {
                lens2value[lens.name] = lens;
            }

            return {
                name: pkg,
                directDependencies: deps,
                allDependencies: graphAggregations.allDependencies[pkg],
                allConsumers: graphAggregations.allConsumers[pkg],
                lens: lens2value
            };
        })
    );

    return packages;
};
