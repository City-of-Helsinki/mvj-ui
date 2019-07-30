// @flow
import {expect} from 'chai';

import {
  isValidDate,
  getDayMonth,
  getCurrentYear,
  sortByStartAndEndDateAsc,
  sortByStartAndEndDateDesc,
  isDateRangesCollapsing,
  splitDateRanges,
  getSplittedDateRanges,
  getSplittedDateRangesWithItems,
} from './date';

// $FlowFixMe
describe('utils', () => {

  // $FlowFixMe
  describe('date helpers', () => {

    // $FlowFixMe
    it('0999-12-31 should be invalid date', () => {
      expect(isValidDate(new Date('0999-12-31'))).to.deep.equal(false);
    });

    it('2019-12-32 should be invalid date', () => {
      expect(isValidDate(new Date('2019-12-32'))).to.deep.equal(false);
    });

    it('2019-13-31 should be invalid date', () => {
      expect(isValidDate(new Date('2019-12-32'))).to.deep.equal(false);
    });

    it('2019-12-31 should be valid date', () => {
      expect(isValidDate(new Date('2019-08-01'))).to.deep.equal(true);
    });

    it('should return day and month object', () => {
      const dayMonth = {
        day: 12, 
        month: 9,
      };

      expect(getDayMonth(12, 9)).to.deep.equal(dayMonth);
    });

    it('should return current year', () => {
      expect(getCurrentYear()).to.deep.equal(new Date().getFullYear().toString());
    });

    it('sortByStartAndEndDateAsc should return -1 (1.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-31',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateAsc should return -1 (2.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-02',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateAsc should return -1 (3.)', () => {
      const a = {
        start_date: null,
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateAsc should return 1 (4.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: null,
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateAsc should return 1 (5.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: null,
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateAsc should return -1 (6.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: null,
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateAsc should return 1 (7.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-31',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateAsc should return 1 (8.)', () => {
      const a = {
        start_date: '2019-01-02',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateAsc should return 0 (9.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };

      expect(sortByStartAndEndDateAsc(a, b)).to.deep.equal(0);
    });

    it('sortByStartAndEndDateDesc should return 1 (1.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-31',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateDesc should return 1 (2.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-02',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateDesc should return 1 (3.)', () => {
      const a = {
        start_date: null,
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateDesc should return -1 (4.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: null,
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateDesc should return -1 (5.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: null,
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateDesc should return 1 (6.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: null,
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(1);
    });

    it('sortByStartAndEndDateDesc should return -1 (7.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-31',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateDesc should return -1 (8.)', () => {
      const a = {
        start_date: '2019-01-02',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(-1);
    });

    it('sortByStartAndEndDateDesc should return 0 (9.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };

      expect(sortByStartAndEndDateDesc(a, b)).to.deep.equal(0);
    });

    it('isDateRangesCollapsing should return false (1.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(false);
    });

    it('isDateRangesCollapsing should return true (2.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-02-30',
      };
      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(true);
    });

    it('isDateRangesCollapsing should return false (3.)', () => {
      const a = {
        start_date: null,
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(false);
    });

    it('isDateRangesCollapsing should return true (4.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: null,
      };
      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(true);
    });

    it('isDateRangesCollapsing should return true (5.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: null,
        end_date: '2019-02-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(true);
    });

    it('isDateRangesCollapsing should return false (6.)', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const b = {
        start_date: '2019-02-01',
        end_date: null,
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(false);
    });

    it('isDateRangesCollapsing should return false (1.)', () => {
      const a = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };

      expect(isDateRangesCollapsing(a, b)).to.deep.equal(false);
    });

    it('should return original ranges', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };

      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-30',
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        a,
        b,
      ]);
    });

    it('should return combined ranges', () => {
      const a = {
        start_date: null,
        end_date: null,
      };

      const b = {
        start_date: null,
        end_date: null,
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        a,
      ]);
    });

    it('should return splitted ranges', () => {
      const a = {
        start_date: null,
        end_date: '2019-02-15',
      };

      const b = {
        start_date: '2019-02-01',
        end_date: null,
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        {
          start_date: null,
          end_date: '2019-01-31',
        },
        {
          start_date: '2019-02-01',
          end_date: '2019-02-15',
        },
        {
          start_date: '2019-02-16',
          end_date: null,
        },
      ]);
    });

    it('should return splitted ranges', () => {
      const a = {
        start_date: null,
        end_date: '2019-02-15',
      };

      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-15',
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        {
          start_date: null,
          end_date: '2019-01-31',
        },
        {
          start_date: '2019-02-01',
          end_date: '2019-02-15',
        },
      ]);
    });

    it('should return splitted ranges', () => {
      const a = {
        start_date: null,
        end_date: null,
      };

      const b = {
        start_date: '2019-02-01',
        end_date: '2019-02-20',
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        {
          start_date: null,
          end_date: '2019-01-31',
        },
        {
          start_date: '2019-02-01',
          end_date: '2019-02-19',
        },
        {
          start_date: '2019-02-20',
          end_date: null,
        },
      ]);
    });

    it('should return splitted ranges', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-15',
      };

      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-15',
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        {
          start_date: '2019-01-01',
          end_date: '2019-01-15',
        },
      ]);
    });

    it('should return splitted ranges', () => {
      const a = {
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };

      const b = {
        start_date: '2019-01-01',
        end_date: '2019-01-15',
      };

      expect(splitDateRanges(a, b)).to.deep.equal([
        {
          start_date: '2019-01-01',
          end_date: '2019-01-15',
        },

        {
          start_date: '2019-01-16',
          end_date: '2019-01-30',
        },
      ]);
    });

    it('should get splitted date ranges from items', () => {
      const items = [
        {
          id: 1,
          start_date: '2019-01-01',
          end_date: '2019-01-30',
        },
        {
          id: 2,
          start_date: '2019-01-01',
          end_date: '2019-01-15',
        },
        {
          id: 3,
          start_date: '2019-01-10',
          end_date: '2019-02-15',
        },
        {
          id: 4,
          start_date: '2019-03-10',
          end_date: '2019-03-15',
        },
      ];
      
      expect(getSplittedDateRanges(items)).to.deep.equal([
        {
          start_date: '2019-01-01',
          end_date: '2019-01-09',
        },
        {
          start_date: '2019-01-10',
          end_date: '2019-01-15',
        },
        {
          start_date: '2019-01-16',
          end_date: '2019-01-29',
        },
        {
          start_date: '2019-01-30',
          end_date: '2019-02-15',
        },
        {
          start_date: '2019-03-10',
          end_date: '2019-03-15',
        },
      ]);
    });

    it('should get splitted date ranges with items from items', () => {
      const item1 = {
        id: 1,
        start_date: '2019-01-01',
        end_date: '2019-01-30',
      };
      const item2 = {
        id: 2,
        start_date: '2019-01-01',
        end_date: '2019-01-15',
      };
      const item3 = {
        id: 3,
        start_date: '2019-01-10',
        end_date: '2019-02-15',
      };
      const item4 = {
        id: 4,
        start_date: '2019-03-10',
        end_date: '2019-03-15',
      };
      const items = [
        item1,
        item2,
        item3,
        item4,
      ];
      
      expect(getSplittedDateRangesWithItems(items)).to.deep.equal([
        {
          start_date: '2019-01-01',
          end_date: '2019-01-09',
          items: [
            item1,
            item2,
          ],
        },
        {
          start_date: '2019-01-10',
          end_date: '2019-01-15',
          items: [
            item1,
            item2,
            item3,
          ],
        },
        {
          start_date: '2019-01-16',
          end_date: '2019-01-29',
          items: [
            item1,
            item3,
          ],
        },
        {
          start_date: '2019-01-30',
          end_date: '2019-02-15',
          items: [
            item1,
            item3,
          ],
        },
        {
          start_date: '2019-03-10',
          end_date: '2019-03-15',
          items: [
            item4,
          ],
        },
      ]);
    });
  });
});
