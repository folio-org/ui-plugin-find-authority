import {
  render,
  screen,
} from '@testing-library/react';

import { navigationSegments } from '@folio/stripes-authority-components';

import SearchModal from './SearchModal';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../views', () => ({
  SearchView: () => <div>SearchView</div>,
  BrowseView: () => <div>BrowseView</div>,
}));

const defaultCtxValue = {
  navigationSegmentValue: navigationSegments.search,
};

const mockOnLinkRecord = jest.fn();

const renderSearchModal = (props = {}, ctxValue = defaultCtxValue) => render(
  <Harness authoritiesCtxValue={ctxValue}>
    <SearchModal
      open
      onClose={jest.fn()}
      onLinkRecord={mockOnLinkRecord}
      {...props}
    />
  </Harness>,
);

describe('Given SearchModal', () => {
  it('should be visible', () => {
    renderSearchModal();

    expect(screen.getByTestId('find-authority-modal')).toBeInTheDocument();
  });

  describe('when navigation segment is search', () => {
    it('should render SearchView', () => {
      renderSearchModal();

      expect(screen.getByText('SearchView')).toBeInTheDocument();
    });
  });

  describe('when navigation segment is browse', () => {
    it('should render BrowseView', () => {
      renderSearchModal(null, { navigationSegmentValue: navigationSegments.browse });

      expect(screen.getByText('BrowseView')).toBeInTheDocument();
    });
  });
});
