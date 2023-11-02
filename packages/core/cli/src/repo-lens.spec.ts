import collector from './mocks/stub-collector';
import lens from './mocks/stub-lens';
import reporter from './mocks/stub-reporter';
import { collect } from './monorepo-lens';

describe('collect', () => {
  it('should call all parts', async () => {
    await collect('/home/test-user/project', {
      collectors: {
        './mocks/stub-collector': {}
      },
      lenses: {
        './mocks/stub-lens': {}
      },
      reporters: {
        './mocks/stub-reporter': {}
      }
    });

    expect(collector).toBeCalledTimes(1);
    expect(lens).toBeCalledTimes(1);
    expect(reporter).toBeCalledTimes(1);
  });
});
