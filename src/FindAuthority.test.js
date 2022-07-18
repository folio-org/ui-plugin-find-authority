import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';

import FindAuthority from './FindAuthority';

const renderFindAuthority = () => render(
  <FindAuthority
  />
);

describe('Given FindAuthority', () => {
  afterEach(cleanup);

  it('should be rendered', () => {
    renderFindAuthority();
    expect(screen.getByText('FindAuthority')).toBeVisible();
  });
});
