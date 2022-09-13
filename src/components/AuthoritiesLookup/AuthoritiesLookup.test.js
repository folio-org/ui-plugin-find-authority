import { fireEvent, render, screen } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import authorities from '@folio/stripes-authority-components/mocks/authorities.json'; // eslint-disable-line import/extensions
import { MultiColumnList } from '@folio/stripes/components';

import AuthoritiesLookup from './AuthoritiesLookup';

import Harness from '../../../test/jest/helpers/harness';

const mockMarcData = {
  data: {
    parsedRecord: {
      content: {
        fields: [],
        leader: '',
      },
    },
    metadata: {},
  },
  isLoading: false,
};

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useMarcSource: () => mockMarcData,
  useAuthorities: () => ({ authorities: [] }),
  useAuthority: () => ({ data: { headingRef: '', metadata: {} }, isLoading: false }),
}));

const mockAuthorities = authorities.slice(0, 2);
const mockOnSubmitSearch = jest.fn();
const mockOnLinkRecord = jest.fn();

const getAuthoritiesSearchPane = (props = {}) => (
  <Harness>
    <AuthoritiesLookup
      authorities={mockAuthorities}
      hasFilters={false}
      isLoaded={false}
      isLoading={false}
      query=""
      searchQuery=""
      totalRecords={mockAuthorities.length}
      onNeedMoreData={jest.fn()}
      onSubmitSearch={mockOnSubmitSearch}
      onLinkRecord={mockOnLinkRecord}
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

  describe('when the list item clicked', () => {
    beforeEach(() => {
      const { getByTestId, getAllByText, getAllByTestId } = renderAuthoritiesSearchPane();
      const searchField = getByTestId('search-textarea');

      fireEvent.change(searchField, { target: { value: 'foo' } });
      fireEvent.click(getByTestId('submit-authorities-search'));
      const row = getAllByText('row button')[0];
      const linkStyleBtnOfRow = getAllByTestId('heading-ref-btn')[0];

      fireEvent.click(row);
      fireEvent.click(linkStyleBtnOfRow);
    });

    it('should hide the list of items', () => {
      expect(screen.queryByTestId('authority-search-results-pane')).not.toBeInTheDocument();
    });

    it('should open the detail view', () => {
      expect(screen.getByTestId('marc-view-pane')).toBeVisible();
    });

    it('should pass correct data about the position of the selected list item', () => {
      expect(MultiColumnList).toHaveBeenLastCalledWith(expect.objectContaining({
        itemToView: {
          selector: 'any',
          localClientTop: 123, // can be found in stripesComponents.mock.js file
        },
      }), {});
    });
  });

  describe('when there is only one record', () => {
    beforeEach(() => {
      renderAuthoritiesSearchPane({
        authorities: [authorities[0]],
        totalRecords: 1,
      });
    });

    it('should hide the list of items', () => {
      expect(screen.queryByTestId('authority-search-results-pane')).not.toBeInTheDocument();
    });

    it('should open the detail view', () => {
      expect(screen.getByTestId('marc-view-pane')).toBeVisible();
    });
  });

  describe('when submit search', () => {
    beforeEach(() => {
      const { getByTestId } = renderAuthoritiesSearchPane();
      const searchField = getByTestId('search-textarea');

      fireEvent.change(searchField, { target: { value: 'foo' } });
      fireEvent.click(getByTestId('submit-authorities-search'));
    });

    it('should close the detail view', () => {
      expect(screen.queryByTestId('marc-view-pane')).not.toBeInTheDocument();
    });

    it('should show the list of results', () => {
      expect(screen.getByTestId('authority-search-results-pane')).toBeVisible();
    });

    it('should invoke onSubmitSearch cb', () => {
      expect(mockOnSubmitSearch).toHaveBeenCalled();
    });
  });
});
