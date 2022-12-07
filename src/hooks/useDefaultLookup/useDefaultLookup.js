import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AuthoritiesSearchContext,
  useFacets,
} from '@folio/stripes-authority-components';

import {
  DEFAULT_FILTERS,
  DEFAULT_LOOKUP_OPTIONS,
} from '../../constants';

const getNonZeroDefaultFilters = (facets = {}, defaultTagFilters) => {
  return Object.keys(facets).reduce((acc, facet) => {
    const nonZeroFilters = defaultTagFilters[facet].filter(defaultFilterId => {
      return facets[facet].values.some(filter => filter.id === defaultFilterId);
    });

    if (nonZeroFilters.length) {
      acc[facet] = nonZeroFilters;
    }

    return acc;
  }, { ...DEFAULT_FILTERS });
};

const useDefaultLookup = (cqlQuery, tag) => {
  const {
    filters,
    searchIndex,
    setSearchIndex,
    setFilters,
    setSearchDropdownValue,
    searchDropdownValue,
  } = useContext(AuthoritiesSearchContext);

  const [areStatesUpdated, setAreStatesUpdated] = useState(false);

  const {
    qindex,
    filters: defaultTagFilters,
  } = DEFAULT_LOOKUP_OPTIONS[tag];

  const { isLoading: areFacetsLoading, facets, refetch: fetchFacets } = useFacets({
    query: cqlQuery,
    selectedFacets: Object.keys(defaultTagFilters),
    enabled: false,
  });

  const nonZeroDefaultFilters = useMemo(() => {
    return getNonZeroDefaultFilters(facets, defaultTagFilters);
  }, [facets, defaultTagFilters]);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  useEffect(() => {
    if (!areFacetsLoading && facets) {
      setFilters(nonZeroDefaultFilters);
      setSearchDropdownValue(qindex);
      setSearchIndex(qindex);
    }
  }, [areFacetsLoading, facets, nonZeroDefaultFilters, qindex, setFilters, setSearchDropdownValue, setSearchIndex]);

  useEffect(() => {
    if (
      searchDropdownValue === qindex &&
      searchIndex === qindex &&
      filters === nonZeroDefaultFilters
    ) {
      setAreStatesUpdated(true);
    }
  }, [searchDropdownValue, qindex, searchIndex, filters, nonZeroDefaultFilters]);

  return {
    areStatesUpdated,
  };
};

export default useDefaultLookup;
