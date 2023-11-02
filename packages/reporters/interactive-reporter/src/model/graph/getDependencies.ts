import { mapObject } from '../../lib/mapObject';

export type DirectDependencies = { [pkg: string]: string[] /* direct deps*/ };
export type AllDependencies = { [pkg: string]: string[] /* all deps*/ };
export type AllConsumers = { [pkg: string]: string[] /* all consumers */ };

export const getDependencies = (graph: DirectDependencies, from: string, visited = new Set<string>()) => {
    if (visited.has(from)) {
        return visited;
    }

    visited.add(from);

    const deps = graph[from];

    for (const dep of deps) {
        getDependencies(graph, dep, visited);
    }

    return visited;
};

export const getAllDependenciesBulk = (graph: DirectDependencies): AllDependencies => {
    return mapObject(graph, (_, pkg) => {
        const allDeps = getDependencies(graph, pkg);

        allDeps.delete(pkg);

        return [...allDeps];
    });
};

export const getAllConsumersBulkFast = (allDependencies: AllDependencies): AllConsumers => {
    const pkgList = Object.keys(allDependencies);

    return mapObject(allDependencies, (_, pkg) => {
        return pkgList.filter((x) => allDependencies[x].includes(pkg));
    });
};

export const getAllConsumersBulk = (graph: DirectDependencies): AllConsumers => {
    const allDependencies = getAllDependenciesBulk(graph);

    return getAllConsumersBulkFast(allDependencies);
};
