/* eslint-env jest */

export default jest.fn(async () => [
  {
    name: '@project/pkg1',
    location: '/Users/test-user/project/packages/pkg1',
    dependencies: ['@project/pkg2'],
    devDependencies: ['@types/jest', '@types/node', 'jest', 'ts-jest', 'typescript']
  },
  {
    name: '@project/pkg2',
    location: '/Users/test-user/project/packages/pkg2',
    dependencies: [],
    devDependencies: ['@types/jest', '@types/node', 'jest', 'ts-jest', 'typescript']
  }
]);
