import { LAND_USE_INVOICE_STATUSES } from "../options";
import type { LandUseBillingInvoice } from "../components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleEntry } from "../components/tabs/LandUsePaymentSchedule";

export const createAcceptedBillingInvoices = (
  schedule: LandUsePaymentScheduleEntry,
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

    const amount = installment.invoiceItems.reduce(
      (sum, item) => sum + Number(item.amountExcludingVat || 0),
      0,
    );

    return [
      {
        ...structuredClone(installment),
        status: LAND_USE_INVOICE_STATUSES.OPEN,
        sentAt,
        invoiceNumber: `${Date.now()}-${installmentIndex + 1}`,
        billedAmount: amount,
        remainingAmount: amount,
        sourcePaymentScheduleId: schedule.id,
        sourceInstallmentIndex: installmentIndex,
      },
    ];
  });
};

export const getSchedulesPendingInvoiceReview = (
  schedules: LandUsePaymentScheduleEntry[],
): LandUsePaymentScheduleEntry[] =>
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
