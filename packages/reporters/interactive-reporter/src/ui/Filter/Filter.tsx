import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

import { setFilter } from '../../model/package/filtersStore';
import { LensIcon } from '../Lens/LensIcon';
import { storeCtx } from '../storeCtx';

export const Filter = observer(() => {
    const store = useContext(storeCtx);

    return (
        <div>
            <div>
                <select
                    name="sortBy"
                    value={store.filter.sortBy}
                    onChange={action((e) => {
                        store.filter.sortBy = e.target.value as any;
                    })}
                >
                    <option value={'name'}>Sort by name</option>
                    <option value={'lens'}>Sort by lens value</option>
                </select>
            </div>
            <br />
            <div>
                Filter:{' '}
                <input
                    placeholder="query"
                    value={store.filter.query}
                    onChange={action((e) => (store.filter.query = e.target.value))}
                />
                <button onClick={() => setFilter(store, store.filter.options)}>Select visible</button>
            </div>

            {store.filter.options.map((pkg) => {
                const slot = store.filter.packages;

                return (
                    <label
                        key={pkg}
                        style={{
                            display: 'block',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            overflowX: 'hidden'
                        }}
                    >
                        <LensIcon pkg={pkg} />
                        <input
                            type={'checkbox'}
                            checked={slot[pkg]}
                            onChange={action((e) => (slot[pkg] = e.target.checked))}
                        />
                        {pkg}
                    </label>
                );
            })}
        </div>
    );
});
