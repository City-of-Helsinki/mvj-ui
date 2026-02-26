import type { PersistedClient } from "@tanstack/query-persist-client-core";
import type { LandUseTabKey } from "./landUseTypes";
import type { LandUseListItem } from "./landUseListTypes";

const LAND_USE_DB_NAME = "landUseDb";
const LAND_USE_DB_VERSION = 3;
const AGREEMENT_TAB_STORE = "agreementTabs";
const AGREEMENT_LIST_STORE = "agreementList";
const REACT_QUERY_STORE = "reactQueryCache";
const MONITORING_TOTEUTUNUT_STORE = "monitoringToteutunut";
const REACT_QUERY_KEY = "landUseQueryClient";

export type AgreementTabRecord<T> = {
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

type MonitoringToteutunutEntryRecord = {
  agreementId: string;
  siteId: string;
  entries: { value: string; createdAt: string }[];
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
      if (!db.objectStoreNames.contains(MONITORING_TOTEUTUNUT_STORE)) {
        db.createObjectStore(MONITORING_TOTEUTUNUT_STORE, {
          keyPath: ["agreementId", "siteId"],
        });
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

export const getAgreementList = async (): Promise<LandUseListItem[]> => {
  const { db, store, tx } = await getStore(AGREEMENT_LIST_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve((request.result as LandUseListItem[]) ?? []);
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

export const hasAgreementListItem = async (
  identifier: string,
): Promise<boolean> => {
  const { db, store, tx } = await getStore(AGREEMENT_LIST_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getKey(identifier);
    request.onsuccess = () => resolve(Boolean(request.result));
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

export const getMonitoringToteutunutEntriesBySiteId = async (
  agreementId: string,
): Promise<Record<string, { value: string; createdAt: string }[]>> => {
  const { db, store, tx } = await getStore(
    MONITORING_TOTEUTUNUT_STORE,
    "readonly",
  );

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const records =
        (request.result as MonitoringToteutunutEntryRecord[] | undefined) ?? [];
      const filtered = records.filter(
        (record) => record.agreementId === agreementId,
      );

      const entriesBySiteId = filtered.reduce<
        Record<string, { value: string; createdAt: string }[]>
      >((result, record) => {
        result[record.siteId] = record.entries ?? [];
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

export const setMonitoringToteutunutEntries = async (
  agreementId: string,
  siteId: string,
  entries: { value: string; createdAt: string }[],
): Promise<void> => {
  const { db, store, tx } = await getStore(
    MONITORING_TOTEUTUNUT_STORE,
    "readwrite",
  );

  return new Promise((resolve, reject) => {
    const record: MonitoringToteutunutEntryRecord = {
      agreementId,
      siteId,
      entries,
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

export const setMonitoringToteutunutEntriesBySiteId = async (
  agreementId: string,
  entriesBySiteId: Record<string, { value: string; createdAt: string }[]>,
): Promise<void> => {
  const { db, store, tx } = await getStore(
    MONITORING_TOTEUTUNUT_STORE,
    "readwrite",
  );

  return new Promise((resolve, reject) => {
    const existingKeysRequest = store.getAllKeys();

    existingKeysRequest.onsuccess = () => {
      const existingKeys = (existingKeysRequest.result as IDBValidKey[]) ?? [];
      const nextSiteIds = new Set(Object.keys(entriesBySiteId));

      existingKeys.forEach((key) => {
        if (
          Array.isArray(key) &&
          key[0] === agreementId &&
          typeof key[1] === "string" &&
          !nextSiteIds.has(key[1])
        ) {
          store.delete(key);
        }
      });

      Object.entries(entriesBySiteId).forEach(([siteId, entries]) => {
        const record: MonitoringToteutunutEntryRecord = {
          agreementId,
          siteId,
          entries,
          updatedAt: new Date().toISOString(),
        };

        store.put(record);
      });
    };

    existingKeysRequest.onerror = () => reject(existingKeysRequest.error);
    tx.oncomplete = () => {
      resolve();
      db.close();
    };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};
