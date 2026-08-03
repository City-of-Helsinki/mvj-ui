import type { Attributes, Methods } from "types";
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
