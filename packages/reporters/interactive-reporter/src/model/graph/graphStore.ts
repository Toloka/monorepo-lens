import { makeAutoObservable } from 'mobx';
import { Edge, Node } from 'react-flow-renderer';

import { ReportInfo } from '../lensResult';

import {
    AllConsumers,
    AllDependencies,
    DirectDependencies,
    getAllConsumersBulkFast,
    getAllDependenciesBulk
} from './getDependencies';
import { graphToReactflow } from './graphToReactflow';

export type Graph = {
    nodes: Node[];
    edges: Edge[];
};

export type GraphAggregations = {
    allDependencies: AllDependencies;
    allConsumers: AllConsumers;
    directDependencies: DirectDependencies;
};

export const createGraphStore = (repoDTO: ReportInfo) => {
    const fullGraph: Graph = makeAutoObservable(graphToReactflow(repoDTO.dependencies));

    const allDependencies = getAllDependenciesBulk(repoDTO.dependencies);
    const allConsumers = getAllConsumersBulkFast(allDependencies);
    const graphAggregations: GraphAggregations = {
        directDependencies: repoDTO.dependencies,
        allDependencies,
        allConsumers
    };

    return { fullGraph, graphAggregations };
};
