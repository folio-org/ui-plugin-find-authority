import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import BrowseView from './BrowseView';

import Harness from '../../../test/jest/helpers/harness';
import AuthoritiesLookup from '../../components/AuthoritiesLookup';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useBrowseResultFocus: jest.fn().mockReturnValue({
    resultsContainerRef: { current: null },
  }),
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
      totalRecords: NaN,
    };

    renderBrowseView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(2, expectedProps, {});
  });
});
