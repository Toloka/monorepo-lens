import { IReporterOptions } from '@monorepo-lens/schemas';

export type ReportInfo = Pick<IReporterOptions, 'lenses' | 'packages'> & {
    dependencies: {
        [packageName: string]: string[];
    };
};
