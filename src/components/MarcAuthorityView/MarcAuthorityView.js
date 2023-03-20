import { useContext } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

import {
  Button,
  Loading,
  Icon,
} from '@folio/stripes/components';
import {
  useMarcSource,
  useAuthority,
  QUERY_KEY_AUTHORITY_SOURCE,
  SelectedAuthorityRecordContext,
  markHighlightedFields,
  AUTH_REF_TYPES,
} from '@folio/stripes-authority-components';
import {
  useCallout,
  useNamespace,
} from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import css from './MarcAuthorityView.css';

const propTypes = {
  isLinkingLoading: PropTypes.bool.isRequired,
  onCloseDetailView: PropTypes.func.isRequired,
  onLinkRecord: PropTypes.func.isRequired,
};

const MarcAuthorityView = ({
  isLinkingLoading,
  onCloseDetailView,
  onLinkRecord,
}) => {
  const queryClient = useQueryClient();
  const authoritySourceNamespace = useNamespace({ key: QUERY_KEY_AUTHORITY_SOURCE });
  const callout = useCallout();
  const intl = useIntl();
  const [selectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);
  const { id, authRefType, headingRef } = selectedAuthorityRecord;

  const handleAuthorityLoadError = async err => {
    const errorResponse = await err.response;

    const calloutMessageId = errorResponse.status === 404
      ? 'stripes-authority-components.authority.view.error.notFound'
      : 'stripes-authority-components.authority.view.error.unknown';

    callout.sendCallout({ type: 'error', message:  intl.formatMessage({ id: calloutMessageId }) });
    queryClient.invalidateQueries(authoritySourceNamespace);
  };

  const marcSource = useMarcSource(id, {
    onError: handleAuthorityLoadError,
  });

  const authority = useAuthority(id, authRefType, headingRef, {
    onError: handleAuthorityLoadError,
  });

  if (marcSource.isLoading || authority.isLoading) {
    return <Loading size="xlarge" />;
  }

  if (!marcSource.data || !authority.data) {
    return null;
  }

  const renderLastMenu = () => {
    if (authRefType !== AUTH_REF_TYPES.AUTHORIZED) {
      return null;
    }

    if (isLinkingLoading) {
      return (
        <Icon
          icon="spinner-ellipsis"
          iconRootClass={css.authorityLinkSpinner}
          data-testid="link-authority-loading"
        />
      );
    }

    return (
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={() => onLinkRecord(selectedAuthorityRecord)}
      >
        <FormattedMessage id="ui-plugin-find-authority.button.link" />
      </Button>
    );
  };

  const paneSub = intl.formatMessage({ id: 'stripes-authority-components.authorityRecordSubtitle' }, {
    heading: authority.data.headingType,
    lastUpdatedDate: intl.formatDate(marcSource.data.metadata.updatedDate),
  });

  return (
    <MarcView
      isPaneset={false}
      paneWidth="fill"
      paneTitle={authority.data.headingRef}
      paneSub={paneSub}
      marcTitle={intl.formatMessage({ id: 'stripes-authority-components.marcHeading' })}
      marc={markHighlightedFields(marcSource, authority).data}
      onClose={onCloseDetailView}
      lastMenu={renderLastMenu()}
    />
  );
};

MarcAuthorityView.propTypes = propTypes;
MarcAuthorityView.dufaultProps = {
  onCloseDetailView: null,
};

export default MarcAuthorityView;
