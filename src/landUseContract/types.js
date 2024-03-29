// @flow
import type {Action, Attributes, Methods} from '../types';

export type LandUseContractState = {
  attributes: Attributes,
  current: LandUseContract,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  isFormValidById: Object,
  isSaveClicked: boolean,
  list: LandUseContractList,
  methods: Methods,
};

export type FetchSingleLandUseContractAfterEditPayload = {
  id: any,
  callbackFunctions?: Array<Object | Function>,
}

export type InvoiceListMap = Object;
export type LandUseContract = Object;
export type LandUseContractList = Object;
export type LandUseContractId = number;

export type FetchAttributesAction = Action<'mvj/landUseContract/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/landUseContract/RECEIVE_ATTRIBUTES', Attributes>;
export type AttributesNotFoundAction = Action<'mvj/landUseContract/ATTRIBUTES_NOT_FOUND', void>;

export type ReceiveMethodsAction = Action<'mvj/landUseContract/RECEIVE_METHODS', Methods>;

export type FetchLandUseContractListAction = Action<'mvj/landUseContract/FETCH_ALL', string>;
export type ReceiveLandUseContractListAction = Action<'mvj/landUseContract/RECEIVE_ALL', LandUseContractList>;
export type FetchSingleLandUseContractAction = Action<'mvj/landUseContract/FETCH_SINGLE', LandUseContractId>;
export type ReceiveSingleLandUseContractAction = Action<'mvj/landUseContract/RECEIVE_SINGLE', LandUseContract>;
export type FetchSingleLandUseContractAfterEditAction = Action<'mvj/landUseContract/FETCH_SINGLE_AFTER_EDIT', FetchSingleLandUseContractAfterEditPayload>;
export type DeleteLandUseContractAction = Action<'mvj/landUseContract/DELETE', LandUseContractId>;

export type CreateLandUseContractAction = Action<'mvj/landUseContract/CREATE', LandUseContract>;
export type EditLandUseContractAction = Action<'mvj/landUseContract/EDIT', LandUseContract>;
export type LandUseContractNotFoundAction = Action<'mvj/landUseContract/NOT_FOUND', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/landUseContract/RECEIVE_SAVE_CLICKED', boolean>;

export type HideEditModeAction = Action<'mvj/landUseContract/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/landUseContract/SHOW_EDIT', void>;

export type ReceiveFormValidFlagsAction = Action<'mvj/landUseContract/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/landUseContract/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/landUseContract/RECEIVE_COLLAPSE_STATES', Object>;
