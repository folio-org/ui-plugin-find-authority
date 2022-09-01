import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import {
  AuthoritiesSearchContext,
  AuthoritiesSearchPane,
  AuthorityShape,
  SearchResultsList,
  SelectedAuthorityRecordContext,
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
  query: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  totalRecords: PropTypes.number.isRequired,
};

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

  const { filters } = useContext(AuthoritiesSearchContext);
  const [, setSelectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);

  const toggleFilterPane = () => setIsFilterPaneVisible(!isFilterPaneVisible);

  const closeDetailView = () => {
    setShowDetailView(false);
  };

  const openDetailView = () => {
    setSelectedAuthorityRecordContext(authorities[0]);
    setShowDetailView(true);
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

  const renderPaneSub = () => {
    return (
      <span>
        {intl.formatMessage({ id: 'ui-plugin-find-authority.search-results-list.paneSub' }, {
          totalRecords,
        })}
      </span>
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
      className={classNames(css.pane, css.focusIndicator, showDetailView ? css.hidden : undefined)}
      data-testid="authority-search-results-pane"
      appIcon={<AppIcon app="marc-authorities" />}
      defaultWidth="fill"
      paneTitle={intl.formatMessage({ id: 'stripes-authority-components.meta.title' })}
      paneSub={renderPaneSub()}
      padContent={false}
      noOverflow
      height={MAIN_PANE_HEIGHT}
    >
      <SearchResultsList
        authorities={authorities}
        columnWidths={columnWidths}
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
        onOpenRecord={openDetailView}
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
        onShowDetailView={setShowDetailView}
      />
      {showDetailView &&
        <MarcAuthorityView
          onCloseDetailView={closeDetailView}
        />
      }
      {renderResultList()}
    </>
  );
};

AuthoritiesLookup.propTypes = propTypes;

AuthoritiesLookup.defaultProps = {
  hasNextPage: null,
  hasPrevPage: null,
  hidePageIndices: false,
};

export default AuthoritiesLookup;
