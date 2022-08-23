import { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import {
  useMarcSource,
  useAuthority,
  QUERY_KEY_AUTHORITY_SOURCE,
  SelectedAuthorityRecordContext,
} from '@folio/stripes-authority-components';
import {
  useCallout,
  useNamespace,
} from '@folio/stripes/core';
import MarcView from '@folio/quick-marc/src/QuickMarcView/QuickMarcView';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { MAIN_PANE_HEIGHT } from '../../constants';

const propTypes = {
  onCloseDetailView: PropTypes.func.isRequired,
};

const MarcAuthorityView = ({
  onCloseDetailView,
}) => {
  const queryClient = useQueryClient();
  const authoritySourceNamespace = useNamespace({ key: QUERY_KEY_AUTHORITY_SOURCE });
  const callout = useCallout();
  const intl = useIntl();
  const [selectedAuthorityRecordContext] = useContext(SelectedAuthorityRecordContext);
  const { id, authRefType, headingRef } = selectedAuthorityRecordContext;

  const markHighlightedFields = (marcSource, authority) => {
    const highlightAuthRefFields = {
      'Authorized': /1\d\d/,
      'Reference': /4\d\d/,
      'Auth/Ref': /5\d\d/,
    };

    const marcFields = marcSource.data.parsedRecord.content.fields.map(field => {
      const tag = Object.keys(field)[0];

      const isHighlightedTag = highlightAuthRefFields[authority.data.authRefType].test(tag);

      if (!isHighlightedTag) {
        return field;
      }

      const fieldContent = field[tag].subfields.reduce((contentArr, subfield) => {
        const subfieldValue = Object.values(subfield)[0];

        return [...contentArr, subfieldValue];
      }, []).join(' ');

      const isHeadingRefMatching = fieldContent === authority.data.headingRef;

      return {
        ...field,
        [tag]: {
          ...field[tag],
          isHighlighted: isHeadingRefMatching && isHighlightedTag,
        },
      };
    });
    const marcSourceClone = cloneDeep(marcSource);

    set(marcSourceClone, 'data.parsedRecord.content.fields', marcFields);

    return marcSourceClone;
  };

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

  const paneSub = intl.formatMessage({ id: 'stripes-authority-components.authorityRecordSubtitle' }, {
    heading: authority.data.headingType,
    lastUpdatedDate: intl.formatDate(marcSource.data.metadata.updatedDate),
  });

  return (
    <MarcView
      paneWidth="fill"
      paneHeight={MAIN_PANE_HEIGHT}
      paneTitle={authority.data.headingRef}
      paneSub={paneSub}
      marcTitle={intl.formatMessage({ id: 'stripes-authority-components.marcHeading' })}
      marc={markHighlightedFields(marcSource, authority).data}
      onClose={onCloseDetailView}
    />
  );
};

MarcAuthorityView.propTypes = propTypes;
MarcAuthorityView.dufaultProps = {
  onCloseDetailView: null,
};

export default MarcAuthorityView;
