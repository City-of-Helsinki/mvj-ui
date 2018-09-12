// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchCollectionLetterTemplates = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_letter_template/${search || ''}`)));
};
