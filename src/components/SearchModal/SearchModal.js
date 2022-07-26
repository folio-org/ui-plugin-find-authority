import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes-components';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const SearchModal = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      dismissible
      label={<FormattedMessage id="ui-find-authority.modal.title" />}
      open={open}
      size="large"
      data-testid="find-authority-modal"
      onClose={onClose}
    >
      Search modal
    </Modal>
  );
};

SearchModal.propTypes = propTypes;

export default SearchModal;
