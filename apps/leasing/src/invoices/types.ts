import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
export type InvoiceState = {
  attributes: Attributes;
  byLease: InvoiceListMap;
  invoiceToCredit: Invoice | null | undefined;
  isCreateClicked: boolean;
  isCreatePanelOpen: boolean;
  isCreditClicked: boolean;
  isCreditPanelOpen: boolean;
  isEditClicked: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaving: boolean;
  methods: Methods;
  patchedInvoice: Invoice | null | undefined;
};
export type Invoice = Record<string, any>;
export type InvoiceId = number;
export type InvoiceList = Array<Record<string, any>>;
export type InvoiceListMap = Record<string, any>;
export type ExportInvoiceToLaskeAndUpdateListPayload = {
  id: InvoiceId;
  lease: LeaseId;
};
