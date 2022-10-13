import { searchResultListColumns } from '@folio/stripes-authority-components';

export const MAIN_PANE_HEIGHT = '609px';
export const columnWidths = {
  [searchResultListColumns.LINK]: { min: 45, max: 45 },
  [searchResultListColumns.SELECT]: { min: 30, max: 30 },
  [searchResultListColumns.AUTH_REF_TYPE]: { min: 130, max: 140 },
  [searchResultListColumns.HEADING_REF]: { min: 390, max: 410 },
  [searchResultListColumns.HEADING_TYPE]: { min: 120, max: 130 },
};
