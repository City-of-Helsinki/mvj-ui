import type { LandUseDbMigration } from "./types";

type LegacyTabRecord = {
  agreementId: string;
  tabKey: string;
  data: unknown;
  updatedAt: string;
};

type OldContractsTabData = {
  agreements?: unknown[];
  [key: string]: unknown;
};

/**
 * Renames tabKey "agreements" -> "contracts" and field data.agreements -> data.contracts.
 * Handles users who had migration 019 run before the rename.
 */
export const migration020RenameAgreementsTabToContracts: LandUseDbMigration = {
  version: 20,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as LegacyTabRecord;
      if (record.tabKey !== "agreements") {
        cursor.continue();
        return;
      }

      const data = (record.data ?? {}) as OldContractsTabData;
      const { agreements, ...rest } = data;

      // Delete the old record (key includes tabKey) and insert under new key.
      cursor.delete();
      agreementTabStore.put({
        ...record,
        tabKey: "contracts",
        data: { ...rest, contracts: agreements },
      } satisfies LegacyTabRecord);

      cursor.continue();
    };
  },
};
