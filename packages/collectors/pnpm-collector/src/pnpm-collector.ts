import { Collector } from '@monorepo-lens/schemas';
import { findPackages } from 'find-packages';

const collect: Collector = async (cwd: string) => {
    const packages = await findPackages(cwd);

    return packages.map((pkg) => ({
        name: pkg.manifest.name || pkg.dir,
        location: pkg.dir,
        dependencies: pkg.manifest.dependencies ? Object.keys(pkg.manifest.dependencies) : [],
        devDependencies: pkg.manifest.devDependencies ? Object.keys(pkg.manifest.devDependencies) : []
    }));
};

export default collect;
