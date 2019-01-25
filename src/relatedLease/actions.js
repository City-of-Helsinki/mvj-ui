// @flow
import {createAction} from 'redux-actions';

import type {
  CreateRelatedLeasePayload,
  CreateRelatedLeaseAction,
  DeleteRelatedLeasePayload,
  DeleteRelatedLeaseAction,
} from './types';

export const createReleatedLease = (payload: CreateRelatedLeasePayload): CreateRelatedLeaseAction =>
  createAction('mvj/relatedLease/CREATE')(payload);

export const deleteReleatedLease = (payload: DeleteRelatedLeasePayload): DeleteRelatedLeaseAction =>
  createAction('mvj/relatedLease/DELETE')(payload);
