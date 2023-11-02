import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FC, useCallback, useContext, useMemo } from 'react';
import ReactFlow, { FitViewOptions, Controls, NodeChange, MiniMap } from 'react-flow-renderer';

import { storeCtx } from '../storeCtx';

import { PackageNode } from './NodePackage';
import { applyNodeChangesToStore } from './applyChanges';

const fitViewOptions: FitViewOptions = {
    padding: 0.2
};

export const GraphFlow: FC = observer(() => {
    const nodeTypes = useMemo(() => ({ pkg: PackageNode }), []);
    const store = useContext(storeCtx);

    const nodes = store.activeGraph.nodes.map((x) => toJS(x));
    const edges = store.activeGraph.edges.map((x) => toJS(x));

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            applyNodeChangesToStore(store, changes);
        },
        [store]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={console.log}
            onConnect={console.log}
            fitView={true}
            fitViewOptions={fitViewOptions}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
});
