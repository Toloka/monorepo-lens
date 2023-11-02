import { Node, Edge } from 'react-flow-renderer';

import { ReportInfo } from '../lensResult';

export const graphToReactflow = (graph: ReportInfo['dependencies']) => {
    const nodes: Node[] = Object.keys(graph).map(
        (pkgName): Node => ({
            id: pkgName,
            data: { pkgName },
            position: { x: 0, y: 0 },
            type: 'pkg'
        })
    );

    const edges: Edge[] = [];

    Object.entries(graph).map(([source, targetArr]) => {
        targetArr.forEach((target) => {
            edges.push({ id: `${source}->${target}`, source, target });
        });
    });

    return { nodes, edges };
};
