// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Comment} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('comment/'), {method: 'OPTIONS'}));
};

export const fetchComments = (search: string) => {
  return callApi(new Request(createUrl(`comment/${search || ''}`)));
};

export const createComment = (comment: Comment): Generator<> => {
  const body = JSON.stringify(comment);

  return callApi(new Request(createUrl(`comment/`), {
    method: 'POST',
    body,
  }));
};

export const editComment = (comment: Comment): Generator<> => {
  const {id} = comment;
  const body = JSON.stringify(comment);

  return callApi(new Request(createUrl(`comment/${id}/`), {
    method: 'PUT',
    body,
  }));
};
