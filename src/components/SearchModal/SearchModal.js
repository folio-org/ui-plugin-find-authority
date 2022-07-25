import { useContext } from 'react';
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
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

const SearchModal = ({
  isOpen,
  setIsOpen,
}) => {
  const { navigationSegmentValue } = useContext(AuthoritiesSearchContext);

  return (
    <Modal
      open={isOpen}
      dismissible
      onClose={() => setIsOpen(false)}
      size="large"
      id="find-package-title-modal"
      data-testid="find-package-title-modal"
      contentClass={css.modalContent}
      label="Select MARC authority" // TODO: move to translations
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
