import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type SummaryData = {
  edistamisalue?: unknown;
  [key: string]: unknown;
};

export const migration011MigrateSummaryEdistamisalueToBoolean: LandUseDbMigration =
  {
    version: 11,
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
        if (record.tabKey !== "summary") {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as SummaryData;

        if (data.edistamisalue === true) {
          cursor.continue();
          return;
        }

        cursor.update({
          ...record,
          data: {
            ...data,
            edistamisalue: true,
          },
        });

        cursor.continue();
      };
    },
  };
