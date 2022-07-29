import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import BrowseView from './BrowseView';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
}));

const renderBrowseView = (props = {}) => render(
  <Harness>
    <BrowseView {...props} />
  </Harness>,
);

describe('Given BrowseView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderBrowseView();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display AuthoritiesSearchPane', () => {
    const { getByTestId } = renderBrowseView();

    expect(getByTestId('pane-authorities-filters')).toBeDefined();
  });
});
