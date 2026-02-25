import type { LandUseCompensationsFormValues } from "../components/tabs/LandUseCompensations";
import type { LandUseDecisionsFormValues } from "../components/tabs/LandUseDecisions";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseMapFormValues } from "../components/tabs/LandUseMap";
import type { LandUseMonitoringFormValues } from "../components/tabs/LandUseMonitoring";
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
): Promise<LandUseMonitoringFormValues> =>
  getTabData(agreementId, "monitoring", createEmptyTabValues());

export const updateMonitoring = async (
  agreementId: string,
  values: LandUseMonitoringFormValues,
): Promise<LandUseMonitoringFormValues> => {
  await setAgreementTab(agreementId, "monitoring", values);
  return values;
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
