import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

import { storeCtx } from '../storeCtx';

export const Lens = observer(() => {
    const store = useContext(storeCtx);

    return (
        <div>
            Lens:{' '}
            <select
                value={store.lens.active}
                onChange={action((e) => {
                    store.lens.active = e.target.value as any;
                })}
            >
                <option value={'none'}>-</option>
                {store.lens.options.map((x) => (
                    <option value={x.name} key={x.name}>
                        {x.name}
                    </option>
                ))}
            </select>
        </div>
    );
});
