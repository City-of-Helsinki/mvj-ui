import { formatDateRange, getLabelOfOption } from "@/util/helpers";

import type { Invoice, InvoiceId } from "@/invoices/types";
import type {
  CollectionNote,
  CreateCollectionNotePayload,
} from "@/collectionNote/types";
import type { SelectListOption } from "@/types";

const normalizeInvoices = (invoices: InvoiceId | InvoiceId[]): InvoiceId[] => {
  if (Array.isArray(invoices)) {
    return invoices;
  }
  if (invoices != null) {
    return [invoices];
  }
  return [];
};

export const getPayloadCollectionNote = (
  collectionNote: CollectionNote,
  leaseId: number,
): CreateCollectionNotePayload => {
  const payload = {
    lease: leaseId,
    note: collectionNote.note,
    collection_stage: collectionNote.collection_stage,
    sent_date: collectionNote.sent_date,
    inspection_date: collectionNote.inspection_date,
    postpone_date: collectionNote.postpone_date,
    entire_lease: collectionNote.entire_lease,
    invoices: normalizeInvoices(collectionNote.invoices),
  };
  return payload;
};

export const getInvoiceLabel = (
  invoice: Invoice,
  invoiceStateOptions: SelectListOption[],
) => {
  const parts = [
    getLabelOfOption(invoiceStateOptions, invoice.state),
    invoice.number != null ? invoice.number : null,
    formatDateRange(
      invoice.billing_period_start_date,
      invoice.billing_period_end_date,
    ),
    invoice.total_amount != null ? `${invoice.total_amount} €` : null,
  ].filter(Boolean);
  return parts.join(" · ");
};
