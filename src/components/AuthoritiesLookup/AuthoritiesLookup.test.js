import { render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { useAutoOpenDetailView } from '@folio/stripes-authority-components';
import AuthoritiesLookup from './AuthoritiesLookup';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
  useAutoOpenDetailView: jest.fn(),
}));

jest.mock('../../components/AuthoritiesLookup', () => jest.fn(() => <div>AuthoritiesLookup</div>));

const mockAuthorities = [{
  'id': '5a404f5d-2c46-4426-9f28-db8d26881b30',
  'headingType': 'Personal name',
  'authRefType': 'Auth/Ref',
  'headingRef': 'Twain, Mark',
}];

const renderAuthoritiesSearchPane = (props = {}) => render(
  <Harness>
    <AuthoritiesLookup
      authorities={mockAuthorities}
      hasFilters={false}
      isLoaded={false}
      isLoading={false}
      query=""
      searchQuery=""
      totalRecords={mockAuthorities.length}
      onNeedMoreData={jest.fn()}
      onSubmitSearch={jest.fn()}
      {...props}
    />
  </Harness>,
);

describe('Given AuthoritiesLookup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearchPane();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display AuthoritiesSearchPane', () => {
    const { getByTestId } = renderAuthoritiesSearchPane();

    expect(getByTestId('pane-authorities-filters')).toBeDefined();
  });

  it('should check if detail view needs to be opened', () => {
    const authorities = [{
      'id': '5a404f5d-2c46-4426-9f28-db8d26881b30',
      'headingType': 'Personal name',
      'authRefType': 'Auth/Ref',
      'headingRef': 'Twain, Mark',
    }];
    const totalRecords = 1;

    renderAuthoritiesSearchPane({
      authorities,
      totalRecords,
    });
    expect(useAutoOpenDetailView).toHaveBeenCalledWith({
      authorities: mockAuthorities,
      setShowDetailView: expect.any(Function),
      totalRecords: mockAuthorities.length,
    });
  });
});
