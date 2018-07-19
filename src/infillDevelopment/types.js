// @flow
import type {Action} from '../types';

export type Attributes = Object;
export type InfillDevelopmentState = Object;
export type InfillDevelopmentId = number;
export type InfillDevelopment = Object;
export type InfillDevelopmentList = Object;
export type InfillDevelopmentFileData = {
  id: InfillDevelopmentId,
  data: Object,
  file: Object,
}

export type InfillDevelopmentFileDeleteObj = {
  id: InfillDevelopmentId,
  fileId: number,
}

export type FetchAttributesAction = Action<'mvj/infillDevelopment/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/infillDevelopment/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchInfillDevelopmentListAction = Action<'mvj/infillDevelopment/FETCH_ALL', string>;
export type ReceiveInfillDevelopmentListAction = Action<'mvj/infillDevelopment/RECEIVE_ALL', InfillDevelopmentList>;
export type FetchSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/FETCH_SINGLE', InfillDevelopmentId>;
export type ReceiveSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/RECEIVE_SINGLE', InfillDevelopment>;

export type CreateInfillDevelopmentAction = Action<'mvj/infillDevelopment/CREATE', InfillDevelopment>;
export type EditInfillDevelopmentAction = Action<'mvj/infillDevelopment/EDIT', InfillDevelopment>;
export type UploadInfillDevelopmentFileAction = Action<'mvj/infillDevelopment/UPLOAD_FILE', InfillDevelopmentFileData>;
export type DeleteInfillDevelopmentFileAction = Action<'mvj/infillDevelopment/DELETE_FILE', InfillDevelopmentFileDeleteObj>;

export type InfillDevelopmentNotFoundAction = Action<'mvj/infillDevelopment/NOT_FOUND', void>;

export type HideEditModeAction = Action<'mvj/infillDevelopment/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/infillDevelopment/SHOW_EDIT', void>;
export type ReceiveIsSaveClickedAction = Action<'mvj/infillDevelopment/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/infillDevelopment/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/infillDevelopment/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveFormInitialValuesAction = Action<'mvj/infillDevelopment/RECEIVE_INITIAL_VALUES', InfillDevelopment>;
