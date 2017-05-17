// @flow

import type {Action} from '../types';

export type ApplicationState = Object;

export type Application = Object;
export type ApplicationId = number;
export type ApplicationsList = Array<any>;

export type FetchApplicationsAction = Action<'mvj/applications/FETCH_ALL', void>;
export type ReceiveApplicationsAction = Action<'mvj/applications/RECEIVE_ALL', ApplicationsList>;

export type FetchSingleApplicationAction = Action<'mvj/applications/FETCH_SINGLE', ApplicationId>;
export type ReceiveSingleApplicationAction = Action<'mvj/applications/RECEIVE_SINGLE', Application>;

export type CreateApplicationAction = Action<'mvj/applications/CREATE', Application>;
export type EditApplicationAction = Action<'mvj/applications/EDIT', Application>;

export type ApplicationNotFoundAction = Action<'mvj/applications/NOT_FOUND', void>;
