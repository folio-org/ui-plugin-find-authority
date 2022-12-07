import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import FindAuthority from './FindAuthority';
import { SearchModal } from './components';

jest.mock('./components', () => ({
  SearchModal: jest.fn(() => <div>SearchModal</div>),
}));

const mockOnLinkRecord = jest.fn();

const renderFindAuthority = (props = {}) => render(
  <FindAuthority
    tag="100"
    onLinkRecord={mockOnLinkRecord}
    {...props}
  />,
);

describe('Given FindAuthority', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderFindAuthority();

    await runAxeTest({
      rootNode: container,
    });
  });

  describe('when component does not get renderCustomTrigger action', () => {
    it('should render default trigger', () => {
      renderFindAuthority();

      expect(screen.getByRole('button', { name: 'ui-plugin-find-authority.linkToMarcAuthorityRecord' })).toBeVisible();
    });
  });

  describe('when component get renderCustomTrigger action', () => {
    it('should handle renderCustomTrigger', () => {
      const renderCustomTrigger = jest.fn();

      renderFindAuthority({ renderCustomTrigger });
      expect(renderCustomTrigger).toHaveBeenCalled();
    });
  });

  describe('when a user clicks on the default modal trigger', () => {
    it('should open the modal window', () => {
      renderFindAuthority();

      fireEvent.click(screen.getByRole('button', { name: 'ui-plugin-find-authority.linkToMarcAuthorityRecord' }));
      expect(SearchModal.mock.calls[1][0].open).toBeTruthy();
    });
  });
});
