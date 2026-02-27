import type { LandUseCompensationsFormValues } from "../components/tabs/LandUseCompensations";
import type { LandUseDecisionsFormValues } from "../components/tabs/LandUseDecisions";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseMapFormValues } from "../components/tabs/LandUseMap";
import type {
  LandUseMonitoringFormValues,
  MonitoringToteutunutEntry,
} from "../components/tabs/LandUseMonitoring";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";
import type {
  LandUseSiteTreeNode,
  LandUseSitesFormValues,
} from "../components/tabs/LandUseSites";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import {
  createEmptyPartiesFormValues,
  createEmptySummaryFormValues,
} from "./landUseFormValues";
import {
  getAgreementIds,
  getAgreementTab,
  getMonitoringToteutunutEntriesBySiteId,
  setAgreementListItem,
  setAgreementTab,
  setMonitoringToteutunutEntries,
  setMonitoringToteutunutEntriesBySiteId,
} from "./landUseDb";
import type { LandUseListItem } from "./landUseListTypes";
import { LAND_USE_TAB_KEYS, type LandUseTabKey } from "./landUseTypes";
import {
  createLandUseIdentifier,
  getNextLandUseSequence,
} from "../utils/landUseIdentifier";

const createEmptyTabValues = <T extends object>(): T => ({}) as T;

export const ASEMAKAAVA_KASITTELYVAIHE_OPTIONS = [
  "1. Käynnistys",
  "2. OAS",
  "3. Ehdotus",
  "4. Tarkistettu ehdotus",
  "5. Hyväksyminen",
  "6. Voimaantulo",
] as const;

type AsemakaavaKasittelyvaihe =
  (typeof ASEMAKAAVA_KASITTELYVAIHE_OPTIONS)[number];

export interface AsemakaavaListItem {
  asemakaavanNumero: string;
  asemakaavanKasittelyvaihe: AsemakaavaKasittelyvaihe;
  kasittelyvaiheenViimeisinPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
}

const mockAsemakaavaStore: Record<string, AsemakaavaListItem> = {
  "0000255": {
    asemakaavanNumero: "0000255",
    asemakaavanKasittelyvaihe: "1. Käynnistys",
    kasittelyvaiheenViimeisinPvm: "12.01.2025",
    asemakaavanHyvaksyjä: "Henkilö 1",
    asemakaavanDiaarinumero: "HEL 2947-138205",
  },
  "0000412": {
    asemakaavanNumero: "0000412",
    asemakaavanKasittelyvaihe: "2. OAS",
    kasittelyvaiheenViimeisinPvm: "27.03.2025",
    asemakaavanHyvaksyjä: "Henkilö 2",
    asemakaavanDiaarinumero: "HEL 1035-880164",
  },
  "0000569": {
    asemakaavanNumero: "0000569",
    asemakaavanKasittelyvaihe: "3. Ehdotus",
    kasittelyvaiheenViimeisinPvm: "08.06.2025",
    asemakaavanHyvaksyjä: "Henkilö 3",
    asemakaavanDiaarinumero: "HEL 7408-064219",
  },
  "0000623": {
    asemakaavanNumero: "0000623",
    asemakaavanKasittelyvaihe: "4. Tarkistettu ehdotus",
    kasittelyvaiheenViimeisinPvm: "14.09.2025",
    asemakaavanHyvaksyjä: "Henkilö 4",
    asemakaavanDiaarinumero: "HEL 5512-972406",
  },
  "0000738": {
    asemakaavanNumero: "0000738",
    asemakaavanKasittelyvaihe: "5. Hyväksyminen",
    kasittelyvaiheenViimeisinPvm: "02.11.2025",
    asemakaavanHyvaksyjä: "Henkilö 5",
    asemakaavanDiaarinumero: "HEL 4120-305774",
  },
  "0000891": {
    asemakaavanNumero: "0000891",
    asemakaavanKasittelyvaihe: "6. Voimaantulo",
    kasittelyvaiheenViimeisinPvm: "19.01.2026",
    asemakaavanHyvaksyjä: "Henkilö 6",
    asemakaavanDiaarinumero: "HEL 6689-451392",
  },
};

export const getAsemakaavat = async (): Promise<AsemakaavaListItem[]> =>
  Object.values(mockAsemakaavaStore);

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

type LegacySiteSummaryFields = {
  maankayttosopimusType?: string;
  edistamisalue?: string;
  tila?: string;
  children?: LegacySiteSummaryFields[];
};

const getSummaryFieldsFromLegacySites = (
  sites: LegacySiteSummaryFields[],
): Pick<
  LandUseSummaryFormValues,
  "maankayttosopimusType" | "edistamisalue" | "tila"
