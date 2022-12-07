import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import { useAuthorities } from '@folio/stripes-authority-components';

import AuthoritiesLookup from '../../components/AuthoritiesLookup';
import SearchView from './SearchView';
import { useDefaultLookup } from '../../hooks';

import Harness from '../../../test/jest/helpers/harness';

const mockUseAuthorities = {
  authorities: [],
  isLoading: false,
  isLoaded: true,
  totalRecords: 0,
  setOffset: 0,
  query: '',
};

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: jest.fn(() => mockUseAuthorities),
}));

jest.mock('../../components/AuthoritiesLookup', () => jest.fn(() => <div>AuthoritiesLookup</div>));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDefaultLookup: jest.fn(() => ({ areStatesUpdated: true })),
}));

const mockOnLinkRecord = jest.fn();

const renderSearchView = (props = {}, authoritiesCtxValue) => render(
  <Harness
    authoritiesCtxValue={authoritiesCtxValue}
  >
    <SearchView
      tag="100"
      onLinkRecord={mockOnLinkRecord}
      {...props}
    />
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

  it('should display loading', () => {
    useDefaultLookup.mockImplementation(() => ({ areStatesUpdated: false }));
    const { getByText } = renderSearchView();

    expect(getByText('LoadingPane')).toBeVisible();
  });

  it('should have correct props for AuthoritiesLookup', () => {
    useDefaultLookup.mockImplementation(() => ({ areStatesUpdated: true }));
    const expectedProps = {
      authorities: [],
      hasFilters: false,
      isLoaded: true,
      isLoading: false,
      onNeedMoreData: expect.any(Function),
      onSubmitSearch: expect.any(Function),
      onLinkRecord: mockOnLinkRecord,
      query: '',
      searchQuery: '',
      totalRecords: 0,
    };

    renderSearchView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(1, expectedProps, {});
  });

  describe('when there is no search query and selected filters', () => {
    it('should not add the complementary filter to retrieve only Authorized records', () => {
      const authoritiesCtxValue = {
        searchQuery: '',
        filters: {},
      };

      renderSearchView(null, authoritiesCtxValue);
      expect(useAuthorities).toHaveBeenLastCalledWith(expect.objectContaining({ filters: {} }));
    });
  });
});
