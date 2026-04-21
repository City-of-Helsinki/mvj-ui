import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type SummaryData = {
  kaupunginosa?: unknown;
  [key: string]: unknown;
};

const DEFAULT_KAUPUNGINOSA = "Kruununhaka";

export const migration012AddSummaryKaupunginosaDefault: LandUseDbMigration = {
  version: 12,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
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
      const hasValidKaupunginosa =
        typeof data.kaupunginosa === "string" &&
        data.kaupunginosa.trim() !== "";

      if (hasValidKaupunginosa) {
        cursor.continue();
        return;
      }

      cursor.update({
        ...record,
        data: {
          ...data,
          kaupunginosa: DEFAULT_KAUPUNGINOSA,
        },
      });

      cursor.continue();
    };
  },
};
