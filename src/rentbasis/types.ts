import type { Action, Attributes, Methods } from "types";
export type RentBasisState = {
  attributes: Attributes;
  initialValues: RentBasis;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isFormValid: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  list: RentBasisList;
  methods: Methods;
  rentbasis: RentBasis;
};
export type RentBasisId = number;
export type RentBasis = Record<string, any>;
export type RentBasisList = any;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type RentBasisAttributesNotFoundAction = Action<string, void>;
export type FetchRentBasisListAction = Action<
  string,
  Record<string, any> | null | undefined
>;
export type ReceiveRentBasisListAction = Action<string, RentBasisList>;
export type FetchSingleRentBasisAction = Action<string, RentBasisId>;
export type ReceiveSingleRentBasisAction = Action<string, RentBasis>;
export type CreateRentBasisAction = Action<string, RentBasis>;
export type EditRentBasisAction = Action<string, RentBasis>;
export type RentBasisNotFoundAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveRentBasisInitialValuesAction = Action<string, RentBasis>;
export type ReceiveFormValidAction = Action<string, boolean>;
