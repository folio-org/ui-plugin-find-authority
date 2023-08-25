import {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContext,
  useAuthoritiesBrowse,
  useBrowseResultFocus,
} from '@folio/stripes-authority-components';

import { AuthoritiesLookup } from '../../components';
import {
  PAGE_SIZE,
  PRECEDING_RECORDS_COUNT,
} from '../../constants';

const propTypes = {
  isLinkingLoading: PropTypes.bool.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
};

const defaultProps = {
  tenantId: '',
};

const BrowseView = ({
  isLinkingLoading,
  tenantId,
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
    setBrowsePageQuery,
    browsePageQuery,
    browsePage,
    setBrowsePage,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);

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
    setBrowsePageQuery,
    browsePageQuery,
    browsePage,
    setBrowsePage,
    navigationSegmentValue,
    tenantId,
  });

  const { resultsContainerRef, isPaginationClicked } = useBrowseResultFocus(isLoading);

  const handleNeedMoreData = (...params) => {
    isPaginationClicked.current = true;
    handleLoadMore(...params);
  };

  const onSubmitSearch = () => {
    setSearchQuery(searchInputValue.trim());
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

  return (
    <AuthoritiesLookup
      authorities={formattedAuthoritiesForView}
      totalRecords={totalRecords}
      searchQuery={searchQuery}
      query={query}
      isLinkingLoading={isLinkingLoading}
      isLoaded={isLoaded}
      isLoading={isLoading}
      hasFilters={!!filters.length}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      hidePageIndices
      resultsContainerRef={resultsContainerRef}
      tenantId={tenantId}
      onNeedMoreData={handleNeedMoreData}
      onSubmitSearch={onSubmitSearch}
      onLinkRecord={onLinkRecord}
    />
  );
};

BrowseView.propTypes = propTypes;
BrowseView.defaultProps = defaultProps;

export default BrowseView;
