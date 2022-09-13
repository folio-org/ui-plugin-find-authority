import { render } from '@testing-library/react';

import BrowseView from './BrowseView';

import Harness from '../../../test/jest/helpers/harness';
import AuthoritiesLookup from '../../components/AuthoritiesLookup';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
}));

jest.mock('../../components/AuthoritiesLookup', () => jest.fn(() => <div>AuthoritiesLookup</div>));

const mockOnLinkRecord = jest.fn();

const renderBrowseView = (props = {}) => render(
  <Harness>
    <BrowseView
      onLinkRecord={mockOnLinkRecord}
      {...props}
    />
  </Harness>,
);

describe('Given BrowseView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have correct props for AuthoritiesLookup', () => {
    const expectedProps = {
      authorities: [],
      hasFilters: false,
      hasNextPage: false,
      hasPrevPage: false,
      hidePageIndices: true,
      isLoaded: false,
      isLoading: true,
      onNeedMoreData: expect.any(Function),
      onSubmitSearch: expect.any(Function),
      onLinkRecord: mockOnLinkRecord,
      query: undefined,
      searchQuery: '',
      totalRecords: NaN,
    };

    renderBrowseView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(1, expectedProps, {});
  });
});
