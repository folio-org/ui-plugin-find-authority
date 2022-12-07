import {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { LoadingPane } from '@folio/stripes/components';
import {
  AuthoritiesSearchContext,
  getCqlQueryForBrowseLookup,
  startingSearchForBrowseLookup,
  useAuthoritiesBrowse,
} from '@folio/stripes-authority-components';

import { useDefaultLookup } from '../../hooks';

import { AuthoritiesLookup } from '../../components';
import {
  DEFAULT_FILTERS,
  DEFAULT_LOOKUP_OPTIONS,
  PAGE_SIZE,
  PRECEDING_RECORDS_COUNT,
} from '../../constants';

const propTypes = {
  onLinkRecord: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

const BrowseView = ({
  tag,
  onLinkRecord,
}) => {
  const {
    filters,
    searchQuery,
    searchIndex,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
  } = useContext(AuthoritiesSearchContext);

  const {
    qindex,
    filters: defaultTagFilters,
  } = DEFAULT_LOOKUP_OPTIONS[tag];

  const cqlQuery = getCqlQueryForBrowseLookup({
    startingSearch: startingSearchForBrowseLookup(),
    searchIndex: qindex,
    filters: { ...DEFAULT_FILTERS, ...defaultTagFilters },
  });

  const { areStatesUpdated } = useDefaultLookup(cqlQuery, tag);

  const {
    authorities,
    hasNextPage,
    hasPrevPage,
    isLoading,
    isLoaded,
    handleLoadMore,
    query,
    totalRecords,
  } = useAuthoritiesBrowse({
    filters,
    searchQuery,
    searchIndex,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
    enabled: areStatesUpdated,
  });

  const onSubmitSearch = () => {
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
  };

  const formattedAuthoritiesForView = useMemo(() => {
    return authorities.map(authorityItem => {
      const authority = authorityItem.authority || {
        headingRef: authorityItem.headingRef,
      };

      return {
        ...authority,
        isAnchor: !!authorityItem.isAnchor,
        isExactMatch: !!authorityItem.authority,
      };
    });
  }, [authorities]);

  if (!areStatesUpdated) {
    return <LoadingPane size="xlarge" />;
  }

  return (
    <AuthoritiesLookup
      authorities={formattedAuthoritiesForView}
      totalRecords={totalRecords}
      searchQuery={searchQuery}
      query={query}
      isLoaded={isLoaded}
      isLoading={isLoading}
      hasFilters={!!filters.length}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      hidePageIndices
      onNeedMoreData={handleLoadMore}
      onSubmitSearch={onSubmitSearch}
      onLinkRecord={onLinkRecord}
    />
  );
};

BrowseView.propTypes = propTypes;

export default BrowseView;
