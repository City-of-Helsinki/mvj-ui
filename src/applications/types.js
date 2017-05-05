// @flow

import type {Action} from '../types';

export type Application = Object;
export type ApplicationId = number;
export type ApplicationsList = Array<any>;

export type ApplicationState = Object;

export type FetchApplicationsAction = Action<'mvj/applications/FETCH_ALL', void>;
export type ReceiveApplicationsAction = Action<'mvj/applications/RECEIVE_ALL', ApplicationsList>;

export type FetchSingleApplicationAction = Action<'mvj/applications/FETCH_SINGLE', ApplicationId>;
export type ReceiveSingleApplicationAction = Action<'mvj/applications/RECEIVE_SINGLE', Application>;

export type ApplicationNotFoundAction = Action<'mvj/applications/NOT_FOUND', void>;
