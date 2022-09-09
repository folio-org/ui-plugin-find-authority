import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';
import {
  AuthoritiesSearchContextProvider,
  SelectedAuthorityRecordContextProvider,
} from '@folio/stripes-authority-components';

import { SearchModal } from './components';

const propTypes = {
  onLinkRecord: PropTypes.func.isRequired,
  renderCustomTrigger: PropTypes.func,
};

const defaultProps = {
  renderCustomTrigger: null,
};

const FindAuthority = ({
  renderCustomTrigger,
  onLinkRecord,
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

  const handleLinkAuthority = record => {
    onLinkRecord(record);
    closeModal();
  };

  const renderTrigger = () => {
    return renderCustomTrigger
      ? renderCustomTrigger({ onClick: openModal })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTrigger()}
      <AuthoritiesSearchContextProvider readParamsFromUrl={false}>
        <SelectedAuthorityRecordContextProvider>
          <SearchModal
            open={isOpen}
            onClose={closeModal}
            onLinkRecord={handleLinkAuthority}
          />
        </SelectedAuthorityRecordContextProvider>
      </AuthoritiesSearchContextProvider>
    </>
  );
};

FindAuthority.propTypes = propTypes;
FindAuthority.defaultProps = defaultProps;

export default FindAuthority;
