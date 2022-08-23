import { searchResultListColumns } from '@folio/stripes-authority-components';

export const MAIN_PANE_HEIGHT = '609px';
export const columnWidths = {
  [searchResultListColumns.SELECT]: { min: 30, max: 30 },
  [searchResultListColumns.AUTH_REF_TYPE]: { min: 155, max: 166 },
  [searchResultListColumns.HEADING_REF]: { min: 390, max: 435 },
  [searchResultListColumns.HEADING_TYPE]: { min: 140, max: 145 },
};
