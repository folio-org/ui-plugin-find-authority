import { fireEvent, render } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';
import {
  useMarcSource,
  useAuthority,
} from '@folio/stripes-authority-components';

import MarcAuthorityView from './MarcAuthorityView';

import Harness from '../../../test/jest/helpers/harness';

const mockSendCallout = jest.fn();
const mockOnLinkRecord = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
}));

const marcSource = {
  data: {
    parsedRecord: {
      content: {
        fields: [{
          100: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          110: {
            subfields: [{
              a: 'value contains heading-ref string',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          400: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          410: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          500: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }],
      },
    },
    metadata: {
      lastUpdatedDate: '2020-12-04T09:05:30.000+0000',
      updatedDate: '',
    },
  },
  isLoading: false,
};

const authority = {
  data: {
    id: 'authority-id',
    headingRef: 'heading-ref',
    authRefType: 'Authorized',
  },
  isLoading: false,
};

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthority: jest.fn(() => authority),
  useMarcSource: jest.fn(() => marcSource),
}));

const mockSetSelectedAuthorityRecordContext = jest.fn();

const getMarcAuthorityView = (props = {}, selectedRecord = authority.data) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <MarcAuthorityView
      onCloseDetailView={jest.fn()}
      onLinkRecord={mockOnLinkRecord}
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

  it('should render link authority button', () => {
    const { getByText } = renderMarcAuthorityView();

    expect(getByText('ui-plugin-find-authority.button.link')).toBeDefined();
  });

  describe('when clicking on Link authority', () => {
    it('should call onLinkRecord with autority record', () => {
      const { getByText } = renderMarcAuthorityView();

      fireEvent.click(getByText('ui-plugin-find-authority.button.link'));

      expect(mockOnLinkRecord).toHaveBeenCalledWith(authority.data);
    });
  });

  describe('when authority record has authRefType Authorized', () => {
    it('should highlight 1XX marc field', () => {
      const { container } = renderMarcAuthorityView();
      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('heading-ref');
    });
  });

  describe('when authority record has authRefType Reference', () => {
    it('should highlight all 4XX marc fields', () => {
      const mockAuthority = {
        data: {
          ...authority.data,
          authRefType: 'Reference',
        },
        isLoading: false,
      };

      useAuthority.mockImplementation(() => mockAuthority);

      const { container } = renderMarcAuthorityView();
      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('heading-ref heading-ref');
    });
  });

  describe('when authority record has authRefType Auth/Ref', () => {
    it('should highlight 5XX marc field', () => {
      const mockAuthority = {
        data: {
          ...authority.data,
          authRefType: 'Auth/Ref',
        },
        isLoading: false,
      };

      useAuthority.mockImplementation(() => mockAuthority);

      const { container } = renderMarcAuthorityView();
      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('heading-ref');
    });
  });

  describe('when tag value contains only part of authority heading ref value', () => {
    it('should not highlight tag value', () => {
      const { container } = renderMarcAuthorityView();
      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).not.toEqual('value contains heading-ref string');
    });
  });

  describe('when tag value completely equals to authority heading ref value', () => {
    it('should highlight tag value', () => {
      const mockAuthority = {
        data: {
          ...authority.data,
          headingRef: 'value contains heading-ref string',
        },
        isLoading: false,
      };

      useAuthority.mockImplementation(() => mockAuthority);

      const { container } = renderMarcAuthorityView();
      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('value contains heading-ref string');
    });
  });

  describe('when marc source request failed', () => {
    const responsePromise = Promise.resolve({ status: 404 });

    beforeEach(() => {
      useMarcSource.mockImplementation((id, { onError }) => onError({
        response: responsePromise,
      }));
    });

    it('should show error toast', async () => {
      renderMarcAuthorityView();
      await responsePromise;

      expect(mockSendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'stripes-authority-components.authority.view.error.notFound',
      });
    });
  });
});
