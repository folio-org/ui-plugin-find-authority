import isEmpty from 'lodash/isEmpty';

import {
  FILTERS,
  REFERENCES_VALUES_MAP,
} from '@folio/stripes-authority-components';

export const addDefaultFilters = (searchQuery, filters) => {
  const shouldBeRequest = searchQuery || !isEmpty(filters);
  const defaultFilters = {
    [FILTERS.REFERENCES]: [
      REFERENCES_VALUES_MAP.excludeSeeFrom,
      REFERENCES_VALUES_MAP.excludeSeeFromAlso,
    ],
  };

  return {
    ...filters,
    ...shouldBeRequest && defaultFilters,
  };
};
