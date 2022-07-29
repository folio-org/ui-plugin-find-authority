import {
  render,
  screen,
  cleanup,
} from '@testing-library/react';

import SearchModal from './SearchModal';
import Harness from '../../../test/jest/helpers/harness';

const requiredProps = {
  open: true,
  onClose: jest.fn(),
};

const renderSearchModal = (props = {}) => render(
  <Harness>
    <SearchModal
      {...requiredProps}
      {...props}
    />
  </Harness>,
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
