import { formatDateRange, getLabelOfOption } from "@/util/helpers";
import { InvoiceState } from "@/invoices/enums";

import type { Invoice, InvoiceId } from "@/invoices/types";
import type {
  CollectionNote,
  CollectionNotePayload,
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
): CollectionNotePayload => {
  return {
    id: collectionNote.id,
    lease: leaseId,
    note: collectionNote.note,
    collection_stage: collectionNote.collection_stage,
    sent_date: collectionNote.sent_date,
    inspection_date: collectionNote.inspection_date,
    postpone_date: collectionNote.postpone_date,
    entire_lease: collectionNote.entire_lease,
    invoices: normalizeInvoices(collectionNote.invoices),
  };
};

export const getInvoiceLabel = (
  invoice: Invoice,
  invoiceStateOptions: SelectListOption[],
) => {
  const parts = [
    getLabelOfOption(invoiceStateOptions, invoice.state),
    formatDateRange(
      invoice.billing_period_start_date,
      invoice.billing_period_end_date,
    ),
    invoice.total_amount != null ? `${invoice.total_amount} €` : null,
  ].filter(Boolean);
  return parts.join(" · ");
};

/**
 * Sorts invoices by due date descending and prioritizes open invoices first
 */
export const sortInvoices = (invoices: Invoice[]): Invoice[] => {
  if (!invoices) return [];
  const sorted = [...invoices].sort((a, b) => {
    if (a.state === InvoiceState.OPEN && b.state !== InvoiceState.OPEN) {
      return -1;
    }
    if (a.state !== InvoiceState.OPEN && b.state === InvoiceState.OPEN) {
      return 1;
    }
    return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
  });
  return sorted;
};
