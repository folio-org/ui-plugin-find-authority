import isEmpty from 'lodash/isEmpty';

export const addDefaultFilters = (searchQuery, filters) => {
  const shouldBeRequest = searchQuery || !isEmpty(filters);
  const defaultFilters = {
    references: ['excludeSeeFrom', 'excludeSeeFromAlso'],
  };

  return {
    ...filters,
    ...shouldBeRequest && defaultFilters,
  };
};
