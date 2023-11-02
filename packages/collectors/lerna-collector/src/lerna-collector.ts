import { getPackages } from '@lerna/project';
import { Collector } from '@monorepo-lens/schemas';

const collect: Collector = async (path: string) => {
    const packages = await getPackages(path);

    return packages.map((pkg) => ({
        name: pkg.name,
        location: pkg.location,
        dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
        devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : []
    }));
};

export default collect;
