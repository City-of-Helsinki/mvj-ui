import {
  LAND_USE_INVOICE_STATUSES,
  LAND_USE_PAYMENT_SCHEDULE_STATUSES,
} from "@/landUse/options";
import type {
  LandUseBillingInvoice,
  LandUseBillingSchedule,
} from "@/landUse/components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleEntry } from "@/landUse/components/tabs/LandUsePaymentSchedule";

export const createAcceptedBillingInvoices = (
  schedule: LandUseBillingSchedule,
  existingInvoices: LandUseBillingInvoice[],
): LandUseBillingInvoice[] => {
  const existingInstallmentIds = new Set(
    existingInvoices
      .map((invoice) => invoice.sourceInstallmentId)
      .filter((installmentId): installmentId is string =>
        Boolean(installmentId),
      ),
  );

  const sentAt = new Date().toISOString();

  return schedule.installments.flatMap((installment, installmentIndex) => {
    if (existingInstallmentIds.has(installment.id)) {
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
        sourceInstallmentId: installment.id,
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
      schedule.status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
  );

export const setPaymentScheduleStatus = (
  schedules: LandUsePaymentScheduleEntry[],
  scheduleId: string,
  status: LandUsePaymentScheduleEntry["status"],
  rejectedReason?: LandUsePaymentScheduleEntry["rejectedReason"],
): LandUsePaymentScheduleEntry[] =>
  schedules.map((schedule) =>
    schedule.id === scheduleId
      ? {
          ...schedule,
          status,
          ...(rejectedReason !== undefined ? { rejectedReason } : {}),
        }
      : schedule,
  );
