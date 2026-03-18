import type {
  AgreementTabRecord,
  LandUseDbMigration,
  MonitoringToteutunutEntryRecord,
} from "./types";

type MonitoringEntry = { value: string; createdAt: string };

type MonitoringData = {
  toteumaEntriesBySiteId?: Record<string, MonitoringEntry[]>;
  toteutunutKm2EntriesBySiteId?: Record<string, MonitoringEntry[]>;
  sakkoRows?: unknown[];
};

const mergeEntriesBySiteId = (
  legacyEntriesBySiteId: Record<string, MonitoringEntry[]>,
  currentEntriesBySiteId: Record<string, MonitoringEntry[]>,
): Record<string, MonitoringEntry[]> => ({
  ...legacyEntriesBySiteId,
  ...currentEntriesBySiteId,
});

export const migration005MigrateMonitoringStoreToAgreementTabs: LandUseDbMigration =
  {
    version: 5,
    migrate: ({ transaction, db, stores }) => {
      if (!db.objectStoreNames.contains(stores.monitoringToteutunutStore)) {
        return;
      }

      const monitoringStore = transaction.objectStore(
        stores.monitoringToteutunutStore,
      );
      const agreementTabStore = transaction.objectStore(
        stores.agreementTabStore,
      );

      const getAllRequest = monitoringStore.getAll();

      getAllRequest.onsuccess = () => {
        const legacyRecords =
          (getAllRequest.result as MonitoringToteutunutEntryRecord[]) ?? [];

        db.deleteObjectStore(stores.monitoringToteutunutStore);

        const legacyByAgreementId = legacyRecords.reduce<
          Record<string, Record<string, MonitoringEntry[]>>
        >((result, record) => {
          if (!result[record.agreementId]) {
            result[record.agreementId] = {};
          }

          result[record.agreementId][record.siteId] = record.entries ?? [];
          return result;
        }, {});

        Object.entries(legacyByAgreementId).forEach(
          ([agreementId, legacyEntriesBySiteId]) => {
            const key: [string, string] = [agreementId, "monitoring"];
            const getMonitoringRequest = agreementTabStore.get(key);

            getMonitoringRequest.onsuccess = () => {
              const monitoringRecord =
                (getMonitoringRequest.result as
                  | AgreementTabRecord
                  | undefined) ?? null;
              const currentData =
                ((monitoringRecord?.data ?? {}) as MonitoringData) ?? {};
              const currentEntriesBySiteId = {
                ...(currentData.toteutunutKm2EntriesBySiteId ?? {}),
                ...(currentData.toteumaEntriesBySiteId ?? {}),
              };

              const {
                toteutunutKm2EntriesBySiteId: _removedLegacyEntriesBySiteId,
                ...currentDataWithoutLegacy
              } = currentData;

              const nextData: MonitoringData = {
                ...currentDataWithoutLegacy,
                toteumaEntriesBySiteId: mergeEntriesBySiteId(
                  legacyEntriesBySiteId,
                  currentEntriesBySiteId,
                ),
              };

              agreementTabStore.put({
                agreementId,
                tabKey: "monitoring",
                data: nextData,
                updatedAt: new Date().toISOString(),
              });
            };
          },
        );
      };
    },
  };
