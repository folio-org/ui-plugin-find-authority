import { useContext } from 'react';

import {
  AuthoritiesSearchContext,
  useAuthorities,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

import { AuthoritiesLookup } from '../../components';
import { PAGE_SIZE } from '../../constants';

const SearchView = () => {
  const {
    searchQuery,
    searchIndex,
    filters,
    advancedSearchRows: advancedSearch,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
    setAdvancedSearchRows: setAdvancedSearch,
  } = useContext(AuthoritiesSearchContext);
  const isAdvancedSearch = searchIndex === searchableIndexesValues.ADVANCED_SEARCH;
  const {
    authorities,
    isLoading,
    isLoaded,
    totalRecords,
    setOffset,
    query,
  } = useAuthorities({
    searchQuery,
    searchIndex,
    advancedSearch,
    isAdvancedSearch,
    filters,
    pageSize: PAGE_SIZE,
  });

  const onSubmitSearch = (e, advancedSearchState) => {
    setAdvancedSearch(advancedSearchState);
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const handleLoadMore = (_pageAmount, offset) => {
    setOffset(offset);
  };

  return (
    <AuthoritiesLookup
      authorities={authorities}
      totalRecords={totalRecords}
      searchQuery={searchQuery}
      query={query}
      isLoaded={isLoaded}
      isLoading={isLoading}
      hasFilters={!!filters.length}
      onNeedMoreData={handleLoadMore}
      onSubmitSearch={onSubmitSearch}
    />
  );
};

export default SearchView;
