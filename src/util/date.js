// @flow
import moment from 'moment';
import get from 'lodash/get';

/**
 * Get day and month object
 */
export const getDayMonth = (day: number, month: number) => ({day, month});

/**
 * Get current year as string
 * @returns {string}
 */
export  const getCurrentYear = () => new Date().getFullYear().toString();

/**
 * Sort to ascending order by start and end date
 * @param {Object} a
 * @param {Object} b
 * @param {string} startDatePath
 * @param {string} endDatePath
 * @returns {number}
 */
export const sortByStartAndEndDateAsc = (a: Object, b: Object, startDatePath?: string = 'start_date', endDatePath?: string = 'end_date') => {
  const startA = get(a, startDatePath, '0000-01-01'),
    endA = get(a, endDatePath, '9999-31-12'),
    startB = get(b, startDatePath, '0000-01-01'),
    endB = get(b, endDatePath, '9999-31-12');

  if(startA > startB) return 1;
  if(startA < startB) return -1;
  if(endA > endB) return 1;
  if(endA < endB) return -1;
  return 0;
};

/**
 * Sort to descending order by start and end date
 * @param {Object} a
 * @param {Object} b
 * @param {string} startDatePath
 * @param {string} endDatePath
 * @returns {number}
 */
export const sortByStartAndEndDateDesc = (a: Object, b: Object, startDatePath?: string = 'start_date', endDatePath?: string = 'end_date') => {
  const startA = get(a, startDatePath, '0000-01-01'),
    endA = get(a, endDatePath, '9999-31-12'),
    startB = get(b, startDatePath, '0000-01-01'),
    endB = get(b, endDatePath, '9999-31-12');

  if(startA > startB) return -1;
  if(startA < startB) return 1;
  if(endA > endB) return -1;
  if(endA < endB) return 1;
  return 0;
};


/**
 * Test is date ranges collapsing
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
export  const isDateRangesCollapsing = (a: Object, b: Object): boolean => {
  const startA = a.start_date || '0000-01-01',
    endA = a.end_date || '9999-31-12',
    startB = b.start_date || '0000-01-01',
    endB = b.end_date || '9999-31-12';

  if(startA < startB && endA < startB) return false;
  if(startB < startA && endB < startA) return false;
  return true;
};

/**
 * Split date ranges
 * @param {Object} a
 * @param {Object} b
 * @returns {Object[]}
 */
export  const splitDateRanges = (a: Object, b: Object): Array<Object> => {
  const sortedDateRanges = [{...a}, {...b}].sort(sortByStartAndEndDateAsc);
  const item0 = sortedDateRanges[0];
  const item1 = sortedDateRanges[1];
  const start0 = item0.start_date || '0000-01-01',
    end0 = item0.end_date || '9999-31-12',
    start1 = item1.start_date || '0000-01-01',
    end1 = item1.end_date || '9999-31-12';
  const dateRanges = [];

  if(start0 === start1) {
    if(end0 < end1) {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
      dateRanges.push({
        start_date: moment(item0.end_date).add(1, 'days').format('YYYY-MM-DD'),
        end_date: item1.end_date,
      });
    } else {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
    }

  } else if(start0 < start1) {
    if(end0 < start1) {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
      dateRanges.push({
        start_date: item1.start_date,
        end_date: item1.end_date,
      });
    } else if(end0 >= start1) {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: moment(item1.start_date).subtract(1, 'days').format('YYYY-MM-DD'),
      });
      dateRanges.push({
        start_date: item1.start_date,
        end_date: item0.end_date,
      });

      if(end0 < end1) {
        dateRanges.push({
          start_date: moment(item0.end_date).add(1, 'days').format('YYYY-MM-DD'),
          end_date: item1.end_date,
        });
      }
    }
  }

  return dateRanges;
};

/**
 * Get splitted date ranges
 * @param {Object[]} items
 * @param {string} startDatePath
 * @param {string} endDatePath
 * @returns {Object[]}
 */
export  const getSplittedDateRanges = (items: Array<Object>, startDatePath?: string = 'start_date', endDatePath?: string = 'end_date'): Array<Object> => {
  const dateRanges = [];

  // Split all items to date ranges
  items.forEach((item) => {
    let isAdded = false;
    for(let i = dateRanges.length - 1; i >= 0; i--) {
      if(isDateRangesCollapsing({start_date: get(item, startDatePath), end_date: get(item, endDatePath)}, dateRanges[i])) {
        const splittedRanges = splitDateRanges({start_date: get(item, startDatePath), end_date: get(item, endDatePath)}, dateRanges[i]);

        dateRanges.splice(i, 1);
        dateRanges.push(...splittedRanges);
        isAdded = true;
      }
    }

    if(!isAdded) {
      dateRanges.push({
        start_date: get(item, startDatePath),
        end_date: get(item, endDatePath),
      });
    }
  });

  // Filter out all collapsing date ranges until all date ranges are separate
  let valid = false;
  while(!valid) {
    valid = true;

    for(let i = dateRanges.length - 1; i >= 0; i--) {
      for(let j = dateRanges.length - 1; j > i; j--) {
        if(isDateRangesCollapsing(dateRanges[i], dateRanges[j])) {
          const splittedRanges = splitDateRanges(dateRanges[i], dateRanges[j]);

          dateRanges.splice(j, 1);
          dateRanges.splice(i, 1);
          dateRanges.push(...splittedRanges);
          dateRanges.sort(sortByStartAndEndDateAsc);
          valid = false;
        }
      }
    }
  }

  dateRanges.sort(sortByStartAndEndDateAsc);

  return dateRanges;
};

/**
 * Get splitted date ranges with items
 * @param {Object[]} items
 * @param {string} startDatePath
 * @param {string} endDatePath
 * @returns {Object[]}
 */
export  const getSplittedDateRangesWithItems = (items: Array<Object>, startDatePath?: string = 'start_date', endDatePath?: string = 'end_date'): Array<Object> => {
  const dateRanges = getSplittedDateRanges(items, startDatePath, endDatePath);
  const dateRangesWithItems = dateRanges.map((item) => ({
    ...item,
    items: [],
  }));

  // Add items to date ranges
  items.forEach((item) => {
    dateRangesWithItems.forEach((range) => {
      if(isDateRangesCollapsing({
        start_date: get(item, startDatePath),
        end_date: get(item, endDatePath),
      }, range)) {
        range.items.push(item);
      }
    });
  });

  return dateRangesWithItems;
};
