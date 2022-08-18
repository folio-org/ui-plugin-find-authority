import {
  useState,
  useContext,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import {
  AuthoritiesSearchPane,
  SearchResultsList,
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
  useAuthoritiesBrowse,
} from '@folio/stripes-authority-components';

import {
  PAGE_SIZE,
  PRECEDING_RECORDS_COUNT,
} from '../../constants';

const BrowseView = () => {
  const intl = useIntl();
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(true);

  const toggleFilterPane = () => setIsFilterPaneVisible(!isFilterPaneVisible);

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
    filters,
    searchQuery,
    searchIndex,
    pageSize: PAGE_SIZE,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
  });

  const onSubmitSearch = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setSelectedAuthorityRecordContext(null);
  };

  const renderPaneSub = () => {
    return (
      <span>
        {intl.formatMessage({
          id: 'ui-plugin-find-authority.search-results-list.paneSub',
        }, {
          totalRecords,
        })}
      </span>
    );
  };

  const renderResultsFirstMenu = () => {
    if (isFilterPaneVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
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
    <>
      <AuthoritiesSearchPane
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        isLoading={isLoading}
        onSubmitSearch={onSubmitSearch}
        query={query}
      />
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'stripes-authority-components.meta.title' })}
        paneSub={renderPaneSub()}
        firstMenu={renderResultsFirstMenu()}
        padContent={false}
        noOverflow
      >
        <SearchResultsList
          authorities={formattedAuthoritiesForView}
          totalResults={totalRecords}
          pageSize={PAGE_SIZE}
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          loaded={isLoaded}
          visibleColumns={['authRefType', 'headingRef', 'headingType']}
          isFilterPaneVisible={isFilterPaneVisible}
          toggleFilterPane={toggleFilterPane}
          hasFilters={!!filters.length}
          query={searchQuery}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          hidePageIndices
        />
      </Pane>
    </>
  );
};

export default BrowseView;
