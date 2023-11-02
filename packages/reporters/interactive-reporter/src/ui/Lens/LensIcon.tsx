import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

import { getHeatColor } from '../../lib/getHeatColor';
import { storeCtx } from '../storeCtx';

export const LensIcon = observer(({ pkg }: { pkg: string }) => {
    const store = useContext(storeCtx);

    const getLensStyle = (pkg: string) => {
        if (store.lens.active === 'none') {
            return {};
        }

        const [max, min] = store.minMaxLensValue;
        const lensValue = store.packages[pkg].lens[store.lens.active].value;
        const normalizedLensValue = (lensValue - min) / (max - min);

        return {
            background: getHeatColor(normalizedLensValue)
        };
    };

    return (
        <div
            style={{
                display: 'inline-block',
                height: '12px',
                width: '12px',
                ...getLensStyle(pkg),
                borderRadius: '50%'
            }}
        />
    );
});
