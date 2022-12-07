import { useContext } from 'react';
import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  AuthoritiesSearchContext,
  useAuthorities,
  searchableIndexesValues,
  getCqlQueryForSearchLookup,
} from '@folio/stripes-authority-components';

import { AuthoritiesLookup } from '../../components';

import { useDefaultLookup } from '../../hooks';

import {
  DEFAULT_FILTERS,
  DEFAULT_LOOKUP_OPTIONS,
  PAGE_SIZE,
} from '../../constants';

const propTypes = {
  onLinkRecord: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

const SearchView = ({
  tag,
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
  } = useContext(AuthoritiesSearchContext);
  const isAdvancedSearch = searchIndex === searchableIndexesValues.ADVANCED_SEARCH;

  const {
    qindex,
    filters: defaultTagFilters,
  } = DEFAULT_LOOKUP_OPTIONS[tag];

  const cqlQuery = getCqlQueryForSearchLookup({
    isAdvancedSearch,
    advancedSearch,
    filters: { ...DEFAULT_FILTERS, ...defaultTagFilters },
    searchIndex: qindex,
    searchQuery,
  });

  const { areStatesUpdated } = useDefaultLookup(cqlQuery, tag);

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
    enabled: areStatesUpdated,
  });

  const onSubmitSearch = (e, advancedSearchState) => {
    setAdvancedSearch(advancedSearchState);
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const handleLoadMore = (_pageAmount, offset) => {
    setOffset(offset);
  };

  if (!areStatesUpdated) {
    return <LoadingPane size="xlarge" />;
  }

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
      onLinkRecord={onLinkRecord}
    />
  );
};

SearchView.propTypes = propTypes;

export default SearchView;
