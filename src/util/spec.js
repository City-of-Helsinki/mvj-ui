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
import {
  composePageTitle,
  getSearchQuery,
  getUrlParams,
  fixedLengthNumber,
  getEpochTime,
  isEmptyValue,
  formatNumberWithThousandSeparator,
  formatDecimalNumber,
  formatNumber,
  isDecimalNumberStr,
  convertStrToDecimalNumber,
  formatDate,
  formatDateRange,
  getReferenceNumberLink,
  findItemById,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringAsc,
  sortStringDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
  sortByOptionsAsc,
  sortByOptionsDesc,
  addEmptyOption,
  isFieldRequired,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isMethodAllowed,
  hasPermissions,
  getFieldAttributeOptions,
  getFieldOptions,
  humanReadableByteCount,
  hasNumber,
  findFromOcdString,
  createPaikkatietovipunenUrl,
  getApiResponseCount,
  getApiResponseMaxPage,
  getApiResponseResults,
  isActive,
  isArchived,
} from './helpers';
import {
  getCoordinatesOfGeometry,
  getCenterFromCoordinates,
} from './map';

// $FlowFixMe
describe('utils', () => {

  // $FlowFixMe
  describe('date.js', () => {

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

    it('should exit loop if stuck', () => {
      const items = [
        {
          id: 1,
          start_date: '2009-09-02',
          end_date: '1111-01-01',
        },
        {
          id: 2,
          start_date: '2009-09-02',
          end_date: null,
        },
      ];
      
      expect(getSplittedDateRanges(items)).to.deep.equal([
        {
          'start_date': '1110-12-27',
          'end_date': '1110-12-27',
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

  describe('helpers.js', () => {

    // $FlowFixMe
    it('Should return correct title', () => {
      expect(composePageTitle('foo')).to.deep.equal('foo | Maanvuokrausjärjestelmä | Helsingin Kaupunki');
      expect(composePageTitle()).to.deep.equal('Maanvuokrausjärjestelmä | Helsingin Kaupunki');
      expect(composePageTitle('foo', false)).to.deep.equal('foo');
    });

    it('Should return search query as string from an object', () => {
      expect(getSearchQuery({
        foo1: undefined,
        foo2: null,
        foo3: 123,
        foo4: false,
        foo5: 'test',
        foo6: ['1', '2'],
      })).to.deep.equal('?foo3=123&foo4=false&foo5=test&foo6=1,2');
      expect(getSearchQuery({
        page: 1,
      })).to.deep.equal('');
      expect(getUrlParams('?foo3=123&foo4=false&foo5=test&foo6=1,2&foo6=3,4&foo6=5&foo7=test1&foo7=test2')).to.deep.equal({
        foo3: '123', 
        foo4: 'false', 
        foo5: 'test', 
        foo6: ['1', '2', '3', '4', '5'],
        foo7: ['test1', 'test2'],
      });
    });

    it('Should return search params object from an empty string', () => {
      expect(getUrlParams()).to.deep.equal({});
    });

    it('Should return fixed length number', () => {
      expect(fixedLengthNumber(1)).to.deep.equal('01');
      expect(fixedLengthNumber(123)).to.deep.equal('123');
      expect(fixedLengthNumber(null)).to.deep.equal('');
      expect(fixedLengthNumber(1, 4)).to.deep.equal('0001');
    });

    it('epoch time should be a number', () => {
      expect(getEpochTime()).to.be.a('number');
    });

    it('should be empty value', () => {
      expect(isEmptyValue(undefined)).to.deep.equal(true);
      expect(isEmptyValue(null)).to.deep.equal(true);
      expect(isEmptyValue('')).to.deep.equal(true);
    });

    it('should not be empty value', () => {
      expect(isEmptyValue(0)).to.deep.equal(false);
      expect(isEmptyValue('foo')).to.deep.equal(false);
    });

    it('should return value with thousand separator', () => {
      expect(formatNumberWithThousandSeparator('10000000.1234')).to.deep.equal('10 000 000.1234');
      expect(formatNumberWithThousandSeparator('10000000')).to.deep.equal('10 000 000');
      expect(formatNumberWithThousandSeparator(null)).to.deep.equal('');
      expect(formatNumberWithThousandSeparator('10000000,1234', '.')).to.deep.equal('10.000.000,1234');
    });

    it('should format decimal number', () => {
      expect(formatDecimalNumber(10000000.1234)).to.deep.equal('10000000,12');
      expect(formatDecimalNumber(10000000)).to.deep.equal('10000000,00');
      expect(formatDecimalNumber(null)).to.deep.equal(null);
    });

    it('should format number', () => {
      expect(formatNumber(10000000.1234)).to.deep.equal('10 000 000,12');
      expect(formatNumber(10000000)).to.deep.equal('10 000 000,00');
      expect(formatNumber(null)).to.deep.equal('');
    });

    it('should be decimal number string', () => {
      expect(isDecimalNumberStr('123')).to.deep.equal(true);
      expect(isDecimalNumberStr('123 456,123')).to.deep.equal(true);
    });

    it('should not be decimal number string', () => {
      expect(isDecimalNumberStr('123qwe')).to.deep.equal(false);
      expect(isDecimalNumberStr('123.12.12')).to.deep.equal(false);
      expect(isDecimalNumberStr(null)).to.deep.equal(false);
    });

    it('should covert string to a decimal number', () => {
      expect(convertStrToDecimalNumber('123')).to.deep.equal(123);
      expect(convertStrToDecimalNumber('123 456,123')).to.deep.equal(123456.123);
    });

    it('should return null when trying to convert invalid string to decimal number', () => {
      expect(convertStrToDecimalNumber('123qwe')).to.deep.equal(null);
      expect(convertStrToDecimalNumber(null)).to.deep.equal(null);
    });

    it('should format date  to a default form', () => {
      expect(formatDate('2019-05-09T15:26:54.889853')).to.deep.equal('09.05.2019');
    });

    it('should format date to a custom form', () => {
      expect(formatDate('2019-05-09T15:26:54.889853', 'dd.MM.yyyy H.mm')).to.deep.equal('09.05.2019 15.26');
    });

    it('should format date unix time stamp to a date string', () => {
      expect(formatDate(32345678912)).to.deep.equal('10.01.1971');
    });
    
    it('should return empty string when trying to format null date', () => {
      expect(formatDate(null)).to.deep.equal('');
    });

    it('should format date range', () => {
      expect(formatDateRange(32345678912, '2019-05-09T15:26:54.889853')).to.deep.equal('10.01.1971–09.05.2019');
      expect(formatDateRange(null, '2019-05-09T15:26:54.889853')).to.deep.equal('–09.05.2019');
      expect(formatDateRange(32345678912, null)).to.deep.equal('10.01.1971–');
      expect(formatDateRange(null, null)).to.deep.equal('');
    });

    it('should get reference number link', () => {
      expect(getReferenceNumberLink('123')).to.deep.equal('https://dev.hel.fi/paatokset/asia/123');
      expect(getReferenceNumberLink('123 456')).to.deep.equal('https://dev.hel.fi/paatokset/asia/123-456');
      expect(getReferenceNumberLink(null)).to.deep.equal(null);
    });

    it('should find item from collection by id', () => {
      const items = [
        {id: 1},
        {id: 2},
        {id: 3},
      ];
      expect(findItemById(items, 2)).to.deep.equal({id: 2});
    });

    it('should not find item from collection by id', () => {
      const items = [
        {id: 1},
        {id: 2},
        {id: 3},
      ];
      expect(findItemById(items, 4)).to.deep.equal(undefined);
    });

    it('should get label of an option', () => {
      const options = [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'},
        {value: 3, label: 'test3'},
      ];
      expect(getLabelOfOption(options, 1)).to.deep.equal('test1');
    });

    it('should not get label of option', () => {
      const options = [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'},
        {value: 3, label: 'test3'},
      ];
      expect(getLabelOfOption(options, 4)).to.deep.equal(null);
    });

    it('should not get label of option when value is null', () => {
      const options = [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'},
        {value: 3, label: 'test3'},
      ];
      expect(getLabelOfOption(options, null)).to.deep.equal(null);
    });

    it('should sort numerical values in ascending order (1.)', () => {
      const items = [
        {value: 1},
        {value: 3},
        {value: 2},
      ];

      const sortedItems = [
        {value: 1},
        {value: 2},
        {value: 3},
      ];

      expect(items.sort((a, b) => sortNumberByKeyAsc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort numerical values in ascending order (2.)', () => {
      const items = [
        {value: 1},
        {value: 3},
        {value: 2},
      ];
      
      expect(items.sort((a, b) => sortNumberByKeyAsc(a, b, 'test'))).to.deep.equal(items);
    });

    it('should sort numerical values in ascending order (3.)', () => {
      const items = [
        {value: '11111'},
        {value: '3'},
        {value: '222'},
      ];

      const sortedItems = [
        {value: '3'},
        {value: '222'},
        {value: '11111'},
      ];

      expect(items.sort((a, b) => sortNumberByKeyAsc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort numerical values in descending order (1.)', () => {
      const items = [
        {value: 1},
        {value: 3},
        {value: 2},
      ];

      const sortedItems = [
        {value: 3},
        {value: 2},
        {value: 1},
      ];

      expect(items.sort((a, b) => sortNumberByKeyDesc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort numerical values in descending order (2.)', () => {
      const items = [
        {value: 1},
        {value: 3},
        {value: 2},
      ];
      
      expect(items.sort((a, b) => sortNumberByKeyDesc(a, b, 'test'))).to.deep.equal(items);
    });

    it('should sort numerical values in descending order (3.)', () => {
      const items = [
        {value: '11111'},
        {value: '3'},
        {value: '222'},
      ];

      const sortedItems = [
        {value: '11111'},
        {value: '222'},
        {value: '3'},
      ];

      expect(items.sort((a, b) => sortNumberByKeyDesc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort string in ascending order', () => {
      const items = [
        'qwerty',
        '324',
        null,
        'ytrewq',
        '123',
      ];

      const sortedItems = [
        null,
        '123',
        '324',
        'qwerty',
        'ytrewq',
      ];

      expect(items.sort(sortStringAsc)).to.deep.equal(sortedItems);
    });

    it('should sort string in descending order', () => {
      const items = [
        'qwerty',
        '324',
        null,
        'ytrewq',
        '123',
      ];

      const sortedItems = [
        'ytrewq',
        'qwerty',
        '324',
        '123',
        null,
      ];

      expect(items.sort(sortStringDesc)).to.deep.equal(sortedItems);
    });

    it('should sort object by a string in ascending order', () => {
      const items = [
        {id: 1, value: 'qwerty'},
        {id: 2, value: '324'},
        {id: 3, value: null},
        {id: 4, value: 'ytrewq'},
        {id: 5, value: '123'},
      ];

      const sortedItems = [
        {id: 3, value: null},
        {id: 5, value: '123'},
        {id: 2, value: '324'},
        {id: 1, value: 'qwerty'},
        {id: 4, value: 'ytrewq'},
      ];

      expect(items.sort((a, b) => sortStringByKeyAsc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort object by a string in descending order', () => {
      const items = [
        {id: 1, value: null},
        {id: 2, value: 'qwerty'},
        {id: 3, value: '324'},
        {id: 4, value: 'ytrewq'},
        {id: 5, value: '123'},
      ];

      const sortedItems = [
        {id: 4, value: 'ytrewq'},
        {id: 2, value: 'qwerty'},
        {id: 3, value: '324'},
        {id: 5, value: '123'},
        {id: 1, value: null},
      ];

      expect(items.sort((a, b) => sortStringByKeyDesc(a, b, 'value'))).to.deep.equal(sortedItems);
    });

    it('should sort object by an option label in ascending order', () => {
      const options = [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'},
        {value: 3, label: 'test3'},
      ];

      const items = [
        {id: 2, value: 1},
        {id: 3, value: 3},
        {id: 4, value: 2},
        {id: 6, value: null},
      ];

      const sortedItems = [
        {id: 6, value: null},
        {id: 2, value: 1},
        {id: 4, value: 2},
        {id: 3, value: 3},
      ];

      expect(items.sort((a, b) => sortByOptionsAsc(a, b, 'value', options))).to.deep.equal(sortedItems);
    });

    it('should sort object by an option label in descending order', () => {
      const options = [
        {value: 1, label: 'test1'},
        {value: 2, label: 'test2'},
        {value: 3, label: 'test3'},
      ];

      const items = [
        {id: 4, value: 2},
        {id: 5, value: 1},
        {id: 6, value: null},
        {id: 8, value: 3},
      ];

      const sortedItems = [
        {id: 8, value: 3},
        {id: 4, value: 2},
        {id: 5, value: 1},
        {id: 6, value: null},
      ];

      expect(items.sort((a, b) => sortByOptionsDesc(a, b, 'value', options))).to.deep.equal(sortedItems);
    });

    it('should add empty options to an options array', () => {
      const options = [
        {value: 1, label: 'test1'},
      ];

      const editedOptions = [
        {value: '', label: ''},
        {value: 1, label: 'test1'},
      ];

      expect(addEmptyOption(options)).to.deep.equal(editedOptions);
    });

    it('field should be required', () => {
      const attributes = {
        field: {
          required: true,
        },
      };

      expect(isFieldRequired(attributes, 'field')).to.deep.equal(true);
    });

    it('field should not be required', () => {
      const attributes = {
        field: {
          required: false,
        },
      };

      expect(isFieldRequired(attributes, 'field')).to.deep.equal(false);
    });

    it('field should not be required', () => {
      const attributes = {
        field: {
        },
      };

      expect(isFieldRequired(attributes, 'field')).to.deep.equal(false);
    });

    it('field should be allowed to edit', () => {
      const attributes = {
        field: {
          read_only: false,
        },
      };

      expect(isFieldAllowedToEdit(attributes, 'field')).to.deep.equal(true);
    });

    it('field should not be allowed to edit', () => {
      const attributes = {
        field: {
          read_only: true,
        },
      };

      expect(isFieldAllowedToEdit(attributes, 'field')).to.deep.equal(false);
    });

    it('field should not be allowed to edit', () => {
      const attributes = {
        field: {
        },
      };

      expect(isFieldAllowedToEdit(attributes, 'field_not_found')).to.deep.equal(false);
    });

    it('field should not be allowed to read', () => {
      const attributes = {
        field: {
        },
      };

      expect(isFieldAllowedToRead(attributes, 'field')).to.deep.equal(true);
    });

    it('field should not be allowed to edit', () => {
      const attributes = {
        field: {
        },
      };

      expect(isFieldAllowedToRead(attributes, 'field_not_found')).to.deep.equal(false);
    });

    it('method should be allowed', () => {
      const methods = {
        GET: true,
      };

      expect(isMethodAllowed(methods, 'GET')).to.deep.equal(true);
    });

    it('method should not be allowed', () => {
      const methods = {
        GET: false,
      };

      expect(isMethodAllowed(methods, 'GET')).to.deep.equal(false);
    });

    it('method should not be allowed', () => {
      const methods = {
      };

      expect(isMethodAllowed(methods, 'GET')).to.deep.equal(false);
    });

    it('should has permission', () => {
      const permissions = [
        {
          codename: 'test',
        },
      ];

      expect(hasPermissions(permissions, 'test')).to.deep.equal(true);
    });

    it('should not has permission', () => {
      const permissions = [
        {
          codename: 'test',
        },
      ];

      expect(hasPermissions(permissions, 'not_found')).to.deep.equal(false);
    });

    it('should return field options with empty option', () => {
      const fieldAttributes = {
        choices: [
          {
            value: 1,
            display_name: 'test',
          },
        ],
      };

      const options = [
        {
          value: '',
          label: '',
        },
        {
          value: 1,
          label: 'test',
        },
      ];

      expect(getFieldAttributeOptions(fieldAttributes)).to.deep.equal(options);
    });

    it('should return field options with empty option', () => {
      const fieldAttributes = {
        choices: [
          {
            value: 1,
            label: 'test',
          },
        ],
      };

      const options = [
        {
          value: '',
          label: '',
        },
        {
          value: 1,
          label: 'test',
        },
      ];

      expect(getFieldAttributeOptions(fieldAttributes, true, (item) => item.label)).to.deep.equal(options);
    });

    it('should return field options without empty option', () => {
      const fieldAttributes = {
        choices: [
          {
            value: 1,
            display_name: 'test',
          },
        ],
      };

      const options = [
        {
          value: 1,
          label: 'test',
        },
      ];

      expect(getFieldAttributeOptions(fieldAttributes, false)).to.deep.equal(options);
    });

    it('should return sorted field options without empty option', () => {
      const fieldAttributes = {
        choices: [
          {
            value: 2,
            display_name: 'test1',
          },

          {
            value: 1,
            display_name: 'test2',
          },
        ],
      };

      const options = [
        {
          value: 1,
          label: 'test2',
        },
        {
          value: 2,
          label: 'test1',
        },
      ];

      expect(getFieldAttributeOptions(fieldAttributes, false, null, (a, b) => sortNumberByKeyAsc(a, b, 'value'))).to.deep.equal(options);
    });

    it('should return sorted field options with empty option', () => {
      const attributes = {
        field: {
          choices: [
            {
              value: 2,
              display_name: 'test1',
            },

            {
              value: 1,
              display_name: 'test2',
            },
          ],
        },
      };

      const options = [
        {
          value: '',
          label: '',
        },
        {
          value: 2,
          label: 'test1',
        },
        {
          value: 1,
          label: 'test2',
        },
      ];

      expect(getFieldOptions(attributes, 'field')).to.deep.equal(options);
    });

    it('should return bytes as human readable string', () => {
      expect(humanReadableByteCount(1)).to.deep.equal('1 B');
      expect(humanReadableByteCount(10)).to.deep.equal('10 B');
      expect(humanReadableByteCount(100)).to.deep.equal('100 B');
      expect(humanReadableByteCount(1000)).to.deep.equal('1000 B');
      expect(humanReadableByteCount(10000)).to.deep.equal('9.8 KB');
      expect(humanReadableByteCount(100000)).to.deep.equal('97.7 KB');
      expect(humanReadableByteCount(1000000)).to.deep.equal('976.6 KB');
      expect(humanReadableByteCount(10000000)).to.deep.equal('9.5 MB');
      expect(humanReadableByteCount(100000000)).to.deep.equal('95.4 MB');
      expect(humanReadableByteCount(1000000000)).to.deep.equal('953.7 MB');
      expect(humanReadableByteCount(10000000000)).to.deep.equal('9.3 GB');
      expect(humanReadableByteCount(100000000000)).to.deep.equal('93.1 GB');
    });

    it('should has numbers', () => {
      expect(hasNumber('1')).to.deep.equal(true);
      expect(hasNumber('qwe1rty')).to.deep.equal(true);
    });

    it('should not has numbers', () => {
      expect(hasNumber('qwerty')).to.deep.equal(false);
    });

    it('should find property from ocd string', () => {
      expect(findFromOcdString('property1:test/property2:test2', 'property2')).to.deep.equal('test2');
    });

    it('should not find property from ocd string', () => {
      expect(findFromOcdString('property1:test/property2:test2', 'property3')).to.deep.equal(null);
    });

    it('should return paikkatietovipunen url', () => {
      expect(createPaikkatietovipunenUrl('123')).to.deep.equal('http://paikkatietovipunen.hel.fi:10058/123');
    });

    it('should return api response count', () => {
      const apiResponse = {
        count: 20,
        next: null,
        previous: null,
        results: [],
      };

      expect(getApiResponseCount(apiResponse)).to.deep.equal(20);
    });

    it('should return api response max page', () => {
      const apiResponse = {
        count: 20,
        next: null,
        previous: null,
        results: [],
      };
      
      expect(getApiResponseMaxPage(apiResponse, 5)).to.deep.equal(4);
    });

    it('should return api response results', () => {
      const apiResponse = {
        count: 20,
        next: null,
        previous: null,
        results: [1, 2, 3],
      };
      
      expect(getApiResponseResults(apiResponse)).to.deep.equal([1, 2, 3]);
    });

    it('item should be active', () => {
      const item1 = {
        start_date: null,
        end_date: null,
      };
      
      expect(isActive(item1)).to.deep.equal(true);
    });

    it('item should not be active', () => {
      const item1 = {
        start_date: '3333-12-31',
        end_date: null,
      };

      const item2 = {
        start_date: null,
        end_date: '1970-12-31',
      };
      
      expect(isActive(item1)).to.deep.equal(false);
      expect(isActive(item2)).to.deep.equal(false);
    });

    it('item should be archived', () => {
      const item1 = {
        start_date: null,
        end_date: '1970-12-31',
      };

      
      expect(isArchived(item1)).to.deep.equal(true);
    });

    it('item should not be archived', () => {
      const item1 = {
        start_date: '3333-12-31',
        end_date: null,
      };

      const item2 = {
        start_date: null,
        end_date: '3333-12-31',
      };

      
      expect(isArchived(item1)).to.deep.equal(false);
      expect(isArchived(item2)).to.deep.equal(false);
    });
  });

  describe('map.js', () => {

    // $FlowFixMe
    it('Should return coordinates of a geometry', () => {
      const coordinates = [
        [24.945222, 60.176976],
        [24.945222, 60.179629],
        [24.957479, 60.179629],
        [24.957479, 60.176976],
        [24.945222, 60.176976],
      ];
      const geometry = {
        coordinates: coordinates,
        type: 'MultiPolygon',
      };
      
      expect(getCoordinatesOfGeometry(null)).to.deep.equal([]);
      expect(getCoordinatesOfGeometry(geometry)).to.deep.equal(coordinates);
    });

    const center = [
      60.1783025,
      24.9513505,
    ];

    it('Should get center from coordinates', () => {
      const coordinates = [
        [24.945222, 60.176976],
        [24.945222, 60.179629],
        [24.957479, 60.179629],
        [24.957479, 60.176976],
        [24.945222, 60.176976],
      ];

      expect(getCenterFromCoordinates(coordinates)).to.deep.equal(center);
    });
  });
});
