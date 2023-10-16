import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { normalizeIndicator } from './utils';

import styles from './MarcField.css';

const propTypes = {
  field: PropTypes.object.isRequired,
};

const MarcField = ({
  field,
}) => {
  const fieldTag = Object.keys(field)[0];
  const hasIndicators = typeof field[fieldTag] !== 'string';
  const subFields = hasIndicators
    ? field[fieldTag].subfields.map(subFieldTag => {
      const subKey = Object.keys(subFieldTag)[0];

      const subfieldValue = field[fieldTag].isHighlighted
        ? <mark>{subFieldTag[subKey]}</mark>
        : subFieldTag[subKey];

      return (
        <Fragment key={`subfield-${subFieldTag}-${subKey}`}>
          <span>&#8225;</span>
          {subKey}
          {' '}
          {subfieldValue}
          {' '}
        </Fragment>
      );
    })
    : field[fieldTag].replace(/\\/g, ' ');

  return (
    <tr data-test-instance-marc-field>
      <td>
        {fieldTag}
      </td>

      {
        hasIndicators && (
          <td className={styles.indicators}>
            {`${normalizeIndicator(field[fieldTag].ind1)} ${normalizeIndicator(field[fieldTag].ind2)}`}
          </td>
        )
      }

      <td colSpan={hasIndicators ? 2 : 3}>
        {subFields}
      </td>
    </tr>
  );
};

MarcField.propTypes = propTypes;

export default MarcField;
