import {
  INVOICE_STATUSES_ALLOWED_BEFORE_SAP_EXPORT,
  PAYMENT_SCHEDULE_STATUSES,
} from "@/landUse/options";
import type { PaymentScheduleEntry } from "@/landUse/components/tabs/LandUsePaymentSchedule";

export const areAllInvoicesInScheduleSent = (
  schedule: PaymentScheduleEntry,
): boolean => {
  for (const installment of schedule.installments) {
    if (!installment.invoice) {
      return false;
    }
  }
  const invoices = schedule.installments.flatMap(({ invoice }) =>
    invoice ? [invoice] : [],
  );
  return (
    invoices.length > 0 &&
    invoices.every(
      (invoice) =>
        Boolean(invoice.sentAt) ||
        invoice.status === undefined ||
        !INVOICE_STATUSES_ALLOWED_BEFORE_SAP_EXPORT.has(invoice.status),
    )
  );
};

export const getSchedulesPendingInvoiceReview = <
  Schedule extends Pick<PaymentScheduleEntry, "status">,
>(
  schedules: Schedule[],
): Schedule[] =>
  schedules.filter(
    (schedule) =>
      schedule.status === PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
  );
