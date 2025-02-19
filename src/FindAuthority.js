import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  IconButton,
  Callout,
} from '@folio/stripes/components';
import {
  AuthoritiesSearchContextProvider,
  SelectedAuthorityRecordContextProvider,
} from '@folio/stripes-authority-components';

import { SearchModal } from './components';

const propTypes = {
  calloutRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  excludedFilters: PropTypes.object,
  initialValues: PropTypes.object,
  isLinkingLoading: PropTypes.bool.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
  renderCustomTrigger: PropTypes.func,
  tenantId: PropTypes.string,
};

const FindAuthority = ({
  calloutRef = null,
  excludedFilters = {},
  isLinkingLoading,
  tenantId = null,
  initialValues = {},
  renderCustomTrigger = null,
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
  };

  const renderTrigger = () => {
    return renderCustomTrigger
      ? renderCustomTrigger({ onClick: openModal })
      : renderDefaultTrigger();
  };

  return (
    <>
      {renderTrigger()}
      {isOpen && (
        <AuthoritiesSearchContextProvider
          readParamsFromUrl={false}
          initialValues={initialValues}
        >
          <SelectedAuthorityRecordContextProvider>
            <SearchModal
              excludedFilters={excludedFilters}
              isLinkingLoading={isLinkingLoading}
              tenantId={tenantId}
              open={isOpen}
              onClose={closeModal}
              onLinkRecord={handleLinkAuthority}
            />
            <Callout ref={calloutRef} />
          </SelectedAuthorityRecordContextProvider>
        </AuthoritiesSearchContextProvider>
      )}
    </>
  );
};

FindAuthority.propTypes = propTypes;

export default FindAuthority;
