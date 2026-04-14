import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type CoefficientData = {
  vertailunPeruskerroin?: number;
  korotuskerroin?: number;
  [key: string]: unknown;
};

const isTargetTabRecord = (record: AgreementTabRecord): boolean =>
  record.tabKey === "collaterals" || record.tabKey === "compensations";

export const migration010RenameVertailunPeruskerroinToKorotuskerroin: LandUseDbMigration =
  {
    version: 10,
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
        if (!isTargetTabRecord(record)) {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as CoefficientData;

        if (
          data.vertailunPeruskerroin === undefined ||
          data.korotuskerroin !== undefined
        ) {
          cursor.continue();
          return;
        }

        const { vertailunPeruskerroin, ...rest } = data;

        cursor.update({
          ...record,
          data: {
            ...rest,
            korotuskerroin: vertailunPeruskerroin,
          },
        });

        cursor.continue();
      };
    },
  };
