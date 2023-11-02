import { action, makeAutoObservable } from 'mobx';
import { Edge, Node } from 'react-flow-renderer';

import { Filter } from '../package/filtersStore';

import { DirectDependencies } from './getDependencies';
import { Graph, GraphAggregations } from './graphStore';

export type ActiveEdge = Edge & { isTransitive?: boolean };

export type ActiveGraph = {
    nodes: Node[];
    edges: ActiveEdge[];
    normalEdges: ActiveEdge[];
    relaxedEdges: ActiveEdge[];
    edgeMode: 'normal' | 'relaxed';
};

const relax = (
    graphAggregations: GraphAggregations,
    isActive: (pkg: string) => boolean,
    pkg: string,
    currentDirectDeps: string[]
    // eslint-disable-next-line max-params
) => {
    const allDeps = graphAggregations.allDependencies[pkg].filter((dep) => isActive(dep));
    const directDeps = currentDirectDeps.filter((dep) => isActive(dep));

    const canBeReachedViaDirectDeps = directDeps.reduce((acc, dep) => {
        return new Set([...acc, ...graphAggregations.allDependencies[dep]]);
    }, new Set<string>());

    const relaxedDeps = new Set(allDeps);

    for (const transitiveDep of canBeReachedViaDirectDeps) {
        relaxedDeps.delete(transitiveDep);
    }

    return [...relaxedDeps];
};

export const createActiveGraphStore = (fullGraph: Graph, graphAggregations: GraphAggregations, filter: Filter) => {
    const isActive = (pkg: string) => filter.packages[pkg];

    const activeGraph: ActiveGraph = makeAutoObservable({
        get nodes() {
            const nodes = fullGraph.nodes.filter((n) => isActive(n.id));

            return nodes;
        },
        get edges() {
            if (activeGraph.edgeMode === 'normal') {
                return this.normalEdges;
            }

            return this.relaxedEdges;
        },
        get normalEdges() {
            const edges = fullGraph.edges.filter((e) => isActive(e.source) && isActive(e.target));

            return edges;
        },
        get relaxedEdges() {
            const edges: ActiveEdge[] = [];
            const nodes = activeGraph.nodes;

            const newDeps: DirectDependencies = {};

            for (const n of nodes) {
                // no duplicate direct edges, but might have duplicate transitive edges
                newDeps[n.id] = relax(graphAggregations, isActive, n.id, graphAggregations.directDependencies[n.id]);
            }

            for (const n of nodes) {
                // no transitive edges too
                newDeps[n.id] = relax(graphAggregations, isActive, n.id, newDeps[n.id]);
            }

            for (const n of nodes) {
                for (const dep of newDeps[n.id]) {
                    const isTransitive = !fullGraph.edges.some((x) => x.source === n.id && x.target === dep);

                    if (activeGraph.edgeMode === 'relaxed' && isTransitive) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    edges.push({
                        id: `${n.id}->${dep}`,
                        source: n.id,
                        target: dep,
                        style: { stroke: isTransitive ? 'rgba(185,185, 255, 0.5)' : undefined },
                        isTransitive
                    });
                }
            }

            return edges;
        },
        edgeMode: 'relaxed'
    });

    return activeGraph;
};

export const toggleRelaxedMode = action((store: ActiveGraph) => {
    if (store.edgeMode === 'relaxed') {
        store.edgeMode = 'normal';
    } else {
        store.edgeMode = 'relaxed';
    }
});
