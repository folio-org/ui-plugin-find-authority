import {
  useCallback,
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
  IconButton,
  Icon,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { ExpandFilterPaneButton } from '@folio/stripes/smart-components';
import {
  AuthoritiesSearchContext,
  AuthoritiesSearchPane,
  AuthorityShape,
  searchResultListColumns,
  SearchResultsList,
  SelectedAuthorityRecordContext,
  navigationSegments,
  useAutoOpenDetailView,
  AUTH_REF_TYPES,
  SharedIcon,
} from '@folio/stripes-authority-components';

import MarcAuthorityView from '../MarcAuthorityView';
import {
  columnWidths,
  PAGE_SIZE,
} from '../../constants';
import css from './AuthoritiesLookup.css';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  excludedFilters: PropTypes.object,
  hasFilters: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool,
  hasPrevPage: PropTypes.bool,
  hidePageIndices: PropTypes.bool,
  isLinkingLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  query: PropTypes.string,
  resultsContainerRef: PropTypes.node,
  searchQuery: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
  totalRecords: PropTypes.number.isRequired,
};

const AuthoritiesLookup = ({
  authorities,
  excludedFilters,
  totalRecords,
  searchQuery,
  query,
  isLinkingLoading,
  isLoaded,
  isLoading,
  hasFilters,
  hasNextPage,
  hasPrevPage,
  hidePageIndices,
  resultsContainerRef,
  tenantId,
  onNeedMoreData,
  onSubmitSearch,
  onLinkRecord,
}) => {
  const intl = useIntl();
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(true);
  const [showDetailView, setShowDetailView] = useState(false);
  const [itemToView, setItemToView] = useState(null);
  const [authorityIdToLink, setAuthorityIdToLink] = useState('');

  const {
    filters,
    navigationSegmentValue,
  } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const columnMapping = {
    [searchResultListColumns.LINK]: intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.link' }),
    [searchResultListColumns.AUTH_REF_TYPE]: intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.authRefType' }),
    [searchResultListColumns.HEADING_REF]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingRef' }),
    [searchResultListColumns.HEADING_TYPE]: intl.formatMessage({ id: 'stripes-authority-components.search-results-list.headingType' }),
  };

  const handleLinkRecord = authority => {
    setAuthorityIdToLink(authority.id);
    onLinkRecord(authority);
  };

  const formatter = {
    [searchResultListColumns.LINK]: authority => {
      const { id, authRefType } = authority;

      if (!id || authRefType !== AUTH_REF_TYPES.AUTHORIZED) {
        return null;
      }

      if (isLinkingLoading && authorityIdToLink === id) {
        return (
          <Icon
            icon="spinner-ellipsis"
            iconRootClass={css.authorityLinkSpinner}
            data-testid="link-authority-loading"
          />
        );
      }

      return (
        <IconButton
          data-testid="link-authority-button"
          icon="link"
          aria-haspopup="true"
          title={intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.link' })}
          ariaLabel={intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.link' })}
          onClick={() => handleLinkRecord(authority)}
        />
      );
    },
  };

  const visibleColumns = [
    searchResultListColumns.LINK,
    searchResultListColumns.AUTH_REF_TYPE,
    searchResultListColumns.HEADING_REF,
    searchResultListColumns.HEADING_TYPE,
  ];

  const toggleFilterPane = () => setIsFilterPaneVisible(!isFilterPaneVisible);

  const closeDetailView = () => {
    setShowDetailView(false);
  };

  const openDetailView = useCallback(authority => {
    setSelectedAuthorityRecordContext(authority);
    setShowDetailView(true);
  }, [setSelectedAuthorityRecordContext]);

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
    setSelectedAuthorityRecordContext(null);
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
      {authority.shared && <SharedIcon authority={authority} />}
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
    >
      <SearchResultsList
        authorities={authorities}
        columnWidths={columnWidths}
        columnMapping={columnMapping}
        formatter={formatter}
        totalResults={totalRecords}
        pageSize={PAGE_SIZE}
        onNeedMoreData={onNeedMoreData}
        loading={isLoading}
        loaded={isLoaded}
        visibleColumns={visibleColumns}
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        hasFilters={hasFilters}
        query={searchQuery}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        hidePageIndices={hidePageIndices}
        renderHeadingRef={renderHeadingRef}
        resultsContainerRef={resultsContainerRef}
        itemToView={itemToView}
        onRowFocus={handleRowFocus}
      />
    </Pane>
  );

  return (
    <>
      <AuthoritiesSearchPane
        excludedFilters={excludedFilters}
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        isLoading={isLoading}
        onSubmitSearch={handleSubmitSearch}
        query={query}
        tenantId={tenantId}
        onShowDetailView={setShowDetailView}
      />
      {showDetailView
        ? (
          <MarcAuthorityView
            isLinkingLoading={isLinkingLoading}
            onCloseDetailView={closeDetailView}
            onLinkRecord={onLinkRecord}
          />
        )
        : renderResultList()
      }
    </>
  );
};

AuthoritiesLookup.propTypes = propTypes;

AuthoritiesLookup.defaultProps = {
  excludedFilters: {},
  query: '',
  hasNextPage: null,
  hasPrevPage: null,
  hidePageIndices: false,
  resultsContainerRef: null,
  tenantId: '',
};

export default AuthoritiesLookup;
