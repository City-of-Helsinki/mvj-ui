import type { PersistedClient } from "@tanstack/query-persist-client-core";
import type { LandUseTabKey } from "./landUseTypes";
import type { LandUseListItem } from "./landUseListTypes";

const LAND_USE_DB_NAME = "landUseDb";
const LAND_USE_DB_VERSION = 4;
const AGREEMENT_TAB_STORE = "agreementTabs";
const AGREEMENT_LIST_STORE = "agreementList";
const REACT_QUERY_STORE = "reactQueryCache";
const REACT_QUERY_KEY = "landUseQueryClient";
const LEGACY_MONITORING_TOTEUTUNUT_STORE = "monitoringToteutunut";

type AgreementTabRecord<T> = {
  agreementId: string;
  tabKey: LandUseTabKey;
  data: T;
  updatedAt: string;
};

type ReactQueryRecord = {
  key: string;
  client: PersistedClient;
  updatedAt: string;
};

const openLandUseDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(LAND_USE_DB_NAME, LAND_USE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AGREEMENT_TAB_STORE)) {
        db.createObjectStore(AGREEMENT_TAB_STORE, {
          keyPath: ["agreementId", "tabKey"],
        });
      }
      if (!db.objectStoreNames.contains(AGREEMENT_LIST_STORE)) {
        db.createObjectStore(AGREEMENT_LIST_STORE, {
          keyPath: "identifier",
        });
      }
      if (!db.objectStoreNames.contains(REACT_QUERY_STORE)) {
        db.createObjectStore(REACT_QUERY_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getStore = async (
  storeName: string,
  mode: IDBTransactionMode,
): Promise<{ db: IDBDatabase; store: IDBObjectStore; tx: IDBTransaction }> => {
  const db = await openLandUseDb();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return { db, store, tx };
};

export const getAgreementTab = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
): Promise<T | null> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.get([agreementId, tabKey]);

    request.onsuccess = () => {
      const result = request.result as AgreementTabRecord<T> | undefined;
      resolve(result?.data ?? null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const setAgreementTab = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
  data: T,
): Promise<void> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const record: AgreementTabRecord<T> = {
      agreementId,
      tabKey,
      data,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const hasAgreementTab = async (
  agreementId: string,
  tabKey: LandUseTabKey,
): Promise<boolean> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getKey([agreementId, tabKey]);
    request.onsuccess = () => resolve(Boolean(request.result));
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getAgreementIds = async (): Promise<string[]> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getAllKeys();

    request.onsuccess = () => {
      const keys = request.result as IDBValidKey[];
      const ids = new Set<string>();

      keys.forEach((key) => {
        if (Array.isArray(key) && typeof key[0] === "string") {
          ids.add(key[0]);
        }
      });

      resolve(Array.from(ids));
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const setAgreementListItem = async (
  item: LandUseListItem,
): Promise<void> => {
  const { db, store, tx } = await getStore(AGREEMENT_LIST_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getPersistedClient = async (): Promise<PersistedClient | null> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.get(REACT_QUERY_KEY);
    request.onsuccess = () => {
      const result = request.result as ReactQueryRecord | undefined;
      resolve(result?.client ?? null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const setPersistedClient = async (
  client: PersistedClient,
): Promise<void> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const record: ReactQueryRecord = {
      key: REACT_QUERY_KEY,
      client,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const removePersistedClient = async (): Promise<void> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const request = store.delete(REACT_QUERY_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getLegacyMonitoringToteutunutEntriesBySiteId = async (
  agreementId: string,
): Promise<Record<string, { value: string; createdAt: string }[]>> => {
  type LegacyMonitoringRecord = {
    agreementId: string;
    siteId: string;
    entries: { value: string; createdAt: string }[];
  };

  const db = await openLandUseDb();

  if (!db.objectStoreNames.contains(LEGACY_MONITORING_TOTEUTUNUT_STORE)) {
    db.close();
    return {};
  }

  const tx = db.transaction(LEGACY_MONITORING_TOTEUTUNUT_STORE, "readonly");
  const store = tx.objectStore(LEGACY_MONITORING_TOTEUTUNUT_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const records = (request.result as LegacyMonitoringRecord[]) ?? [];

      const entriesBySiteId = records.reduce<
        Record<string, { value: string; createdAt: string }[]>
      >((result, record) => {
        if (record.agreementId === agreementId) {
          result[record.siteId] = record.entries ?? [];
        }

        return result;
      }, {});

      resolve(entriesBySiteId);
    };

    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};
