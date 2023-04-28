import { AUTH_REF_TYPES } from '@folio/stripes-authority-components';

export const headFieldValue = (authority, marcSource) => {
  if (authority.authRefType === AUTH_REF_TYPES.AUTHORIZED || !marcSource.data) {
    return authority.data.headingRef;
  }

  const marcHeadField = marcSource.data.parsedRecord.content.fields?.find(x => /1\d\d/.test(Object.keys(x)[0]));
  const marcHeadFieldValue = Object.values(marcHeadField)[0].subfields.reduce((contentArr, subfield) => {
    const subfieldValue = Object.values(subfield)[0];

    return [...contentArr, subfieldValue];
  }, []).join(' ');

  return marcHeadFieldValue;
};
