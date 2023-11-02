import { Collector, ICollectorResult, IConfig, ILenseResult, Lense, Reporter } from '@monorepo-lens/schemas';
import { cosmiconfig } from 'cosmiconfig';

const callCollector = callImport<Parameters<Collector>[0], ICollectorResult>;
const callLence = callImport<Parameters<Lense>[0], ILenseResult>;
const callReporter = callImport<Parameters<Reporter>[0], string>;

type ConfigRow = [string, object];

export async function collect(cwd: string, config: IConfig): Promise<string[]> {
  const collectorsResult = join(await callImports(config.collectors, callCollector, cwd));
  const lenses = await callImports(config.lenses, callLence, collectorsResult);

  return callImports(config.reporters, callReporter, {
    cwd,
    packages: collectorsResult,
    lenses
  });
}

function callImports<Options, Result>(
  configPart: object,
  importFn: typeof callImport<Options, Result>,
  options: Options
): Promise<Result[]> {
  return Promise.all(Object.entries(configPart).map(importFn(options)));
}

function join<T>(arrays: T[][]): T[] {
  return arrays.flat();
}

function callImport<Options, Result>(options: Options): ([path, optionsFromConfig]: ConfigRow) => Promise<Result> {
  return ([path, optionsFromConfig]) => import(path).then((mod) => mod.default(options, optionsFromConfig));
}

export async function main(cwd: string, userConfig?: IConfig): Promise<string[]> {
  const configLoader = cosmiconfig('repolens');
  const configPath = await configLoader.search(cwd);

  if (!configPath?.filepath) {
    throw new Error(`No config found in ${cwd}`);
  }

  const config = await cosmiconfig('monorepo-lens').load(configPath.filepath);

  if (!config?.config) {
    throw new Error(`Config in path ${configPath.filepath} is empty`);
  }

  return collect(cwd, { ...config.config, ...userConfig });
}
