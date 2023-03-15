import { searchResultListColumns } from '@folio/stripes-authority-components';

export const columnWidths = {
  [searchResultListColumns.LINK]: { min: 50, max: 50 },
  [searchResultListColumns.AUTH_REF_TYPE]: { min: 140, max: 150 },
  [searchResultListColumns.HEADING_REF]: { min: 370, max: 370 },
  [searchResultListColumns.HEADING_TYPE]: { min: 120, max: 140 },
};
