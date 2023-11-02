import { ELenseType } from '@monorepo-lens/schemas';
import { mkdir, writeFile } from 'fs/promises';

import jsonReporter from './json-reporter';

const packages = [
    {
        name: '@monorepo-lens/git-plugin',
        location: __dirname,
        dependencies: ['@monorepo-lens/schemas', 'simple-git'],
        devDependencies: [
            '@tsconfig/node16',
            '@types/jest',
            '@types/lerna__project',
            '@types/node',
            'jest',
            'ts-jest',
            'typescript'
        ]
    }
];

const stubLenses = [
    {
        name: 'stub',
        type: ELenseType.heat,
        values: {
            '@monorepo-lens/json-reporter': {
                value: 120
            }
        }
    }
];

jest.mock('fs/promises', () => ({
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined)
}));

describe('json-reporter', () => {
    it('should write to correct file', async () => {
        await jsonReporter({ cwd: '/home/test-user/project', packages, lenses: stubLenses }, {});

        const mockedWriteFile = writeFile as jest.Mock;

        expect(mockedWriteFile.mock.lastCall[0]).toContain('/home/test-user/project/report');
    });

    it('should write to path from config', async () => {
        await jsonReporter({ cwd: '/home/test-user/project', packages, lenses: stubLenses }, { path: './report' });

        const mockedWriteFile = writeFile as jest.Mock;

        expect(mockedWriteFile.mock.lastCall[0]).toContain('/home/test-user/project/report/report');
    });

    it("should create folder if it doesn't exists", async () => {
        await jsonReporter({ cwd: '/home/test-user/project', packages, lenses: stubLenses }, { path: './report' });

        const mkdirMock = mkdir as jest.Mock;

        expect(mkdirMock.mock.lastCall[0]).toEqual('/home/test-user/project/report');
    });
});
