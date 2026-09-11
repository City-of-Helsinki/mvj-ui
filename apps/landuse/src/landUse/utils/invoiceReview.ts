import { LAND_USE_INVOICE_STATUSES } from "../options";
import type {
  LandUseBillingInvoice,
  LandUseBillingSchedule,
} from "../components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleEntry } from "../components/tabs/LandUsePaymentSchedule";

export const createAcceptedBillingInvoices = (
  schedule: LandUseBillingSchedule,
  existingInvoices: LandUseBillingInvoice[],
): LandUseBillingInvoice[] => {
  const existingInstallmentIndexes = new Set(
    existingInvoices
      .filter((invoice) => invoice.sourcePaymentScheduleId === schedule.id)
      .map((invoice) => invoice.sourceInstallmentIndex),
  );

  const sentAt = new Date().toISOString();

  return schedule.installments.flatMap((installment, installmentIndex) => {
    if (existingInstallmentIndexes.has(installmentIndex)) {
      return [];
    }

    const amount = (installment.invoiceItems ?? []).reduce(
      (sum, item) => sum + Number(item.amountExcludingVat || 0),
      0,
    );

    return [
      {
        ...structuredClone(installment),
        status: LAND_USE_INVOICE_STATUSES.OPEN,
        sentAt,
        invoiceNumber: `${Date.now()}-${installmentIndex + 1}`,
        billedAmount: String(amount),
        remainingAmount: String(amount),
        sourcePaymentScheduleId: schedule.id,
        sourceInstallmentIndex: installmentIndex,
      },
    ];
  });
};

export const getSchedulesPendingInvoiceReview = <
  Schedule extends Pick<LandUsePaymentScheduleEntry, "status">,
>(
  schedules: Schedule[],
): Schedule[] =>
  schedules.filter(
    (schedule) =>
      schedule.status === LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL,
  );

export const setPaymentScheduleStatus = (
  schedules: LandUsePaymentScheduleEntry[],
  scheduleId: string,
  status: LandUsePaymentScheduleEntry["status"],
): LandUsePaymentScheduleEntry[] =>
  schedules.map((schedule) =>
    schedule.id === scheduleId ? { ...schedule, status } : schedule,
  );
