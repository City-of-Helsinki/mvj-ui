import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type MonitoringData = {
  sakkoKorotusBySiteId?: Record<string, string>;
  sakkoKorotusByPlotDivisionId?: Record<string, string>;
  [key: string]: unknown;
};

const isMonitoringTabRecord = (record: AgreementTabRecord): boolean =>
  record.tabKey === "monitoring";

export const migration017RenameSakkoKorotusToSakkoKerroin: LandUseDbMigration =
  {
    version: 17,
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
        if (!isMonitoringTabRecord(record)) {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as MonitoringData;

        const hasOldKeys =
          data.sakkoKorotusBySiteId !== undefined ||
          data.sakkoKorotusByPlotDivisionId !== undefined;

        if (!hasOldKeys) {
          cursor.continue();
          return;
        }

        const { sakkoKorotusBySiteId, sakkoKorotusByPlotDivisionId, ...rest } =
          data;

        cursor.update({
          ...record,
          data: {
            ...rest,
            ...(sakkoKorotusBySiteId !== undefined && {
              sakkoKerroinBySiteId: sakkoKorotusBySiteId,
            }),
            ...(sakkoKorotusByPlotDivisionId !== undefined && {
              sakkoKerroinByPlotDivisionId: sakkoKorotusByPlotDivisionId,
            }),
          },
        });

        cursor.continue();
      };
    },
  };
