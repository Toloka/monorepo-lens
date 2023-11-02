import { ICollectorResult } from './ICollector';

export enum ELenseType {
  heat = 'heat'
}

export type ILenseNode = {
  value: number;
  comment?: string;
};

export type ILenseResult = {
  name: string;
  type: ELenseType;
  values: Record<string, ILenseNode>;
};

export type Lense = (collectorResult: ICollectorResult, options: Record<string, any>) => Promise<ILenseResult>;
