import { createContext } from 'react';

import { Store } from '../model/store';

export const storeCtx = createContext<Store>(undefined as any);
