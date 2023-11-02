import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

import { toggleRelaxedMode } from '../../model/graph/activeGraphStore';
import { autoLayout } from '../../model/graph/autoLayout';
import { clearFilter } from '../../model/package/filtersStore';
import { storeCtx } from '../storeCtx';

export const Actions = observer(() => {
    const store = useContext(storeCtx);

    return (
        <div>
            <button onClick={() => autoLayout(store)}>Auto layout</button>
            <button onClick={() => clearFilter(store.filter)}>Clear filter</button>
            <button onClick={() => toggleRelaxedMode(store.activeGraph)}>
                Turn relaxed edges {store.activeGraph.edgeMode === 'relaxed' ? 'off' : 'on'}
            </button>
        </div>
    );
});
