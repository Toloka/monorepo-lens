import { makeAutoObservable } from 'mobx';

import { ReportInfo } from '../lensResult';

export type Lens = {
    options: ReportInfo['lenses'];
    active: ReportInfo['lenses'][number]['name'] | 'none';
};

export const createLensStore = (repoDTO: ReportInfo): Lens => {
    return makeAutoObservable({
        options: repoDTO.lenses,
        active: 'none'
    });
};
