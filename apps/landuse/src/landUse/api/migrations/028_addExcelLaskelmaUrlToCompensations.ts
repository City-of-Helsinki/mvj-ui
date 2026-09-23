import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type CompensationsData = {
  excelLaskelmaUrl?: string;
  [key: string]: unknown;
};

export const migration028AddExcelLaskelmaUrlToCompensations: LandUseDbMigration =
  {
    version: 28,
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
        if (record.tabKey !== "compensations") {
          cursor.continue();
          return;
        }

        const compensationsData = (record.data ?? {}) as CompensationsData;
        if (typeof compensationsData.excelLaskelmaUrl === "string") {
          cursor.continue();
          return;
        }

        cursor.update({
          ...record,
          data: { ...compensationsData, excelLaskelmaUrl: "" },
        });
        cursor.continue();
      };
    },
  };
