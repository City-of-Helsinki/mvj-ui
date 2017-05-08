// @flow

import {createAction} from 'redux-actions';

import type {
  Application,
  ApplicationId,
  ApplicationNotFoundAction,
  ApplicationsList,
  CreateApplicationAction,
  FetchApplicationsAction,
  FetchSingleApplicationAction,
  ReceiveApplicationsAction,
  ReceiveSingleApplicationAction,
} from './types';

export const fetchApplications = (): FetchApplicationsAction =>
  createAction('mvj/applications/FETCH_ALL')();

export const receiveApplications = (applications: ApplicationsList): ReceiveApplicationsAction =>
  createAction('mvj/applications/RECEIVE_ALL')(applications);

export const fetchSingleApplication = (id: ApplicationId): FetchSingleApplicationAction =>
  createAction('mvj/applications/FETCH_SINGLE')(id);

export const receiveSingleApplication = (application: Application): ReceiveSingleApplicationAction =>
  createAction('mvj/applications/RECEIVE_SINGLE')(application);

export const sendApplication = (application: Application): CreateApplicationAction =>
  createAction('mvj/applications/CREATE')(application);

export const notFound = (): ApplicationNotFoundAction =>
  createAction('mvj/applications/NOT_FOUND')();
