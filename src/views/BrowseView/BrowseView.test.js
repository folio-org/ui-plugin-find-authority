import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import BrowseView from './BrowseView';

import Harness from '../../../test/jest/helpers/harness';
import AuthoritiesLookup from '../../components/AuthoritiesLookup';

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
      isLoaded: true,
      isLoading: false,
      onNeedMoreData: expect.any(Function),
      onSubmitSearch: expect.any(Function),
      onLinkRecord: mockOnLinkRecord,
      query: '(headingRef>="" or headingRef<"") and isTitleHeadingRef==false',
      searchQuery: '',
      totalRecords: 0,
    };

    renderBrowseView();
    expect(AuthoritiesLookup).toHaveBeenNthCalledWith(1, expectedProps, {});
  });
});
