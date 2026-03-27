import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type CompensationSite = {
  amVelvoite?: boolean;
  [key: string]: unknown;
};

type CompensationsData = {
  sites?: CompensationSite[];
  [key: string]: unknown;
};

const isCompensationsTabRecord = (record: AgreementTabRecord): boolean =>
  record.tabKey === "compensations";

export const migration009AddAmVelvoiteToCompensationSites: LandUseDbMigration =
  {
    version: 9,
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
        if (!isCompensationsTabRecord(record)) {
          cursor.continue();
          return;
        }

        const compensationsData = (record.data ?? {}) as CompensationsData;
        const sites = compensationsData.sites ?? [];

        const migratedSites = sites.map((site) => {
          if (typeof site.amVelvoite === "boolean") {
            return site;
          }

          return { ...site, amVelvoite: false };
        });

        const hasChanges = migratedSites.some(
          (site, index) => site !== sites[index],
        );

        if (!hasChanges) {
          cursor.continue();
          return;
        }

        cursor.update({
          ...record,
          data: { ...compensationsData, sites: migratedSites },
        });

        cursor.continue();
      };
    },
  };
