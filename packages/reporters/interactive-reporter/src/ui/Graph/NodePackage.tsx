/* eslint-disable no-undef */
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';

import { removeOwnDepsFromGraph, setFilter } from '../../model/package/filtersStore';
import { LensIcon } from '../Lens/LensIcon';
import { storeCtx } from '../storeCtx';

type NodeData = {
    pkgName: string;
};

const getNodeColor = () => {
    return 'black';
};

export const PackageNode = observer(({ data }: NodeProps<NodeData>) => {
    let [scope, name] = data.pkgName.split('/');

    if (!name) {
        name = scope;
        scope = '-';
    }

    const color = getNodeColor();
    const isPage = name.startsWith('page');
    const btn = { fontSize: '10px', padding: '0', height: '15px', width: '15px' };
    const store = useContext(storeCtx);
    const pkg = store.packages[data.pkgName];
    // @ts-ignore defined by vite
    const useFullName = __USE_FULL_NAME__;

    return (
        <div
            style={{
                padding: '5px',
                maxWidth: useFullName ? '' : '200px',
                border: `1px solid ${color}`,
                background: 'white'
            }}
            // className={'react-flow__node react-flow__node-default'}
        >
            <Handle type="target" position={Position.Left} />
            <div style={{ fontSize: '8px', color: isPage ? 'white' : '#555', background: isPage ? color : undefined }}>
                {scope}
                <button
                    onClick={() => setFilter(store, [...pkg.allConsumers, pkg.name])}
                    style={{ marginLeft: '10px', ...btn }}
                >
                    &lt;
                </button>
                <button onClick={() => setFilter(store, [...pkg.allDependencies, pkg.name])} style={btn}>
                    &gt;
                </button>
                <button
                    onClick={() => setFilter(store, [...pkg.allConsumers, ...pkg.allDependencies, pkg.name])}
                    style={btn}
                >
                    &lt;&gt;
                </button>
                <button onClick={() => removeOwnDepsFromGraph(store, pkg.name)} style={btn}>
                    x
                </button>
                <LensIcon pkg={pkg.name} />
            </div>
            <div>{useFullName ? data.pkgName : name}</div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
});

PackageNode.displayName = 'PackageNode';
