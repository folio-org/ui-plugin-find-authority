import {
  useState,
  useContext,
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
  useAuthorities,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

import {
  PAGE_SIZE,
  MAIN_PANE_HEIGHT,
  columnWidths,
} from '../../constants';

const SearchView = () => {
  const intl = useIntl();
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(true);

  const toggleFilterPane = () => setIsFilterPaneVisible(!isFilterPaneVisible);

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
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);
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
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    setAdvancedSearch(advancedSearchState);
    setSearchQuery(searchInputValue);
    setSearchIndex(searchDropdownValue);
    setSelectedAuthorityRecordContext(null);
  };

  const handleLoadMore = (_pageAmount, offset) => {
    setOffset(offset);
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

  return (
    <>
      <AuthoritiesSearchPane
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        isLoading={isLoading}
        onSubmitSearch={onSubmitSearch}
        query={query}
        height={MAIN_PANE_HEIGHT}
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
        height={MAIN_PANE_HEIGHT}
      >
        <SearchResultsList
          authorities={authorities}
          columnWidths={columnWidths}
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
        />
      </Pane>
    </>
  );
};

export default SearchView;
