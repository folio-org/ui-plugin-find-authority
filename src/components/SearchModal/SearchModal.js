import { useContext } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  AuthoritiesSearchContext,
  navigationSegments,
} from '@folio/stripes-authority-components';

import {
  SearchView,
  BrowseView,
} from '../../views';

import css from './SearchModal.css';

const propTypes = {
  isLinkingLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const SearchModal = ({
  isLinkingLoading,
  open,
  onClose,
  onLinkRecord,
}) => {
  const intl = useIntl();
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  const label = intl.formatMessage({ id: 'ui-plugin-find-authority.modal.title' });

  return (
    <Modal
      open={open}
      dismissible
      label={label}
      ariaLabel={label}
      onClose={onClose}
      size="large"
      id="find-authority-modal"
      data-testid="find-authority-modal"
      contentClass={css.modalContent}
      enforceFocus={false}
    >
      <PersistedPaneset
        static
        appId="@folio/find-authority"
        id="find-authority-paneset"
        data-testid="find-authority-paneset"
      >
        {
          navigationSegmentValue === navigationSegments.search
            ? (
              <SearchView
                isLinkingLoading={isLinkingLoading}
                onLinkRecord={onLinkRecord}
              />
            )
            : (
              <BrowseView
                isLinkingLoading={isLinkingLoading}
                onLinkRecord={onLinkRecord}
              />
            )
        }
      </PersistedPaneset>
    </Modal>
  );
};

SearchModal.propTypes = propTypes;

export default SearchModal;
