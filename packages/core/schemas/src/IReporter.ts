import { ICollectorResult } from './ICollector';
import { ILenseResult } from './ILense';

export interface IReporterOptions {
  cwd: string;
  packages: ICollectorResult;
  lenses: ILenseResult[];
}

export type Reporter = (options: IReporterOptions, optionsFromConfig: Record<string, any>) => Promise<string>;
