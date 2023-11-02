import { resolve } from 'path';

import collector from './lerna-collector';

describe('lerna-collector', () => {
    it('should produce right info', async () => {
        const repoRoot = resolve(__dirname, '../../../../');
        const info = await collector(repoRoot, {});

        const lernaCollectorInfo = info.find((pkg) => pkg.name === '@monorepo-lens/lerna-collector');

        expect(lernaCollectorInfo).not.toBeUndefined();
        expect(lernaCollectorInfo?.location.endsWith('packages/collectors/lerna-collector')).toBeTruthy();
        expect(lernaCollectorInfo?.dependencies).toContain('@lerna/project');
        expect(lernaCollectorInfo?.devDependencies).toContain('@monorepo-lens/dev');
    });
});
