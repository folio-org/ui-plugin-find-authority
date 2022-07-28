import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
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
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const SearchModal = ({
  open,
  onClose,
}) => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  return (
    <Modal
      open={open}
      dismissible
      label={<FormattedMessage id="ui-find-authority.modal.title" />}
      onClose={onClose}
      size="large"
      id="find-authority-modal"
      data-testid="find-authority-modal"
      contentClass={css.modalContent}
    >
      <PersistedPaneset
        appId="@folio/find-authority"
        id="find-authority-paneset"
        data-testid="find-authority-paneset"
      >
        {
          navigationSegmentValue === navigationSegments.search
            ? <SearchView />
            : <BrowseView />
        }
      </PersistedPaneset>
    </Modal>
  );
};

SearchModal.propTypes = propTypes;

export default SearchModal;
