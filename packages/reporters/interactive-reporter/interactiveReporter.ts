import { Reporter } from '@monorepo-lens/schemas';
import { resolve } from 'path';
import { build } from 'vite';

const baseDir = resolve(__dirname, '../');

const buildReport: Reporter = async ({ cwd, lenses, packages }, optionsFromConfig) => {
    const reportPath = resolve(cwd, optionsFromConfig.path, String(Date.now()));

    /**
     * dev mode hack
     * const server = await createServer({
        configFile: resolve(baseDir, 'vite.config.ts'),
        root: resolve(baseDir, 'src'),
        build: {
            outDir: reportPath
        },
        define: {
            __LENSES__: lenses,
            __PACKAGES__: packages,
            __USE_FULL_NAME__: optionsFromConfig.useFullName ?? false
        }
    });

    await server.listen();

    server.printUrls();
     */

    await build({
        configFile: resolve(baseDir, 'vite.config.ts'),
        root: resolve(baseDir, 'src'),
        build: {
            outDir: reportPath
        },
        define: {
            __LENSES__: lenses,
            __PACKAGES__: packages,
            __USE_FULL_NAME__: optionsFromConfig.useFullName ?? false
        }
    });

    console.log(`\n Saved report to path ${reportPath}/index.html \n`);

    return reportPath;
};

export default buildReport;
