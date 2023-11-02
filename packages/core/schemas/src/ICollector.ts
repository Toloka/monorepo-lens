export interface IPackageInfo {
  name: string;
  location: string;
  dependencies: string[];
  devDependencies: string[];
}

export type ICollectorResult = IPackageInfo[];

export type Collector = (cwd: string, options: Record<string, any>) => Promise<ICollectorResult>;
