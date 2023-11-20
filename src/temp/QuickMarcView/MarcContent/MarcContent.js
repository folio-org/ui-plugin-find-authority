import PropTypes from 'prop-types';

import { Headline } from '@folio/stripes/components';

import MarcField from '../MarcField';
import { isControlField } from '../utils';
import styles from './MarcContent.css';

const propTypes = {
  isPrint: PropTypes.bool,
  marc: PropTypes.object.isRequired,
  marcTitle: PropTypes.node.isRequired,
  tenantId: PropTypes.string,
};

const defaultProps = {
  isPrint: false,
  tenantId: '',
};

const MarcContent = ({
  marcTitle,
  marc,
  isPrint,
  tenantId,
}) => {
  const showLinkIcon = marc.recordType === 'MARC_BIB';
  const parsedContent = marc.parsedRecord.content;
  const parsedMarc = {
    leader: parsedContent.leader,
    fields: [
      ...parsedContent.fields.filter(isControlField),
      ...parsedContent.fields.filter(field => !isControlField(field)),
    ],
  };

  return (
    <section className={styles.marcWrapper}>
      <Headline
        size="large"
        margin="small"
        tag="h3"
      >
        {marcTitle}
      </Headline>
      <table className={styles.marc}>
        <tbody>
          <tr>
            <td colSpan="4">
              {`LEADER ${parsedMarc.leader}`}
            </td>
          </tr>
          {parsedMarc.fields.map(field => (
            <MarcField
              isPrint={isPrint}
              field={field}
              key={field.id}
              showLinkIcon={showLinkIcon}
              tenantId={tenantId}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

MarcContent.propTypes = propTypes;
MarcContent.defaultProps = defaultProps;

export default MarcContent;
