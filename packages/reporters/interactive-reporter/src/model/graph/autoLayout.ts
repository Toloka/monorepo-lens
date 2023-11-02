import { graphviz, wasmFolder } from '@hpcc-js/wasm';
import { action } from 'mobx';
import { Node, Edge } from 'react-flow-renderer';

import { Store } from '../store';

type PostitionMap = { [nodeId: string]: { x: number; y: number } };

wasmFolder('./wasm');

const applyAutoLayout = action((store: Store, positionMap: PostitionMap) => {
    for (const n of store.fullGraph.nodes) {
        const newPos = positionMap[n.id];

        n.position.x = newPos?.x || n.position.x;
        n.position.y = newPos?.y || n.position.y;
    }
});

const sanitize = (p: string) => p.replace('@', '').replaceAll('-', '_').replaceAll('/', '__');

const getCluster = (nodeId: string) => {
    if (nodeId.endsWith('app')) {
        return nodeId;
    }

    if (nodeId.startsWith('@toloka-requester/page')) {
        return 'requester-pages';
    }
    if (nodeId.startsWith('@toloka-worker/page')) {
        return 'worker-pages';
    }
    if (nodeId.startsWith('@toloka-requester/')) {
        return 'requester';
    }
    if (nodeId.startsWith('@toloka-worker/')) {
        return 'worker';
    }

    return 'none';
};

const graphToDot = (graph: { nodes: Node[]; edges: Edge[] }) => {
    const clusters = graph.nodes.reduce((acc, n) => {
        const cluster = getCluster(n.id);

        acc[cluster] = acc[cluster] || [];
        acc[cluster].push(n.id);

        return acc;
    }, {} as { [scope: string]: string[] });

    const scopesDot = Object.keys(clusters)
        .filter((cluster) => cluster !== 'none')
        .map(
            (cluster) => `subgraph cluster_${sanitize(cluster)} {
            label="${sanitize(cluster)}";
            type="scope";
            ${clusters[cluster].map((pkg) => `"${pkg}"`).join(';')}
        }`
        )
        .join('\n');

    const edgesDot = graph.edges.map((e) => `"${e.source}" -> "${e.target}";`).join('\n');
    const dot = `digraph {
        rankdir=LR;
        nodesep=0.20;
        ${scopesDot}
        ${edgesDot}
    }`;

    return dot;
};

const layoutWithGraphViz = async (graph: { nodes: Node[]; edges: Edge[] }) => {
    const dot = graphToDot(graph);

    const json = await graphviz.layout(dot, 'json0' as any, 'dot');
    const graphvizGraph = JSON.parse(json);

    const positionMap: PostitionMap = {};

    graphvizGraph.objects.forEach((obj: { pos: string; name: string; type: 'scope' | undefined }) => {
        if (obj.type === 'scope') {
            return;
        }
        const [x, y] = obj.pos.split(',').map((p) => parseFloat(p));

        positionMap[obj.name] = { x, y };
    });

    return positionMap;
};

export const autoLayout = async (store: Store) => {
    if (store.activeGraph.edges.length === 0) {
        return {};
    }

    const positionMap: PostitionMap = await layoutWithGraphViz(store.activeGraph);

    applyAutoLayout(store, positionMap);

    return positionMap;
};
