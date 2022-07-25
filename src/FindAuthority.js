import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  AuthoritiesSearchContextProvider,
  SelectedAuthorityRecordContextProvider,
} from '@folio/stripes-authority-components';

import { SearchModal } from './components';

const propTypes = {
  renderCustomTrigger: PropTypes.func.isRequired,
};

const FindAuthority = ({
  renderCustomTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPluginModal = () => { setIsOpen(true); };

  const renderTrigger = () => {
    return renderCustomTrigger({ onClick: openPluginModal });
  };

  return (
    <>
      {renderTrigger()}
      <AuthoritiesSearchContextProvider readParamsFromUrl={false}>
        <SelectedAuthorityRecordContextProvider>
          <SearchModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </SelectedAuthorityRecordContextProvider>
      </AuthoritiesSearchContextProvider>
    </>
  );
};

FindAuthority.propTypes = propTypes;

export default FindAuthority;
