import type { LandUseTabKey } from "../landUseTypes";

export interface LandUseDbStores {
  agreementTabStore: string;
  reactQueryStore: string;
  monitoringToteutunutStore: string;
}

export interface LandUseDbMigrationContext {
  db: IDBDatabase;
  transaction: IDBTransaction;
  stores: LandUseDbStores;
}

export interface LandUseDbMigration {
  version: number;
  migrate: (context: LandUseDbMigrationContext) => void;
}

export type AgreementTabRecord = {
  agreementId: string;
  tabKey: LandUseTabKey;
  data: unknown;
  updatedAt: string;
};

export type MonitoringToteutunutEntryRecord = {
  agreementId: string;
  siteId: string;
  entries: { value: string; createdAt: string }[];
  updatedAt: string;
};
