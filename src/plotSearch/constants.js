// @flow
import {TableSortOrder} from '$src/enums';

/**
 * Default plotSearch states value for plotSearch list search
 * @const {string[]}
 */
export const DEFAULT_PLOT_SEARCH_STATES = [];

/**
 * Default sort key for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_KEY = 'identifier';

/**
 * Default sort order for lease list table
 * @const {string}
 */
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;

/**
 * PlotSearch state options for plotSearch list table filter
 * @const {[*]}
 */
export const plotSearchStateFilterOptions = [
  {value: 'filter_one', label: 'Suodatusehto 1'},
];
