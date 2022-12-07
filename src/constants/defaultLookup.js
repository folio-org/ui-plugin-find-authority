import {
  FILTERS,
  REFERENCES_VALUES_MAP,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

export const DEFAULT_FILTERS = {
  [FILTERS.REFERENCES]: [
    REFERENCES_VALUES_MAP.excludeSeeFrom,
    REFERENCES_VALUES_MAP.excludeSeeFromAlso,
  ],
};

const LCNAF = {
  [FILTERS.AUTHORITY_SOURCE]: ['af045f2f-e851-4613-984c-4bc13430454a'],
};

const CORPORATE_CONFERENCE_NAME_SET = {
  qindex: searchableIndexesValues.CORPORATE_CONFERENCE_NAME,
  filters: LCNAF,
};

const UNIFORM_TITLE_SET = {
  qindex: searchableIndexesValues.UNIFORM_TITLE,
  filters: LCNAF,
};

const PERSONAL_NAME_SET = {
  qindex: searchableIndexesValues.PERSONAL_NAME,
  filters: LCNAF,
};

export const DEFAULT_LOOKUP_OPTIONS = {
  100: PERSONAL_NAME_SET,
  110: CORPORATE_CONFERENCE_NAME_SET,
  111: CORPORATE_CONFERENCE_NAME_SET,
  130: UNIFORM_TITLE_SET,
  240: {
    qindex: searchableIndexesValues.NAME_TITLE,
    filters: LCNAF,
  },
  600: PERSONAL_NAME_SET,
  610: CORPORATE_CONFERENCE_NAME_SET,
  611: CORPORATE_CONFERENCE_NAME_SET,
  630: UNIFORM_TITLE_SET,
  650: {
    qindex: searchableIndexesValues.SUBJECT,
    filters: {
      [FILTERS.AUTHORITY_SOURCE]: ['837e2c7b-037b-4113-9dfd-b1b8aeeb1fb8'],
    },
  },
  651: {
    qindex: searchableIndexesValues.GEOGRAPHIC_NAME,
    filters: LCNAF,
  },
  655: {
    qindex: searchableIndexesValues.GENRE,
    filters: {
      [FILTERS.AUTHORITY_SOURCE]: ['67d1ec4b-a19a-4324-9f19-473b49e370ac'],
    },
  },
  700: PERSONAL_NAME_SET,
  710: CORPORATE_CONFERENCE_NAME_SET,
  711: CORPORATE_CONFERENCE_NAME_SET,
  730: UNIFORM_TITLE_SET,
  800: PERSONAL_NAME_SET,
  810: CORPORATE_CONFERENCE_NAME_SET,
  811: CORPORATE_CONFERENCE_NAME_SET,
  830: UNIFORM_TITLE_SET,
};
