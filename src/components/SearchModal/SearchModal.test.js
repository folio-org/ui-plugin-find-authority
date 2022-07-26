import {
  render,
  screen,
  cleanup,
} from '@testing-library/react';

import SearchModal from './SearchModal';

const requiredProps = {
  open: true,
  onClose: jest.fn(),
};

const renderSearchModal = (props = {}) => render(
  <SearchModal
    {...requiredProps}
    {...props}
  />,
);

describe('Given SearchModal', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    renderSearchModal();
  });

  it('should be visible', () => {
    expect(screen.getByTestId('find-authority-modal')).toBeInTheDocument();
  });
});
