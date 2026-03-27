import type { LandUseDbMigration } from "./types";

type LegacyAgreementTabRecord = {
  agreementId: string;
  tabKey: string;
  data: unknown;
  updatedAt: string;
};

type SiteTreeNode = {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  km2?: string;
  kayttotarkoitus: string | undefined;
  hallintamuoto: string | undefined;
  suojeltu: string | undefined;
  label?: string;
  children?: SiteTreeNode[];
};

type FlatSite = {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  km2?: string;
  kayttotarkoitus: string | undefined;
  hallintamuoto: string[] | undefined;
  suojeltu: string | undefined;
};

type SitesData = {
  items?: SiteTreeNode[];
};

type CompensationsData = {
  sites?: FlatSite[];
  [key: string]: unknown;
};

const flattenTreeNodes = (nodes: SiteTreeNode[]): FlatSite[] => {
  const result: FlatSite[] = [];

  const collect = (items: SiteTreeNode[]) => {
    items.forEach((node) => {
      result.push({
        id: node.id,
        kohteenTunnus: node.kohteenTunnus,
        pintaAlaM2: node.pintaAlaM2,
        km2: node.km2,
        kayttotarkoitus: node.kayttotarkoitus,
        hallintamuoto: node.hallintamuoto ? [node.hallintamuoto] : [],
        suojeltu: node.suojeltu,
      });
      if (node.children?.length) {
        collect(node.children);
      }
    });
  };

  collect(nodes);
  return result;
};

export const migration006MoveSitesToCompensations: LandUseDbMigration = {
  version: 6,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const getAllRequest = agreementTabStore.getAll();

    getAllRequest.onsuccess = () => {
      const allRecords =
        (getAllRequest.result as LegacyAgreementTabRecord[]) ?? [];

      const sitesRecords = allRecords.filter(
        (record) => record.tabKey === "sites",
      );

      sitesRecords.forEach((sitesRecord) => {
        const sitesData = (sitesRecord.data ?? {}) as SitesData;
        const flatSites = flattenTreeNodes(sitesData.items ?? []);

        if (flatSites.length === 0) {
          return;
        }

        const compensationsKey: [string, string] = [
          sitesRecord.agreementId,
          "compensations",
        ];
        const getCompensationsRequest = agreementTabStore.get(compensationsKey);

        getCompensationsRequest.onsuccess = () => {
          const compensationsRecord =
            (getCompensationsRequest.result as
              | LegacyAgreementTabRecord
              | undefined) ?? null;
          const currentData =
            ((compensationsRecord?.data ?? {}) as CompensationsData) ?? {};

          if (currentData.sites && currentData.sites.length > 0) {
            return;
          }

          const nextData: CompensationsData = {
            ...currentData,
            sites: flatSites,
          };

          agreementTabStore.put({
            agreementId: sitesRecord.agreementId,
            tabKey: "compensations",
            data: nextData,
            updatedAt: new Date().toISOString(),
          } satisfies LegacyAgreementTabRecord);
        };
      });
    };
  },
};