> => {
  const visit = (
    items: LegacySiteSummaryFields[],
  ): Pick<
    LandUseSummaryFormValues,
    "maankayttosopimusType" | "edistamisalue" | "tila"
  > | null => {
    for (const item of items) {
      if (item.maankayttosopimusType || item.edistamisalue || item.tila) {
        return {
          maankayttosopimusType: item.maankayttosopimusType,
          edistamisalue: item.edistamisalue,
          tila: item.tila,
        };
      }

      if (item.children?.length) {
        const nestedMatch = visit(item.children);
        if (nestedMatch) {
          return nestedMatch;
        }
      }
    }

    return null;
  };

  return (
    visit(sites) ?? {
      maankayttosopimusType: undefined,
      edistamisalue: undefined,
      tila: undefined,
    }
  );
};

export const getSummary = async (
  agreementId: string,
): Promise<LandUseSummaryFormValues> => {
  const summary = await getTabData(
    agreementId,
    "summary",
    createEmptySummaryFormValues(),
  );

  const normalizedSummary = {
    ...summary,
    suunnittelunPerusteenaOlevatKohteet: summary
      .suunnittelunPerusteenaOlevatKohteet?.length
      ? summary.suunnittelunPerusteenaOlevatKohteet
      : [{ value: undefined }],
  };
  const needsSummaryNormalization =
    !summary.suunnittelunPerusteenaOlevatKohteet?.length;

  if (
    normalizedSummary.maankayttosopimusType ||
    normalizedSummary.edistamisalue ||
    normalizedSummary.tila
  ) {
    if (needsSummaryNormalization) {
      await setAgreementTab(agreementId, "summary", normalizedSummary);
    }
    return normalizedSummary;
  }

  const sites = await getSites(agreementId);
  const migratedFields = getSummaryFieldsFromLegacySites(
    (sites.items ?? []) as unknown as LegacySiteSummaryFields[],
  );

  if (
    !migratedFields.maankayttosopimusType &&
    !migratedFields.edistamisalue &&
    !migratedFields.tila
  ) {
    if (needsSummaryNormalization) {
      await setAgreementTab(agreementId, "summary", normalizedSummary);
    }
    return normalizedSummary;
  }

  const migratedSummary = {
    ...normalizedSummary,
    ...migratedFields,
  };

  await setAgreementTab(agreementId, "summary", migratedSummary);
  return migratedSummary;
};

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

  await Promise.all(
    LAND_USE_TAB_KEYS.map((tabKey) => {
      if (tabKey === "summary") {
        return setAgreementTab(
          identifier,
          tabKey,
          createEmptySummaryFormValues(),
        );
      }

      if (tabKey === "parties") {
        return setAgreementTab(
          identifier,
          tabKey,
          createEmptyPartiesFormValues(),
        );
      }

      if (tabKey === "sites") {
        return setAgreementTab(identifier, tabKey, { items: [] });
      }

      return setAgreementTab(identifier, tabKey, {});
    }),
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

export const getMonitoring = async (
  agreementId: string,
): Promise<LandUseMonitoringFormValues> => {
  const monitoringData = await getTabData(
    agreementId,
    "monitoring",
    createEmptyTabValues<LandUseMonitoringFormValues>(),
  );
  const monitoring: LandUseMonitoringFormValues = {
    toteutunutKm2EntriesBySiteId: monitoringData.toteutunutKm2EntriesBySiteId,
    sakkoRows: monitoringData.sakkoRows,
    sopimuksenMukainen: monitoringData.sopimuksenMukainen,
    rahakorvaus: monitoringData.rahakorvaus,
  };

  const toteutunutEntriesBySiteId =
    await getMonitoringToteutunutEntriesBySiteId(agreementId);

  if (Object.keys(toteutunutEntriesBySiteId).length === 0) {
    return monitoring;
  }

  return {
    ...monitoring,
    toteutunutKm2EntriesBySiteId: {
      ...(monitoring.toteutunutKm2EntriesBySiteId ?? {}),
      ...toteutunutEntriesBySiteId,
    },
  };
};

export const getMonitoringToteutunutEntries = async (
  agreementId: string,
): Promise<Record<string, MonitoringToteutunutEntry[]>> =>
  getMonitoringToteutunutEntriesBySiteId(agreementId);

export const addMonitoringToteutunutEntry = async (
  agreementId: string,
  siteId: string,
  entry: MonitoringToteutunutEntry,
): Promise<MonitoringToteutunutEntry[]> => {
  const entriesBySiteId =
    await getMonitoringToteutunutEntriesBySiteId(agreementId);
  const nextEntries = [...(entriesBySiteId[siteId] ?? []), entry];

  await setMonitoringToteutunutEntries(agreementId, siteId, nextEntries);
  return nextEntries;
};

export const updateMonitoring = async (
  agreementId: string,
  values: LandUseMonitoringFormValues,
): Promise<LandUseMonitoringFormValues> => {
  const sanitizedValues: LandUseMonitoringFormValues = {
    toteutunutKm2EntriesBySiteId: values.toteutunutKm2EntriesBySiteId,
    sakkoRows: values.sakkoRows,
    sopimuksenMukainen: values.sopimuksenMukainen,
    rahakorvaus: values.rahakorvaus,
  };

  await setMonitoringToteutunutEntriesBySiteId(
    agreementId,
    sanitizedValues.toteutunutKm2EntriesBySiteId ?? {},
  );
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
