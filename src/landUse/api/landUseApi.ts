import type { LandUseCompensationsFormValues } from "../components/tabs/LandUseCompensations";
import type { LandUseCollateralsFormValues } from "../components/tabs/LandUseCollaterals";
import type { LandUseDecisionsFormValues } from "../components/tabs/LandUseDecisions";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseMapFormValues } from "../components/tabs/LandUseMap";
import type {
  LandUseMonitoringFormValues,
  MonitoringToteumaEntry,
} from "../components/tabs/LandUseMonitoring";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";
import type {
  LandUseSiteTreeNode,
  LandUseSitesFormValues,
} from "../components/tabs/LandUseSites";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import {
  landUseAsemakaavaListItems,
  type AsemakaavaListItem,
} from "../options";
import {
  createEmptyPartiesFormValues,
  createEmptySummaryFormValues,
} from "./landUseFormValues";
import {
  getAgreementIds,
  getAgreementTab,
  getLegacyMonitoringToteutunutEntriesBySiteId,
  setAgreementListItem,
  setAgreementTab,
} from "./landUseDb";
import type { LandUseListItem } from "./landUseListTypes";
import { LAND_USE_TAB_KEYS, type LandUseTabKey } from "./landUseTypes";
import {
  createLandUseIdentifier,
  getNextLandUseSequence,
} from "../utils/landUseIdentifier";

const createEmptyTabValues = <T extends object>(): T => ({}) as T;

export const getAsemakaavat = async (): Promise<AsemakaavaListItem[]> =>
  landUseAsemakaavaListItems;

const getTabData = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
  fallback: T,
): Promise<T> => {
  const data = await getAgreementTab<T>(agreementId, tabKey);
  if (data) {
    return data;
  }

  await setAgreementTab(agreementId, tabKey, fallback);
  return fallback;
};

const flattenSites = (items: LandUseSiteTreeNode[]): LandUseSiteTreeNode[] => {
  const flattened: LandUseSiteTreeNode[] = [];

  const collect = (nodes: LandUseSiteTreeNode[]) => {
    nodes.forEach((node) => {
      flattened.push(node);
      if (node.children?.length) {
        collect(node.children);
      }
    });
  };

  collect(items);
  return flattened;
};

export const getSummary = async (
  agreementId: string,
): Promise<LandUseSummaryFormValues> =>
  getTabData(agreementId, "summary", createEmptySummaryFormValues());

export const getAgreementIdentifiers = async (): Promise<string[]> =>
  getAgreementIds();

export const getLandUseList = async (): Promise<LandUseListItem[]> => {
  const agreementIds = await getAgreementIds();

  const listItems = await Promise.all(
    agreementIds.map(async (agreementId) => {
      const [parties, sites] = await Promise.all([
        getParties(agreementId),
        getSites(agreementId),
      ]);

      const partyName = parties?.customer?.details?.name ?? "";
      const flatSites = flattenSites(sites?.items ?? []);
      const kohdeValues =
        flatSites
          ?.map((kohde) => kohde.kohteenTunnus)
          .filter((value): value is string => Boolean(value))
          .join(", ") ?? "";

      return {
        id: agreementId,
        identifier: agreementId,
        party: partyName,
        zoningPlanNumber: "",
        site: kohdeValues,
        projectArea: "",
        negotiationPhase: "",
      } satisfies LandUseListItem;
    }),
  );

  return listItems;
};

export const createLandUseAgreement = async (
  municipalityId: string,
  districtId: string,
): Promise<string> => {
  const existingIdentifiers = await getAgreementIds();
  const sequence = getNextLandUseSequence(
    existingIdentifiers,
    municipalityId,
    districtId,
  );
  const identifier = createLandUseIdentifier(
    municipalityId,
    districtId,
    sequence,
  );

  await setAgreementListItem({
    id: identifier,
    identifier,
    party: "",
    zoningPlanNumber: "",
    site: "",
    projectArea: "",
    negotiationPhase: "",
  });

  return identifier;
};

export const updateSummary = async (
  agreementId: string,
  values: LandUseSummaryFormValues,
): Promise<LandUseSummaryFormValues> => {
  await setAgreementTab(agreementId, "summary", values);
  return values;
};

export const getParties = async (
  agreementId: string,
): Promise<LandUsePartiesFormValues> =>
  getTabData(agreementId, "parties", createEmptyPartiesFormValues());

export const getSites = async (
  agreementId: string,
): Promise<LandUseSitesFormValues> =>
  getTabData(agreementId, "sites", { items: [] });

export const updateSites = async (
  agreementId: string,
  values: LandUseSitesFormValues,
): Promise<LandUseSitesFormValues> => {
  await setAgreementTab(agreementId, "sites", values);
  return values;
};

export const updateParties = async (
  agreementId: string,
  values: LandUsePartiesFormValues,
): Promise<LandUsePartiesFormValues> => {
  await setAgreementTab(agreementId, "parties", values);
  return values;
};

