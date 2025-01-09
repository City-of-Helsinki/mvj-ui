import type { Action } from "types";
import type { LeaseId } from "@/leases/types";
export type PreviewInvoicesState = {
  isFetching: boolean;
  list: PreviewInvoices;
};
export type FetchPreviewInvoicesPayload = {
  lease: LeaseId;
  year?: number;
};
export type PreviewInvoices = Array<BillingPeriod> | null;
export type BillingPeriod = Array<BillingPeriodInvoice>;
export type BillingPeriodInvoice = Record<string, any>;
export type FetchPreviewInvoicesAction = Action<
  string,
  FetchPreviewInvoicesPayload
>;
export type ReceivePreviewInvoicesAction = Action<string, PreviewInvoices>;
export type ClearPreviewInvoicesAction = Action<string, void>;
export type PreviewInvoicesNotFoundAction = Action<string, void>;
