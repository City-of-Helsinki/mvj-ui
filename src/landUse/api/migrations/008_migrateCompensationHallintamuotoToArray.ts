import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type CompensationSite = {
  hallintamuoto?: string[] | string;
  [key: string]: unknown;
};

type CompensationsData = {
  sites?: CompensationSite[];
  [key: string]: unknown;
};

const isCompensationsTabRecord = (record: AgreementTabRecord): boolean =>
  record.tabKey === "compensations";

export const migration008MigrateCompensationHallintamuotoToArray: LandUseDbMigration =
  {
    version: 8,
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

        if (sites.length === 0) {
          cursor.continue();
          return;
        }

        let hasChanges = false;

        const normalizedSites = sites.map((site) => {
          const hallintamuoto = site.hallintamuoto;

          if (typeof hallintamuoto === "string") {
            hasChanges = true;

            return {
              ...site,
              hallintamuoto:
                hallintamuoto.trim() === "" ? [] : [hallintamuoto.trim()],
            };
          }

          if (Array.isArray(hallintamuoto)) {
            const normalizedHallintamuoto = hallintamuoto.filter(
              (value): value is string =>
                typeof value === "string" && value.trim().length > 0,
            );

            if (normalizedHallintamuoto.length !== hallintamuoto.length) {
              hasChanges = true;

              return {
                ...site,
                hallintamuoto: normalizedHallintamuoto,
              };
            }
          }

          return site;
        });

        if (!hasChanges) {
          cursor.continue();
          return;
        }

        cursor.update({
          ...record,
          data: {
            ...compensationsData,
            sites: normalizedSites,
          },
          updatedAt: new Date().toISOString(),
        });

        cursor.continue();
      };
    },
  };
