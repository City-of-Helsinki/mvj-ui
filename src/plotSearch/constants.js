// @flow
import {TableSortOrder} from '$src/enums';
import {PlotSearchStageTypes} from '$src/plotSearch/enums';

/**
 * Default plotSearch states value for plotSearch list search
 * @const {string[]}
 */
export const DEFAULT_PLOT_SEARCH_STATES: Array<string> = [];

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

export const AUTOMATIC_PLOT_SEARCH_STAGES = [
  PlotSearchStageTypes.IN_PREPARATION,
  PlotSearchStageTypes.IN_ACTION,
];

export const FIELDS_LOCKED_FOR_EDITING = [
  'plot_search_targets',
  'type',
  'subtype',
  'search_class',
  'begin_at',
  'end_at',
  'created_at',
  'modified_at',
  'form',
];
