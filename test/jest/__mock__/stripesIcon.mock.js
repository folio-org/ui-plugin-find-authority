jest.mock('@folio/stripes-components/lib/Icon', () => {
  return ({ icon = 'Icon', 'data-testid': dataTestId }) => <span data-testid={dataTestId}>{icon}</span>;
});
