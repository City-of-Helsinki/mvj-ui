import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type DecisionsTabData = {
  agreements?: unknown[];
  [key: string]: unknown;
};

export const migration019MoveAgreementsToOwnTab: LandUseDbMigration = {
  version: 19,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (record.tabKey !== "decisions") {
        cursor.continue();
        return;
      }

      const data = (record.data ?? {}) as DecisionsTabData;
      if (!Array.isArray(data.agreements) || data.agreements.length === 0) {
        cursor.continue();
        return;
      }

      // Write the contracts array into its own tab record.
      const contractsRecord: AgreementTabRecord = {
        agreementId: record.agreementId,
        tabKey: "contracts",
        data: { contracts: data.agreements },
        updatedAt: record.updatedAt,
      };
      agreementTabStore.put(contractsRecord);

      // Remove agreements from the decisions record.
      const { agreements: _removed, ...decisionsData } = data;
      cursor.update({ ...record, data: decisionsData });

      cursor.continue();
    };
  },
};
