import { useState, useEffect } from 'react';

import { getRepoState } from './api/getRepoState';
import { autoLayout } from './model/graph/autoLayout';
import { createStore, Store } from './model/store';
import { Actions } from './ui/Actions/Actions';
import { Filter } from './ui/Filter/Filter';
import { GraphFlow } from './ui/Graph/GraphFlow';
import { Lens } from './ui/Lens/Lens';
import { storeCtx } from './ui/storeCtx';

const init = async () => {
    const repoDTO = await getRepoState();
    const store = createStore(repoDTO);

    await autoLayout(store);

    return store;
};

function App() {
    const [store, setStore] = useState<Store | undefined>(undefined);

    useEffect(() => {
        init().then(setStore);
    }, []);

    if (!store) {
        return <div>Loading</div>;
    }

    return (
        <storeCtx.Provider value={store}>
            <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                <div
                    style={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        minHeight: '0',
                        height: '100%',
                        boxShadow: '0 0 3px rgba(0,0,0,.4)',
                        zIndex: 2,
                        padding: '4px',
                        boxSizing: 'border-box',
                        width: '350px'
                    }}
                >
                    <h1>Repo lens</h1>
                    <Lens />
                    <br />
                    <Filter />
                </div>
                <div style={{ flex: '1', background: '#eee' }}>
                    <Actions />
                    <GraphFlow />
                </div>
            </div>
        </storeCtx.Provider>
    );
}

export default App;
