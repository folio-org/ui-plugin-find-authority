import { act, render, screen } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import authorities from '@folio/stripes-authority-components/mocks/authorities.json'; // eslint-disable-line import/extensions
import { AuthoritiesSearchPane } from '@folio/stripes-authority-components';

import AuthoritiesLookup from './AuthoritiesLookup';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
  AuthoritiesSearchPane: jest.fn(() => <div>AuthoritiesSearchPane</div>),
  SearchResultsList: jest.fn(() => <div>SearchResultsList</div>),
}));


jest.mock('../MarcAuthorityView', () => jest.fn(() => <div>MarcAuthorityView</div>));

const mockSetSelectedAuthorityRecordContext = jest.fn();
const mockAuthorities = authorities.slice(0, 2);
const mockOnSubmitSearch = jest.fn();

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
      onSubmitSearch={mockOnSubmitSearch}
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

  describe('when there is only one record', () => {
    // beforeEach(() => {
    //   renderAuthoritiesSearchPane({
    //     authorities: [authorities[0]],
    //     totalRecords: 1,
    //   });
    // });

    it('should add authority record to the context', () => {
      renderAuthoritiesSearchPane({
        authorities: [authorities[0]],
        totalRecords: 1,
      });
      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(mockAuthorities[0]);
    });

    it('should display the detail view', () => {
      renderAuthoritiesSearchPane({
        authorities: [authorities[0]],
        totalRecords: 1,
      });
      expect(screen.getByText('MarcAuthorityView')).toBeVisible();
    });

    describe('when record comprises isAnchor and isExactMatch', () => {
      it('should display the detail view', () => {
        renderAuthoritiesSearchPane({
          authorities: [{
            ...authorities[0],
            isAnchor: true,
            isExactMatch: true,
          }],
          totalRecords: 1,
        });
        expect(screen.getByText('MarcAuthorityView')).toBeVisible();
      });
    });
  });

  describe('when submit search', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const advancedSearchState = 'foo';
    const anyParam = 'foo2';

    beforeEach(() => {
      renderAuthoritiesSearchPane();
      act(() => { AuthoritiesSearchPane.mock.calls[0][0].onShowDetailView(true); });
      act(() => { AuthoritiesSearchPane.mock.calls[1][0].onSubmitSearch(event, advancedSearchState, anyParam); });
    });

    it('should close the detail view and open the list of results', () => {
      expect(screen.getByText('SearchResultsList')).toBeVisible();
    });

    it('should reset the selected authority record in the context', () => {
      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(null);
    });

    it('should handle event object', () => {
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should invoke onSubmitSearch cb', () => {
      expect(mockOnSubmitSearch).toHaveBeenCalledWith(event, advancedSearchState, anyParam);
    });
  });
});
