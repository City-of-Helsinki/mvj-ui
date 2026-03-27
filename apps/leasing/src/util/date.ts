import get from "lodash/get";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import isAfter from "date-fns/isAfter";
import isValid from "date-fns/isValid";
import subDays from "date-fns/subDays";
import getHours from "date-fns/getHours";
import getMinutes from "date-fns/getMinutes";

/**
 * Test is date valid
 * @param {number} date
 * @returns {boolean}
 */
export const isValidDate = (date: any): boolean =>
  isValid(date) && isAfter(date, new Date("1000-01-01"));

/**
 * Get day and month object
 * @param {number} day
 * @param {number} month
 * @returns {Object}
 */
export const getDayMonth = (
  day: number,
  month: number,
): {
  day: number;
  month: number;
} => ({
  day,
  month,
});

/**
 * Get current year as string
 * @returns {string}
 */
export const getCurrentYear = (): string => new Date().getFullYear().toString();

/**
 * Sort to ascending order by start and end date
 * @param {Object} a
 * @param {Object} b
 * @param {string} startDatePath
 * @param {string} endDatePath
 * @returns {number}
 */
export const sortByStartAndEndDateAsc = (
  a: Record<string, any>,
  b: Record<string, any>,
  startDatePath: string = "start_date",
  endDatePath: string = "end_date",
): number => {
  const startA = get(a, startDatePath) || "0000-01-01",
    endA = get(a, endDatePath) || "9999-12-31",
    startB = get(b, startDatePath) || "0000-01-01",
    endB = get(b, endDatePath) || "9999-12-31";
  if (startA > startB) return 1;
  if (startA < startB) return -1;
  if (endA > endB) return 1;
  if (endA < endB) return -1;
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
export const sortByStartAndEndDateDesc = (
  a: Record<string, any>,
  b: Record<string, any>,
  startDatePath: string = "start_date",
  endDatePath: string = "end_date",
): number => {
  const startA = get(a, startDatePath) || "0000-01-01",
    endA = get(a, endDatePath) || "9999-12-31",
    startB = get(b, startDatePath) || "0000-01-01",
    endB = get(b, endDatePath) || "9999-12-31";
  if (startA > startB) return -1;
  if (startA < startB) return 1;
  if (endA > endB) return -1;
  if (endA < endB) return 1;
  return 0;
};

/**
 * Test are date ranges collapsing
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
export const isDateRangesCollapsing = (
  a: Record<string, any>,
  b: Record<string, any>,
): boolean => {
  const startA = a.start_date || "0000-01-01",
    endA = a.end_date || "9999-12-31",
    startB = b.start_date || "0000-01-01",
    endB = b.end_date || "9999-12-31";
  if (startA < startB && endA < startB) return false;
  if (startB < startA && endB < startA) return false;
  return true;
};

/**
 * Split date ranges
 * @param {Object} a
 * @param {Object} b
 * @returns {Object[]}
 */
export const splitDateRanges = (
  a: Record<string, any>,
  b: Record<string, any>,
): Array<Record<string, any>> => {
  const sortedDateRanges = [{ ...a }, { ...b }].sort(sortByStartAndEndDateAsc);
  const item0 = sortedDateRanges[0];
  const item1 = sortedDateRanges[1];
  const start0 = item0.start_date || "0000-01-01",
    end0 = item0.end_date || "9999-12-31",
    start1 = item1.start_date || "0000-01-01",
    end1 = item1.end_date || "9999-12-31";
  const dateRanges = [];

  if (start0 === start1) {
    if (end0 < end1) {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
      dateRanges.push({
        start_date: format(addDays(new Date(item0.end_date), 1), "yyyy-MM-dd"),
        end_date: item1.end_date,
      });
    } else {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
    }
  } else {
    if (end0 < start1) {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: item0.end_date,
      });
      dateRanges.push({
        start_date: item1.start_date,
        end_date: item1.end_date,
      });
    } else {
      dateRanges.push({
        start_date: item0.start_date,
        end_date: format(subDays(new Date(item1.start_date), 1), "yyyy-MM-dd"),
      });

      if (end0 < end1) {
        dateRanges.push({
          start_date: item1.start_date,
          end_date: item0.end_date,
        });
        dateRanges.push({
          start_date: format(
            addDays(new Date(item0.end_date), 1),
            "yyyy-MM-dd",
          ),
          end_date: item1.end_date,
        });
      } else if (end0 > end1) {
        dateRanges.push({
          start_date: item1.start_date,
          end_date: format(subDays(new Date(item1.end_date), 1), "yyyy-MM-dd"),
        });
        dateRanges.push({
          start_date: item1.end_date,
          end_date: item0.end_date,
        });
      } else {
        dateRanges.push({
          start_date: item1.start_date,
          end_date: item0.end_date,
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
export const getSplittedDateRanges = (
  items: Array<Record<string, any>>,
  startDatePath: string = "start_date",
  endDatePath: string = "end_date",
): Array<Record<string, any>> => {
  const dateRanges = [];
  // Split all items to date ranges
  items.forEach((item) => {
    let isAdded = false;

    for (let i = dateRanges.length - 1; i >= 0; i--) {
      if (i > 10) return;

      // No test covers this case. Happens in some cases when too many tenants
      if (
        isDateRangesCollapsing(
          {
            start_date: get(item, startDatePath),
            end_date: get(item, endDatePath),
          },
          dateRanges[i],
        )
      ) {
        const splittedRanges = splitDateRanges(
          {
            start_date: get(item, startDatePath),
            end_date: get(item, endDatePath),
          },
          dateRanges[i],
        );
        dateRanges.splice(i, 1);
        dateRanges.push(...splittedRanges);
        isAdded = true;
      }
    }

    if (!isAdded) {
      dateRanges.push({
        start_date: get(item, startDatePath),
        end_date: get(item, endDatePath),
      });
    }
  });
  // Filter out all collapsing date ranges until all date ranges are separate
  let valid = false;
  let loopCount = 0;

  while (!valid) {
    valid = true;

    for (let i = dateRanges.length - 1; i >= 0; i--) {
      for (let j = dateRanges.length - 1; j > i; j--) {
        if (isDateRangesCollapsing(dateRanges[i], dateRanges[j])) {
          const splittedRanges = splitDateRanges(dateRanges[i], dateRanges[j]);
          dateRanges.splice(j, 1);
          dateRanges.splice(i, 1);
          dateRanges.push(...splittedRanges);
          dateRanges.sort(sortByStartAndEndDateAsc);
          valid = false;
          loopCount++;
        }

        if (loopCount > 25) {
          valid = true;
          dateRanges.splice(1);
          break;
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
export const getSplittedDateRangesWithItems = (
  items: Array<Record<string, any>>,
  startDatePath: string = "start_date",
  endDatePath: string = "end_date",
): Array<Record<string, any>> => {
  if (!items) return [];
  const dateRanges = getSplittedDateRanges(items, startDatePath, endDatePath);
  const dateRangesWithItems = dateRanges.map((item) => ({
    ...item,
    items: [],
  }));
  // Add items to date ranges
  items.forEach((item) => {
    dateRangesWithItems.forEach((range) => {
      if (
        isDateRangesCollapsing(
          {
            start_date: get(item, startDatePath),
            end_date: get(item, endDatePath),
          },
          range,
        )
      ) {
        range.items.push(item);
      }
    });
  });
  return dateRangesWithItems;
};

/**
 * Hours and minutes
 * @param {number} date
 * @returns {string}
 */
export const getHoursAndMinutes = (date: any): string => {
  if (!date) return "-";
  const dateObject = new Date(date);
  const hours = getHours(dateObject)
    ? getHours(dateObject) < 10
      ? `0${getHours(dateObject)}`
      : getHours(dateObject)
    : "00";
  const minutes = getMinutes(dateObject)
    ? getMinutes(dateObject) < 10
      ? `0${getMinutes(dateObject)}`
      : getMinutes(dateObject)
    : "00";
  return `${hours}:${minutes}`;
};
