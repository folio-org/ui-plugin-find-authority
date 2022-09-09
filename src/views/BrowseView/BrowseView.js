import {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthoritiesBrowse,
} from '@folio/stripes-authority-components';

import { AuthoritiesLookup } from '../../components';
import {
  PAGE_SIZE,
  PRECEDING_RECORDS_COUNT,
} from '../../constants';
import { addDefaultFilters } from '../utils';

const propTypes = {
  onLinkRecord: PropTypes.func.isRequired,
};

const BrowseView = ({ onLinkRecord }) => {
  const {
    filters,
    searchQuery,
    searchIndex,
    setSearchQuery,
    setSearchIndex,
    searchInputValue,
    searchDropdownValue,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

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
    filters: addDefaultFilters(searchQuery, filters),
    searchQuery,
    searchIndex,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
  });

  const onSubmitSearch = () => {
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setSelectedAuthorityRecordContext(null);
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
