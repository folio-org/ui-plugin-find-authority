import { render } from '@testing-library/react';

import { useAuthorities } from '@folio/stripes-authority-components';
import AuthoritiesLookup from '../../components/AuthoritiesLookup';
import SearchView from './SearchView';

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

const mockOnLinkRecord = jest.fn();

const renderSearchView = (props = {}, authoritiesCtxValue) => render(
  <Harness
    authoritiesCtxValue={authoritiesCtxValue}
  >
    <SearchView
      onLinkRecord={mockOnLinkRecord}
      {...props}
    />
  </Harness>,
);

describe('Given SearchView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct props for AuthoritiesLookup', () => {
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

  describe('when there is search query', () => {
    it('should add the complementary filter to retrieve only Authorized records', () => {
      const authoritiesCtxValue = {
        searchQuery: 'foo',
        filters: {},
      };
      const expectedFilters = {
        filters: {
          references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
        },
      };

      renderSearchView(null, authoritiesCtxValue);
      expect(useAuthorities).toHaveBeenLastCalledWith(expect.objectContaining(expectedFilters));
    });
  });

  describe('when there is a selected filter', () => {
    it('should add the complementary filter to retrieve only Authorized records', () => {
      const authoritiesCtxValue = {
        filters: {
          headingType: ['Topical'],
        },
      };
      const expectedFilters = {
        filters: {
          ...authoritiesCtxValue.filters,
          references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
        },
      };

      renderSearchView(null, authoritiesCtxValue);
      expect(useAuthorities).toHaveBeenLastCalledWith(expect.objectContaining(expectedFilters));
    });
  });
});
