import { useContext } from 'react';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  useAuthorities,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

import { AuthoritiesLookup } from '../../components';
import { PAGE_SIZE } from '../../constants';

const propTypes = {
  isLinkingLoading: PropTypes.bool.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
};

const SearchView = ({
  isLinkingLoading,
  onLinkRecord,
}) => {
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
    navigationSegmentValue,
    offset,
    setOffset,
  } = useContext(AuthoritiesSearchContext);
  const isAdvancedSearch = searchIndex === searchableIndexesValues.ADVANCED_SEARCH;

  const {
    authorities,
    isLoading,
    isLoaded,
    totalRecords,
    query,
  } = useAuthorities({
    searchQuery,
    searchIndex,
    advancedSearch,
    isAdvancedSearch,
    filters,
    pageSize: PAGE_SIZE,
    offset,
    setOffset,
    navigationSegmentValue,
  });

  const onSubmitSearch = (e, advancedSearchState) => {
    setAdvancedSearch(advancedSearchState);
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const handleLoadMore = (_pageAmount, _offset) => {
    setOffset(_offset);
  };

  return (
    <AuthoritiesLookup
      authorities={authorities}
      totalRecords={totalRecords}
      searchQuery={searchQuery}
      query={query}
      isLinkingLoading={isLinkingLoading}
      isLoaded={isLoaded}
      isLoading={isLoading}
      hasFilters={!!filters.length}
      onNeedMoreData={handleLoadMore}
      onSubmitSearch={onSubmitSearch}
      onLinkRecord={onLinkRecord}
    />
  );
};

SearchView.propTypes = propTypes;

export default SearchView;
