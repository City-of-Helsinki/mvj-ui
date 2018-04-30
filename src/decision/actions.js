// @flow

import {createAction} from 'redux-actions';

import type {
  FetchDecisionsByLeaseAction,
  ReceiveDecisionsByLeaseAction,
  DecisionNotFoundAction,
} from './types';
import type {LeaseId} from '$src/leases/types';

export const notFound = (): DecisionNotFoundAction =>
  createAction('mvj/decision/NOT_FOUND')();

export const fetchDecisionsByLease = (leaseId: LeaseId): FetchDecisionsByLeaseAction =>
  createAction('mvj/decision/FETCH_BY_LEASE')(leaseId);

export const receiveDecisionsByLease = (decisions: Object): ReceiveDecisionsByLeaseAction  =>
  createAction('mvj/decision/RECEIVE_BY_LEASE')(decisions);
