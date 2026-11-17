import { LAND_USE_PAYMENT_SCHEDULE_STATUSES } from "@/landUse/options";
import type { LandUsePaymentScheduleEntry } from "@/landUse/components/tabs/LandUsePaymentSchedule";

export const getSchedulesPendingInvoiceReview = <
  Schedule extends Pick<LandUsePaymentScheduleEntry, "status">,
>(
  schedules: Schedule[],
): Schedule[] =>
  schedules.filter(
    (schedule) =>
      schedule.status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
  );
