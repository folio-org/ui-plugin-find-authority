import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import Harness from '../../../test/jest/helpers/harness';

import useDefaultLookup from './useDefaultLookup';
import { DEFAULT_LOOKUP_OPTIONS } from '../../constants';


const wrapper = ({ children, authoritiesCtxValue }) => (
  <Harness authoritiesCtxValue={authoritiesCtxValue}>
    {children}
  </Harness>
);

const mockSetSearchIndex = jest.fn();
const mockSetFilters = jest.fn();
const mockSetSearchDropdownValue = jest.fn();

const tag = '100';

const filterWithRecords = {
  'id': 'af045f2f-e851-4613-984c-4bc13430454a',
  'totalRecords': 4,
};

const mockGet = jest.fn(() => ({
  json: () => Promise.resolve({
    facets: {
      sourceFileId: {
        values: [filterWithRecords],
      },
    },
    totalRecords: 1,
  }),
}));

useOkapiKy.mockReturnValue({
  get: mockGet,
});

describe('Given useDefaultLookup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save only filters that have records > 0 and "references" filter', async () => {
    const filterIdWithoutRecords = '837e2c7b-037b-4113-9dfd-b1b8aeeb1fb8';
    const filterWithoutRecords = 'Topical';

    const cqlQuery = '(authRefType==("Authorized")) ' +
      `and (sourceFileId==("${filterWithRecords.id}" or "${filterIdWithoutRecords}")) ` +
      `and (headingType==("${filterWithoutRecords}"))`;

    const initialProps = {
      authoritiesCtxValue: {
        filters: {},
        searchIndex: '',
        setSearchIndex: mockSetSearchIndex,
        setFilters: mockSetFilters,
        setSearchDropdownValue: mockSetSearchDropdownValue,
        searchDropdownValue: '',
      },
    };

    const { result, waitFor, rerender } = renderHook(
      () => useDefaultLookup(cqlQuery, tag),
      { wrapper, initialProps },
    );

    await waitFor(() => !result.current.isLoading);
    await waitFor(() => { rerender(initialProps); });
    rerender(initialProps);

    expect(mockSetFilters).toHaveBeenCalledWith({
      references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
      sourceFileId: [filterWithRecords.id],
    });
    expect(mockSetSearchIndex).toHaveBeenCalledWith(DEFAULT_LOOKUP_OPTIONS[tag].qindex);
    expect(mockSetSearchDropdownValue).toHaveBeenCalledWith(DEFAULT_LOOKUP_OPTIONS[tag].qindex);
  });

  describe('when states of AuthoritiesSearchContext have been updated', () => {
    it('should return areStatesUpdated as true', async () => {
      const cqlQuery = '(authRefType==("Authorized")) and (sourceFileId==("af045f2f-e851-4613-984c-4bc13430454a"))';

      const { result, waitFor, rerender } = renderHook(() => useDefaultLookup(cqlQuery, tag), { wrapper });

      await waitFor(() => !result.current.isLoading);
      await waitFor(() => { rerender(); });
      rerender();

      expect(result.current.areStatesUpdated).toBeTruthy();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});
