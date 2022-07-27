import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes-components';

import { SearchModal } from './components';

const propTypes = {
  renderCustomTrigger: PropTypes.func,
};

const defaultProps = {
  renderCustomTrigger: null,
};

const FindAuthority = ({
  renderCustomTrigger,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const renderDefaultTrigger = () => {
    return (
      <IconButton
        icon="link"
        aria-haspopup="true"
        title={intl.formatMessage({ id: 'ui-plugin-find-authority.linkToMarcAuthorityRecord' })}
        ariaLabel={intl.formatMessage({ id: 'ui-plugin-find-authority.linkToMarcAuthorityRecord' })}
        onClick={openModal}
      />
    );
  };

  const renderTrigger = () => {
    return renderCustomTrigger
      ? renderCustomTrigger({ onClick: openModal })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTrigger()}
      <SearchModal
        open={isOpen}
        onClose={closeModal}
      />
    </>
  );
};

FindAuthority.propTypes = propTypes;
FindAuthority.defaultProps = defaultProps;

export default FindAuthority;
