// @flow
import isEmpty from 'lodash/isEmpty';
import {sortByLabelAsc} from '../util/helpers';

export const getCollectionLetterTemplateOptions = (collectionLetterTemplates: Array<Object>): Array<Object> =>
  !isEmpty(collectionLetterTemplates)
    ? collectionLetterTemplates.map((template) => {
      return {
        value: template.id,
        label: template.name,
      };
    })
      .sort(sortByLabelAsc)
    : [];
