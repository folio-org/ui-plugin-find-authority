import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchView from './SearchView';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
}));

const renderSearchView = (props = {}) => render(
  <Harness>
    <SearchView {...props} />
  </Harness>,
);

describe('Given SearchView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchView();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display AuthoritiesSearchPane', () => {
    const { getByTestId } = renderSearchView();

    expect(getByTestId('pane-authorities-filters')).toBeDefined();
  });
});
