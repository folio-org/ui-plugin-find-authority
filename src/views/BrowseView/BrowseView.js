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
    setIsGoingToBaseURL,
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
    pageSize: 100, // TODO: add constant
    precedingRecordsCount: 5, // TODO add constant PRECEDING_RECORDS_COUNT,
  });

  const onSubmitSearch = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setIsGoingToBaseURL(true);
    setSelectedAuthorityRecordContext(null);
  };

  const renderPaneSub = () => {
    return (
      <span>
        {intl.formatMessage({
          id: 'stripes-authority-components.search-results-list.paneSub',
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
          pageSize={100} // TODO: add constant
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          loaded={isLoaded}
          visibleColumns={['authRefType', 'headingRef', 'headingType']} // TODO: define somewhhere
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
