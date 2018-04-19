// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Comment, LeaseId, Lease} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`lease/${search || ''}`)));
};

export const fetchSingleLease = (id: LeaseId): Generator<> => {
  return callApi(new Request(createUrl(`lease/${id}/`)));
};

export const createLease = (lease: Lease): Generator<> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const patchLease = (lease: Lease): Generator<> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const fetchDecisions = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`decision/${search || ''}`)));
};

export const fetchDistricts = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`district/${search || ''}`)));
};

export const fetchLessors = () => {
  return callApi(new Request(createUrl('contact/?is_lessor=true&limit=1000')));
};

export const fetchComments = (id: LeaseId) => {
  return callApi(new Request(createUrl(`comment/?lease=${id}&limit=1000`)));
};

export const fetchCommentAttributes = () => {
  return callApi(new Request(createUrl('comment/'), {method: 'OPTIONS'}));
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
