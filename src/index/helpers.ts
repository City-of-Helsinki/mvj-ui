import { sortNumberByKeyDesc } from "@/util/helpers";

/** 
 * Get content yearly indexes to display on index table
 * @param {Object[]} indexList
 * @returns {Object[]}
 */
export const getContentYearlyIndexes = (indexList: Array<Record<string, any>>): Array<Record<string, any>> => {
  const yearlyIndexes = [];
  indexList.forEach(index => {
    const n = yearlyIndexes.findIndex(item => item.year === index.year);

    if (n === -1) {
      yearlyIndexes.push({
        year: index.year,
        indexList: {
          [index.month || 'year']: index.number
        }
      });
    } else {
      yearlyIndexes[n].indexList = { ...yearlyIndexes[n].indexList,
        [index.month || 'year']: index.number
      };
    }
  });
  return yearlyIndexes.sort((a, b) => sortNumberByKeyDesc(a, b, 'year'));
};