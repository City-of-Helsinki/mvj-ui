import type { LandUseDbMigration, AgreementTabRecord } from "./types";

type MonitoringEntry = { value: string; createdAt: string };

type MonitoringData = {
  toteumaEntriesBySiteId?: Record<string, MonitoringEntry[]>;
  toteutunutKm2EntriesBySiteId?: Record<string, MonitoringEntry[]>;
};

const isMonitoringTabRecord = (record: AgreementTabRecord): boolean =>
  record.tabKey === "monitoring";

export const migration004NormalizeMonitoringTabEntries: LandUseDbMigration = {
  version: 4,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (!isMonitoringTabRecord(record)) {
        cursor.continue();
        return;
      }

      const monitoringData = (record.data ?? {}) as MonitoringData;
      const legacyEntries = monitoringData.toteutunutKm2EntriesBySiteId ?? {};
      const currentEntries = monitoringData.toteumaEntriesBySiteId ?? {};
      const mergedEntries = {
        ...legacyEntries,
        ...currentEntries,
      };

      const hasLegacyEntries =
        Object.keys(legacyEntries).length > 0 ||
        "toteutunutKm2EntriesBySiteId" in monitoringData;

      if (!hasLegacyEntries) {
        cursor.continue();
        return;
      }

      const nextData = {
        ...monitoringData,
        toteumaEntriesBySiteId: mergedEntries,
      };

      delete nextData.toteutunutKm2EntriesBySiteId;

      cursor.update({
        ...record,
        data: nextData,
        updatedAt: new Date().toISOString(),
      });
      cursor.continue();
    };
  },
};
