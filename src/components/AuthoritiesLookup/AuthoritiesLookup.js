import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import {
  AuthoritiesSearchContext,
  AuthoritiesSearchPane,
  AuthorityShape,
  FILTERS,
  searchResultListColumns,
  SearchResultsList,
  SelectedAuthorityRecordContext,
  navigationSegments,
  useAutoOpenDetailView,
} from '@folio/stripes-authority-components';

import MarcAuthorityView from '../MarcAuthorityView';
import {
  columnWidths,
  MAIN_PANE_HEIGHT,
  PAGE_SIZE,
} from '../../constants';
import css from './AuthoritiesLookup.css';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  hasFilters: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool,
  hasPrevPage: PropTypes.bool,
  hidePageIndices: PropTypes.bool,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  query: PropTypes.string,
  searchQuery: PropTypes.string.isRequired,
  totalRecords: PropTypes.number.isRequired,
};

const excludedFilters = new Set([
  FILTERS.REFERENCES,
]);

const AuthoritiesLookup = ({
  authorities,
  totalRecords,
  searchQuery,
  query,
  isLoaded,
  isLoading,
  hasFilters,
  hasNextPage,
  hasPrevPage,
  hidePageIndices,
  onNeedMoreData,
  onSubmitSearch,
}) => {
  const intl = useIntl();
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(true);
  const [showDetailView, setShowDetailView] = useState(false);
  const [itemToView, setItemToView] = useState(null);

  const {
    filters,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const columnMapping = {
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingType' }),
  };

  const toggleFilterPane = () => setIsFilterPaneVisible(!isFilterPaneVisible);

  const closeDetailView = () => {
    setShowDetailView(false);
  };

  const openDetailView = authority => {
    setSelectedAuthorityRecordContext(authority);
    setShowDetailView(true);
  };

  const handleRowFocus = ({ selector, localClientTop }) => {
    setItemToView({
      selector,
      localClientTop,
    });
  };

  useEffect(() => {
    closeDetailView();
    // eslint-disable-next-line
  }, [filters]);

  const handleSubmitSearch = (e, ...rest) => {
    if (e?.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    closeDetailView();
    onSubmitSearch(e, ...rest);
  };

  useAutoOpenDetailView(authorities, openDetailView);

  const renderPaneSub = () => {
    if (navigationSegmentValue === navigationSegments.browse) {
      return null;
    }

    return (
      <span>
        {intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.paneSub' }, {
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

  const renderHeadingRef = (authority, className) => (
    <button
      type="button"
      className={classNames(css.link, className)}
      data-testid="heading-ref-btn"
      onClick={() => setShowDetailView(true)}
    >
      {authority.headingRef}
    </button>
  );

  const renderResultList = () => (
    <Pane
      id="authority-search-results-pane"
      data-testid="authority-search-results-pane"
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
        columnMapping={columnMapping}
        totalResults={totalRecords}
        pageSize={PAGE_SIZE}
        onNeedMoreData={onNeedMoreData}
        loading={isLoading}
        loaded={isLoaded}
        visibleColumns={['authRefType', 'headingRef', 'headingType']}
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        hasFilters={hasFilters}
        query={searchQuery}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        hidePageIndices={hidePageIndices}
        renderHeadingRef={renderHeadingRef}
        itemToView={itemToView}
        onHandleRowFocus={handleRowFocus}
      />
    </Pane>
  );

  return (
    <>
      <AuthoritiesSearchPane
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        isLoading={isLoading}
        onSubmitSearch={handleSubmitSearch}
        query={query}
        height={MAIN_PANE_HEIGHT}
        excludedSearchFilters={excludedFilters}
        excludedBrowseFilters={excludedFilters}
        onShowDetailView={setShowDetailView}
      />
      {showDetailView
        ? (
          <MarcAuthorityView
            onCloseDetailView={closeDetailView}
          />
        )
        : renderResultList()
      }
    </>
  );
};

AuthoritiesLookup.propTypes = propTypes;

AuthoritiesLookup.defaultProps = {
  query: '',
  hasNextPage: null,
  hasPrevPage: null,
  hidePageIndices: false,
};

export default AuthoritiesLookup;
