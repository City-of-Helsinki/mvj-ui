import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";
import {
  LAND_USE_PAYMENT_SCHEDULE_STATUSES,
  type LandUsePaymentScheduleStatus,
} from "@/landUse/options";

const LEGACY_INVOICE_STATUSES = {
  READY: "Valmis",
  OPEN: "Avoin",
  PAID: "Maksettu",
} as const;

type LegacyPaymentSchedule = {
  status?: unknown;
  [key: string]: unknown;
};

type PaymentScheduleData = {
  paymentSchedules?: LegacyPaymentSchedule[];
  [key: string]: unknown;
};

export const migratePaymentScheduleStatus = (
  status: unknown,
): LandUsePaymentScheduleStatus => {
  if (
    status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL ||
    status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.APPROVED ||
    status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED
  ) {
    return status;
  }

  if (
    status === LEGACY_INVOICE_STATUSES.READY ||
    status === LEGACY_INVOICE_STATUSES.OPEN ||
    status === LEGACY_INVOICE_STATUSES.PAID
  ) {
    return LAND_USE_PAYMENT_SCHEDULE_STATUSES.APPROVED;
  }

  return LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT;
};

export const migration024SeparatePaymentScheduleStatuses: LandUseDbMigration = {
  version: 24,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (record.tabKey !== "paymentSchedule") {
        cursor.continue();
        return;
      }

      const data = (record.data ?? {}) as PaymentScheduleData;
      if (!Array.isArray(data.paymentSchedules)) {
        cursor.continue();
        return;
      }

      cursor.update({
        ...record,
        data: {
          ...data,
          paymentSchedules: data.paymentSchedules.map((schedule) => ({
            ...schedule,
            status: migratePaymentScheduleStatus(schedule.status),
          })),
        },
      });
      cursor.continue();
    };

    if (transaction.db.objectStoreNames.contains(stores.reactQueryStore)) {
      transaction.objectStore(stores.reactQueryStore).clear();
    }
  },
};
