import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import {
  useAuthoritiesBrowse,
  useBrowseResultFocus,
} from '@folio/stripes-authority-components';

import BrowseView from './BrowseView';

import Harness from '../../../test/jest/helpers/harness';
import AuthoritiesLookup from '../../components/AuthoritiesLookup';

const mockIsPaginationClicked = { current: false };
const mockHandleLoadMore = jest.fn();

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthoritiesBrowse: jest.fn(),
  useBrowseResultFocus: jest.fn(),
}));

jest.mock('../../components/AuthoritiesLookup', () => jest.fn(() => <div>AuthoritiesLookup</div>));

const mockOnLinkRecord = jest.fn();

const renderBrowseView = (props = {}) => render(
  <Harness>
    <BrowseView
      isLinkingLoading={false}
      onLinkRecord={mockOnLinkRecord}
      {...props}
    />
  </Harness>,
);

describe('Given BrowseView', () => {
  beforeEach(() => {
    mockIsPaginationClicked.current = false;

    useAuthoritiesBrowse.mockReturnValue({
      authorities: [],
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      isLoaded: false,
      handleLoadMore: mockHandleLoadMore,
      query: '(headingRef>="" or headingRef<"") and isTitleHeadingRef==false',
      totalRecords: 0,
    });
    useBrowseResultFocus.mockReturnValue({
      resultsContainerRef: { current: null },
      isPaginationClicked: mockIsPaginationClicked,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderBrowseView();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should have correct props for AuthoritiesLookup', () => {
    const expectedProps = {
      authorities: [],
      hasFilters: false,
      hasNextPage: false,
      hasPrevPage: false,
      hidePageIndices: true,
      isLinkingLoading: false,
      isLoaded: false,
      isLoading: false,
      onNeedMoreData: expect.any(Function),
      onSubmitSearch: expect.any(Function),
      onLinkRecord: mockOnLinkRecord,
      query: '(headingRef>="" or headingRef<"") and isTitleHeadingRef==false',
      resultsContainerRef: { current: null },
      searchQuery: '',
      totalRecords: 0,
    };

    renderBrowseView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(1, expectedProps, {});
  });

  describe('when a user clicks on the pagination button', () => {
    it('should invoke handleLoadMore and assign isPaginationClicked to true', () => {
      const args = [100, 95, 0, 'next'];

      renderBrowseView();
      AuthoritiesLookup.mock.calls[0][0].onNeedMoreData(...args);

      expect(mockHandleLoadMore).toHaveBeenCalledWith(...args);
      expect(mockIsPaginationClicked.current).toBeTruthy();
    });
  });
});
