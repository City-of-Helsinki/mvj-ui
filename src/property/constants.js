// @flow
import {TableSortOrder} from '$src/enums';

/**
 * Default property states value for property list search
 * @const {string[]}
 */
export const DEFAULT_PROPERTY_STATES = [];

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
 * Property state options for property list table filter
 * @const {[*]}
 */
export const propertyStateFilterOptions = [
  {value: 'filter_one', label: 'Suodatusehto 1'},
];
