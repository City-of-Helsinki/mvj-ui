import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type LegacyPaymentSchedule = {
  rejectedReason?: unknown;
  [key: string]: unknown;
};

type PaymentScheduleData = {
  paymentSchedules?: LegacyPaymentSchedule[];
  [key: string]: unknown;
};

export const migration027AddPaymentScheduleRejectedReason: LandUseDbMigration =
  {
    version: 27,
    migrate: ({ transaction, stores }) => {
      const agreementTabStore = transaction.objectStore(
        stores.agreementTabStore,
      );
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
              rejectedReason:
                typeof schedule.rejectedReason === "string"
                  ? schedule.rejectedReason
                  : null,
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