export const getCompensations = async (
  agreementId: string,
): Promise<LandUseCompensationsFormValues> =>
  getTabData(
    agreementId,
    "compensations",
    createEmptyTabValues<LandUseCompensationsFormValues>(),
  );

export const updateCompensations = async (
  agreementId: string,
  values: LandUseCompensationsFormValues,
): Promise<LandUseCompensationsFormValues> => {
  await setAgreementTab(agreementId, "compensations", values);
  return values;
};

export const getCollaterals = async (
  agreementId: string,
): Promise<LandUseCollateralsFormValues> =>
  getTabData(
    agreementId,
    "collaterals",
    createEmptyTabValues<LandUseCollateralsFormValues>(),
  );

export const updateCollaterals = async (
  agreementId: string,
  values: LandUseCollateralsFormValues,
): Promise<LandUseCollateralsFormValues> => {
  await setAgreementTab(agreementId, "collaterals", values);
  return values;
};

export const getMonitoring = async (
  agreementId: string,
): Promise<LandUseMonitoringFormValues> => {
  const monitoringData = await getTabData(
    agreementId,
    "monitoring",
    createEmptyTabValues<LandUseMonitoringFormValues>(),
  );

  const legacyData = monitoringData as LandUseMonitoringFormValues & {
    toteutunutKm2EntriesBySiteId?: Record<string, MonitoringToteumaEntry[]>;
  };
  const currentEntriesBySiteId = monitoringData.toteumaEntriesBySiteId ?? {};
  let legacyEntriesBySiteId: Record<string, MonitoringToteumaEntry[]> =
    legacyData.toteutunutKm2EntriesBySiteId ?? {};

  if (
    Object.keys(legacyEntriesBySiteId).length === 0 &&
    Object.keys(currentEntriesBySiteId).length === 0
  ) {
    legacyEntriesBySiteId =
      await getLegacyMonitoringToteutunutEntriesBySiteId(agreementId);
  }

  const mergedEntriesBySiteId = {
    ...legacyEntriesBySiteId,
    ...currentEntriesBySiteId,
  };

  const hasLegacyKey = Boolean(legacyData.toteutunutKm2EntriesBySiteId);
  const hasMissingUnifiedEntries =
    Object.keys(mergedEntriesBySiteId).length > 0 &&
    Object.keys(currentEntriesBySiteId).length === 0;

  const normalizedValues: LandUseMonitoringFormValues = {
    toteumaEntriesBySiteId: mergedEntriesBySiteId,
    sakkoRows: monitoringData.sakkoRows,
  };

  if (hasLegacyKey || hasMissingUnifiedEntries) {
    await setAgreementTab(agreementId, "monitoring", normalizedValues);
  }

  return normalizedValues;
};

export const addMonitoringToteumaEntry = async (
  agreementId: string,
  siteId: string,
  entry: MonitoringToteumaEntry,
): Promise<MonitoringToteumaEntry[]> => {
  const currentValues = await getMonitoring(agreementId);
  const entriesBySiteId = currentValues.toteumaEntriesBySiteId ?? {};
  const nextEntries = [...(entriesBySiteId[siteId] ?? []), entry];

  await setAgreementTab(agreementId, "monitoring", {
    ...currentValues,
    toteumaEntriesBySiteId: {
      ...entriesBySiteId,
      [siteId]: nextEntries,
    },
  } satisfies LandUseMonitoringFormValues);

  return nextEntries;
};

export const updateMonitoring = async (
  agreementId: string,
  values: LandUseMonitoringFormValues,
): Promise<LandUseMonitoringFormValues> => {
  const sanitizedValues: LandUseMonitoringFormValues = {
    toteumaEntriesBySiteId: values.toteumaEntriesBySiteId,
    sakkoRows: values.sakkoRows,
  };

  await setAgreementTab(agreementId, "monitoring", sanitizedValues);
  return sanitizedValues;
};

export const getDecisions = async (
  agreementId: string,
): Promise<LandUseDecisionsFormValues> =>
  getTabData(agreementId, "decisions", createEmptyTabValues());

export const updateDecisions = async (
  agreementId: string,
  values: LandUseDecisionsFormValues,
): Promise<LandUseDecisionsFormValues> => {
  await setAgreementTab(agreementId, "decisions", values);
  return values;
};

export const getInvoicing = async (
  agreementId: string,
): Promise<LandUseInvoicingFormValues> =>
  getTabData(agreementId, "invoicing", createEmptyTabValues());

export const updateInvoicing = async (
  agreementId: string,
  values: LandUseInvoicingFormValues,
): Promise<LandUseInvoicingFormValues> => {
  await setAgreementTab(agreementId, "invoicing", values);
  return values;
};

export const getMap = async (
  agreementId: string,
): Promise<LandUseMapFormValues> =>
  getTabData(agreementId, "map", createEmptyTabValues());

export const updateMap = async (
  agreementId: string,
  values: LandUseMapFormValues,
): Promise<LandUseMapFormValues> => {
  await setAgreementTab(agreementId, "map", values);
  return values;
};
