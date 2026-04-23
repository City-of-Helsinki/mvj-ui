import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type CompensationSite = {
  kem2?: string;
  km2?: string;
  [key: string]: unknown;
};

type CompensationsData = {
  sites?: CompensationSite[];
  [key: string]: unknown;
};

type PlotDivision = {
  vaadittuKem2?: string;
  vaadittuKm2?: string;
  [key: string]: unknown;
};

type MonitoringData = {
  plotDivisionsBySiteId?: Record<string, PlotDivision[]>;
  [key: string]: unknown;
};

const normalizeCompensationSites = (
  sites: CompensationSite[] | undefined,
): { sites: CompensationSite[]; changed: boolean } => {
  if (!sites) {
    return { sites: [], changed: false };
  }

  let changed = false;

  const normalizedSites = sites.map((site) => {
    if (site.km2 === undefined && site.kem2 !== undefined) {
      return site;
    }

    const { km2, ...siteWithoutLegacyKm2 } = site;
    const normalizedSite = {
      ...siteWithoutLegacyKm2,
      kem2: site.kem2 ?? km2,
    };

    changed = true;
    return normalizedSite;
  });

  return { sites: normalizedSites, changed };
};

const normalizePlotDivisionsBySiteId = (
  plotDivisionsBySiteId: Record<string, PlotDivision[]> | undefined,
): {
  plotDivisionsBySiteId: Record<string, PlotDivision[]>;
  changed: boolean;
} => {
  if (!plotDivisionsBySiteId) {
    return { plotDivisionsBySiteId: {}, changed: false };
  }

  let changed = false;

  const normalized = Object.fromEntries(
    Object.entries(plotDivisionsBySiteId).map(([siteId, plotDivisions]) => [
      siteId,
      plotDivisions.map((plotDivision) => {
        if (
          plotDivision.vaadittuKm2 === undefined &&
          plotDivision.vaadittuKem2 !== undefined
        ) {
          return plotDivision;
        }

        const { vaadittuKm2, ...plotDivisionWithoutLegacyField } = plotDivision;
        changed = true;
        return {
          ...plotDivisionWithoutLegacyField,
          vaadittuKem2: plotDivision.vaadittuKem2 ?? vaadittuKm2,
        };
      }),
    ]),
  );

  return { plotDivisionsBySiteId: normalized, changed };
};

export const migration016MigrateKm2ToKem2Fields: LandUseDbMigration = {
  version: 16,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const getAllRequest = agreementTabStore.getAll();

    getAllRequest.onsuccess = () => {
      const records = (getAllRequest.result as AgreementTabRecord[]) ?? [];

      records.forEach((record) => {
        if (record.tabKey === "compensations") {
          const currentData = (record.data ?? {}) as CompensationsData;
          const { sites, changed } = normalizeCompensationSites(
            currentData.sites,
          );

          if (!changed) {
            return;
          }

          agreementTabStore.put({
            ...record,
            data: {
              ...currentData,
              sites,
            },
            updatedAt: new Date().toISOString(),
          } satisfies AgreementTabRecord);

          return;
        }

        if (record.tabKey === "monitoring") {
          const currentData = (record.data ?? {}) as MonitoringData;
          const { plotDivisionsBySiteId, changed } =
            normalizePlotDivisionsBySiteId(currentData.plotDivisionsBySiteId);

          if (!changed) {
            return;
          }

          agreementTabStore.put({
            ...record,
            data: {
              ...currentData,
              plotDivisionsBySiteId,
            },
            updatedAt: new Date().toISOString(),
          } satisfies AgreementTabRecord);
        }
      });
    };
  },
};
