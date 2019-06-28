// @flow
import {TableSortOrder} from '$src/enums';

/**
 * Default sort key of sap invoices list page
 * @readonly
 * @const {string}
 */
export const DEFAULT_SORT_KEY = 'due_date';

/**
 * Default sort order of sap invoices list page
 * @readonly
 * @const {string}
 */
export const DEFAULT_SORT_ORDER = TableSortOrder.DESCENDING;
