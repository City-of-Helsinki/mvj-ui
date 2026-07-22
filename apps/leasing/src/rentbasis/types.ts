import type { Action, Attributes, Methods } from "types";
export type RentBasisState = {
  attributes: Attributes;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  isFormDirty: boolean;
  list: RentBasisList;
  methods: Methods;
  rentbasis: RentBasis;
};
export type RentBasisId = number;
export type RentBasis = {
  id?: number;
  plot_type?: number;
  start_date?: string;
  end_date?: string;
  detailed_plan_identifier?: string;
  management?: number;
  financing?: number;
  lease_rights_end_date?: string;
  index?: number;
  note?: string;
  geometry?: any;
  property_identifiers?: Array<PropertyIdentifier>;
  rent_rates?: Array<RentRate>;
  decisions?: Array<RentBasisDecision>;
};
export type PropertyIdentifier = {
  id?: number;
  identifier?: string;
};
export type RentRate = {
  id?: number;
  amount?: number;
  build_permission_type?: number;
  area_unit?: string;
};
export type RentBasisDecision = {
  id?: number;
  decision_maker?: number;
  decision_date?: string;
  section?: string;
  reference_number?: string;
};
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
export type ReceiveIsFormDirtyAction = Action<string, boolean>;
