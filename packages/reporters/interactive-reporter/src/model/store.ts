import { makeAutoObservable } from 'mobx';

import { ActiveGraph, createActiveGraphStore } from './graph/activeGraphStore';
import { createGraphStore, Graph } from './graph/graphStore';
import { ReportInfo } from './lensResult';
import { createFiltersStore, Filter } from './package/filtersStore';
import { createLensStore, Lens } from './package/lensStore';
import { createPackageStore, Packages } from './package/packageStore';

export type Store = {
    fullGraph: Graph;
    activeGraph: ActiveGraph;
    packages: Packages;
    filter: Filter;
    lens: Lens;
    get minMaxLensValue(): [number, number];
};

export const createStore = (repoDTO: ReportInfo) => {
    const { fullGraph, graphAggregations } = createGraphStore(repoDTO);
    const lens = createLensStore(repoDTO);
    const packages = createPackageStore(repoDTO, graphAggregations);
    const filter = createFiltersStore(packages, lens);
    const activeGraph = createActiveGraphStore(fullGraph, graphAggregations, filter);

    const store: Store = makeAutoObservable({
        fullGraph,
        activeGraph,
        packages,
        filter,
        lens,
        get minMaxLensValue() {
            return Object.values(store.packages).reduce<[number, number]>(
                ([min, max], { lens }) => {
                    if (lens[store.lens.active].value < min) {
                        // eslint-disable-next-line no-param-reassign
                        min = lens[store.lens.active].value;
                    }
                    if (lens[store.lens.active].value > max) {
                        // eslint-disable-next-line no-param-reassign
                        max = lens[store.lens.active].value;
                    }

                    return [min, max];
                },
                [Infinity, -Infinity]
            );
        }
    });

    return store;
};
