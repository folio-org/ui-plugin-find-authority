import {
  render,
  screen,
} from '@testing-library/react';

import FindAuthority from './FindAuthority';

const renderFindAuthority = () => render(
    <FindAuthority
    />
);

describe('Given FindAuthority', () => {
  it('should be rendered', () => {
    renderFindAuthority();
    expect(screen.getByText('FindAuthority')).toBeVisible();
  });
});
