import { Reporter, IReporterOptions } from '@monorepo-lens/schemas';
import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';

const reporter: Reporter = async ({ cwd, lenses }, optionsFromConfig) => {
    const dir = hasPathField(optionsFromConfig) ? optionsFromConfig.path : '';
    const dirPath = resolve(cwd, dir);
    const filePath = resolve(dirPath, `report_${Date.now()}.json`);

    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, getFileContent(lenses));

    console.log(`\n Saved report to path ${filePath} \n`);

    return filePath;
};

function hasPathField(options: object): options is { path: string } {
    return 'path' in options;
}

function getFileContent(lenses: IReporterOptions['lenses']): string {
    return JSON.stringify(lenses, null, 4);
}

export default reporter;
