import { render, screen } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import authorities from '@folio/stripes-authority-components/mocks/authorities.json';

import AuthoritiesLookup from './AuthoritiesLookup';
import MarcAuthorityView from '../MarcAuthorityView';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
}));


jest.mock('../MarcAuthorityView', () => jest.fn(() => <div>MarcAuthorityView</div>));

const mockSetSelectedAuthorityRecordContext = jest.fn();
const mockAuthorities = authorities.slice(0, 2);

const getAuthoritiesSearchPane = (props = {}, selectedRecord) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <AuthoritiesLookup
      authorities={mockAuthorities}
      hasFilters={false}
      isLoaded={false}
      isLoading={false}
      query=""
      searchQuery=""
      totalRecords={mockAuthorities.length}
      onNeedMoreData={jest.fn()}
      onSubmitSearch={jest.fn()}
      {...props}
    />
  </Harness>
);

const renderAuthoritiesSearchPane = (...params) => render(getAuthoritiesSearchPane(...params));

describe('Given AuthoritiesLookup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearchPane();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display AuthoritiesSearchPane', () => {
    const { getByTestId } = renderAuthoritiesSearchPane();

    expect(getByTestId('pane-authorities-filters')).toBeDefined();
  });

  it('should display the results pane', () => {
    renderAuthoritiesSearchPane();
    expect(screen.getByTestId('authority-search-results-pane')).toBeDefined();
  })

  describe('when there is only one record', () => {
    beforeEach(() => {
      renderAuthoritiesSearchPane({
        authorities: [authorities[0]],
        totalRecords: 1,
      });
    });

    it('should add authority record to the context', () => {
      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(mockAuthorities[0]);
    });

    it('should display the detail view', () => {
      expect(screen.getByText('MarcAuthorityView')).toBeVisible();
    })
  });
});
