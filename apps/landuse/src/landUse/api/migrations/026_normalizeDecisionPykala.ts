import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type LegacyDecision = {
  pykala?: unknown;
  [key: string]: unknown;
};

type DecisionsData = {
  decisions?: LegacyDecision[];
  [key: string]: unknown;
};

export const normalizeDecisionPykala = (pykala: unknown): unknown => {
  if (typeof pykala !== "string") {
    return pykala;
  }

  return pykala.replaceAll("§", "").trim();
};

export const migration026NormalizeDecisionPykala: LandUseDbMigration = {
  version: 26,
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

      const data = (record.data ?? {}) as DecisionsData;
      if (!Array.isArray(data.decisions)) {
        cursor.continue();
        return;
      }

      cursor.update({
        ...record,
        data: {
          ...data,
          decisions: data.decisions.map((decision) => ({
            ...decision,
            pykala: normalizeDecisionPykala(decision.pykala),
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
