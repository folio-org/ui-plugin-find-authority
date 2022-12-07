jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
}));
