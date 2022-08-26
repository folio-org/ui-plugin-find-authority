import { render } from '@testing-library/react';

import AuthoritiesLookup from '../../components/AuthoritiesLookup';
import SearchView from './SearchView';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
}));

jest.mock('../../components/AuthoritiesLookup', () => jest.fn(() => <div>AuthoritiesLookup</div>));

const renderSearchView = (props = {}) => render(
  <Harness>
    <SearchView {...props} />
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
      isLoaded: undefined,
      isLoading: undefined,
      onNeedMoreData: expect.any(Function),
      onSubmitSearch: expect.any(Function),
      query: undefined,
      searchQuery: '',
      totalRecords: undefined,
    };

    renderSearchView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(1, expectedProps, {});
  });
});
