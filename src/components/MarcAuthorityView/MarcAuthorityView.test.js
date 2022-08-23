import { render, screen } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import authorities from '@folio/stripes-authority-components/mocks/authorities.json'; // eslint-disable-line import/extensions

import MarcAuthorityView from './MarcAuthorityView';

import Harness from '../../../test/jest/helpers/harness';

jest.mock('@folio/quick-marc/src/QuickMarcView/QuickMarcView', () => jest.fn(() => <div>MarcView</div>));

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthority: () => ({
    data: {},
    isLoading: false,
  }),
  useMarcSource: jest.fn(() => ({
    data: {
      parsedRecord: { content: { fields: [] } },
      metadata: {
        updatedDate: '',
      },
    },
    isLoading: false,
  })),
}));


const mockSetSelectedAuthorityRecordContext = jest.fn();

const getMarcAuthorityView = (props = {}, selectedRecord = authorities[0]) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <MarcAuthorityView
      onCloseDetailView={jest.fn()}
      {...props}
    />
  </Harness>
);

const renderMarcAuthorityView = (...params) => render(getMarcAuthorityView(...params));

describe('Given MarcAuthorityView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderMarcAuthorityView();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display MarcView', () => {
    renderMarcAuthorityView();
    expect(screen.getByText('MarcView')).toBeVisible();
  });
});
