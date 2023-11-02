import { resolve } from 'path';

import collector from './pnpm-collector';

describe('pnpm-collector', () => {
    it('should produce right info', async () => {
        const repoRoot = resolve(__dirname, '../../../../');
        const info = await collector(repoRoot, {});

        const pnpmCollectorInfo = info.find((pkg) => pkg.name === '@monorepo-lens/pnpm-collector');

        expect(pnpmCollectorInfo).not.toBeUndefined();
        expect(pnpmCollectorInfo?.location.endsWith('packages/collectors/pnpm-collector')).toBeTruthy();
        expect(pnpmCollectorInfo?.dependencies).toContain('find-packages');
        expect(pnpmCollectorInfo?.devDependencies).toContain('@monorepo-lens/dev');
    });
});
