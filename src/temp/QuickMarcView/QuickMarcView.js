import PropTypes from 'prop-types';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import MarcContent from './MarcContent';

const propTypes = {
  isPaneset: PropTypes.bool,
  lastMenu: PropTypes.node,
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  paneHeight: PropTypes.string,
  paneSub: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  paneTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  paneWidth: PropTypes.string,
  tenantId: PropTypes.string,
};

const defaultProps = {
  isPaneset: true,
  paneHeight: null,
  lastMenu: null,
  paneSub: null,
  paneWidth: '',
  tenantId: '',
};

/*
  This is a temporarily copied component from ui-quick-marc to resolve a ciecular dependency.
  TODO: Remove it from here after https://issues.folio.org/browse/UIQM-570 is done.
*/
const QuickMarcView = ({
  paneTitle,
  paneSub,
  paneHeight,
  marcTitle,
  marc,
  onClose,
  paneWidth,
  lastMenu,
  isPaneset,
  tenantId,
}) => {
  const renderContent = () => (
    <Pane
      paneTitle={paneTitle}
      paneSub={paneSub}
      defaultWidth={paneWidth}
      id="marc-view-pane"
      dismissible
      onClose={onClose}
      data-test-instance-marc
      data-testid="marc-view-pane"
      height={paneHeight}
      lastMenu={lastMenu}
    >
      <MarcContent
        marcTitle={marcTitle}
        marc={marc}
        tenantId={tenantId}
      />
    </Pane>
  );

  return isPaneset
    ? (
      <Paneset
        isRoot
        data-testid="qm-view-paneset"
      >
        {renderContent()}
      </Paneset>
    )
    : renderContent();
};

QuickMarcView.propTypes = propTypes;
QuickMarcView.defaultProps = defaultProps;

export default QuickMarcView;
