import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import { useAuthorities } from '@folio/stripes-authority-components';
import authorities from '@folio/stripes-authority-components/mocks/authorities.json'; // eslint-disable-line import/extensions

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
  useAuthorities: jest.fn(),
  useAuthority: () => ({ data: { headingRef: '', metadata: {} }, isLoading: false }),
}));

const mockAuthorities = authorities.slice(0, 2).concat({
  'id': '6a424f4d-2c46-4426-9f28-db8d26581b23',
  'headingType': 'Personal name',
  'authRefType': 'Authorized',
  'headingRef': 'Doe, John',
});
const mockOnSubmitSearch = jest.fn();
const mockOnLinkRecord = jest.fn();
const mockSetSelectedAuthorityRecord = jest.fn();

useAuthorities.mockReturnValue({
  authorities: mockAuthorities,
});

const getAuthoritiesSearchPane = (props = {}, selectedRecordCtxValue) => (
  <Harness selectedRecordCtxValue={selectedRecordCtxValue}>
    <AuthoritiesLookup
      authorities={mockAuthorities}
      hasFilters={false}
      isLinkingLoading={false}
      isLoaded
      isLoading={false}
      query=""
      searchQuery="test"
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearchPane();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when the list item clicked', () => {
    it('should open the detail view and have no axe errors', async () => {
      const {
        getByTestId,
        getAllByTestId,
        container,
      } = renderAuthoritiesSearchPane();
      const searchField = getByTestId('search-textarea');

      fireEvent.change(searchField, { target: { value: 'foo' } });
      fireEvent.click(getByTestId('submit-authorities-search'));
      const linkStyleBtnOfRow = getAllByTestId('heading-ref-btn')[0];

      fireEvent.click(linkStyleBtnOfRow);

      await runAxeTest({
        rootNode: container,
      });

      expect(screen.queryByTestId('authority-search-results-pane')).not.toBeInTheDocument();
      expect(screen.getByTestId('marc-view-pane')).toBeVisible();
    });
  });

  describe('when the link authority icon clicked', () => {
    it('should display loading instead of link icon', () => {
      const {
        getByTestId,
        getByRole,
        rerender,
      } = renderAuthoritiesSearchPane();

      const searchField = getByTestId('search-textarea');

      fireEvent.change(searchField, { target: { value: 'foo' } });
      fireEvent.click(getByTestId('submit-authorities-search'));

      const linkAuthorityIcon = getByRole('button', { name: 'ui-plugin-find-authority.search-results-list.link' });

      fireEvent.click(linkAuthorityIcon);

      rerender(getAuthoritiesSearchPane({ isLinkingLoading: true }));

      expect(getByTestId('link-authority-loading')).toBeDefined();
    });
  });

  describe('when there is only one record', () => {
    it('should hide the list of items and open the detail view', () => {
      renderAuthoritiesSearchPane({
        authorities: [authorities[0]],
        totalRecords: 1,
      });

      expect(screen.queryByTestId('authority-search-results-pane')).not.toBeInTheDocument();
      expect(screen.getByTestId('marc-view-pane')).toBeVisible();
    });
  });

  describe('when submit search', () => {
    const selectedRecordCtxValue = [{}, mockSetSelectedAuthorityRecord];

    it('should close the detail view and perform new search', () => {
      const { getByTestId } = renderAuthoritiesSearchPane(null, selectedRecordCtxValue);
      const searchField = getByTestId('search-textarea');

      fireEvent.change(searchField, { target: { value: 'foo' } });
      fireEvent.click(getByTestId('submit-authorities-search'));

      expect(screen.queryByTestId('marc-view-pane')).not.toBeInTheDocument();
      expect(screen.getByTestId('authority-search-results-pane')).toBeVisible();
      expect(mockOnSubmitSearch).toHaveBeenCalled();
      expect(mockSetSelectedAuthorityRecord).toHaveBeenLastCalledWith(null);
    });
  });
});
