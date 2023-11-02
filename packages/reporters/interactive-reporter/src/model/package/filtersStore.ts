import { action, makeAutoObservable } from 'mobx';

import { mapObject } from '../../lib/mapObject';
import { autoLayout } from '../graph/autoLayout';
import { Store } from '../store';

import { Lens } from './lensStore';
import { Packages } from './packageStore';

export type Filter = {
    query: string;
    sortBy: 'name' | 'lens';
    packages: {
        [name: string]: boolean;
    };
    options: string[];
};

export const createFiltersStore = (packages: Packages, lens: Lens): Filter => {
    const packageNames = Object.keys(packages);

    const filter: Filter = makeAutoObservable({
        query: '',
        sortBy: 'name',
        packages: mapObject(packages, () => true),
        get options() {
            const options = packageNames.filter((x) => x.includes(this.query));

            const activeLens = lens.active === 'none' ? undefined : lens.options.find((x) => x.name === lens.active);

            if (filter.sortBy === 'lens' && activeLens && activeLens.type === 'heat') {
                options.sort((pkgNameA, pkgNameB) => {
                    return activeLens.values[pkgNameB].value - activeLens.values[pkgNameA].value;
                });
            }

            return options;
        }
    });

    return filter;
};

export const clearFilter = action((store: Filter) => {
    for (const pkg in store.packages) {
        store.packages[pkg] = false;
    }
});

export const setFilter = action((store: Store, newPackages: string[]) => {
    clearFilter(store.filter);

    for (const pkg of newPackages) {
        store.filter.packages[pkg] = true;
    }

    autoLayout(store);
});

const removeOwnDeps = action((store: Store, pkg: string) => {
    store.filter.packages[pkg] = false;

    const activePackages = store.activeGraph.nodes
        .map((x) => x.data.pkgName)
        .filter((x) => x !== pkg) // since we want to remove this package dep we no longer consider it a valid parent
        .map((x) => store.packages[x]);

    console.log('RM', { pkg, act: activePackages.map((x) => x.name) });

    const deps = store.packages[pkg].directDependencies;

    const activeDeps = new Set(activePackages.map((x) => x.directDependencies).flat());
    const toRemove = new Set<string>();

    for (const dep of deps) {
        if (!activeDeps.has(dep)) {
            toRemove.add(dep);
        }
    }

    for (const pkgToRemove of toRemove) {
        store.filter.packages[pkgToRemove] = false;
        removeOwnDeps(store, pkgToRemove);
    }
});

export const removeOwnDepsFromGraph = action((store: Store, pkg: string) => {
    removeOwnDeps(store, pkg);
    autoLayout(store);
});
