import type { LandUseCompensationsFormValues } from "../components/tabs/LandUseCompensations";
import type { LandUseCollateralsFormValues } from "../components/tabs/LandUseCollaterals";
import type { LandUseDecisionsFormValues } from "../components/tabs/LandUseDecisions";
import type { LandUseInvoicingFormValues } from "../components/tabs/LandUseInvoicing";
import type { LandUseMapFormValues } from "../components/tabs/LandUseMap";
import type { LandUseMonitoringFormValues } from "../components/tabs/LandUseMonitoring";
import type { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";
import type { LandUseSummaryFormValues } from "../components/tabs/LandUseSummary";
import {
  landUseAsemakaavaListItems,
  type AsemakaavaListItem,
} from "../options";
import {
  createLandUseIdentifier,
  getNextLandUseSequence,
} from "../utils/landUseIdentifier";
import { createEmptySummaryFormValues } from "./landUseFormValues";
import { getAgreementIds, getAgreementTab, setAgreementTab } from "./landUseDb";
import type { LandUseListItem } from "./landUseListTypes";

export const getAsemakaavat = async (): Promise<AsemakaavaListItem[]> =>
  landUseAsemakaavaListItems;

export const getSummary = async (
  agreementId: string,
): Promise<LandUseSummaryFormValues | null> =>
  getAgreementTab<LandUseSummaryFormValues>(agreementId, "summary");

export const getAgreementIdentifiers = async (): Promise<string[]> =>
  getAgreementIds();

export const getLandUseList = async (): Promise<LandUseListItem[]> => {
  const agreementIds = await getAgreementIds();

  const listItems = await Promise.all(
    agreementIds.map(async (agreementId) => {
      const [summary, parties, compensations] = await Promise.all([
        getSummary(agreementId),
        getParties(agreementId),
        getCompensations(agreementId),
      ]);

      const partyName = parties?.customer?.details?.name ?? "";
      const sites = compensations?.sites ?? [];
      const kohdeValues =
        sites
          .map((site) => site.kohteenTunnus)
          .filter((value): value is string => Boolean(value))
          .join(", ") ?? "";

      return {
        id: agreementId,
        identifier: agreementId,
        party: partyName,
        zoningPlanNumber: summary?.asemakaavanNumero ?? "",
        site: kohdeValues,
        projectArea: summary?.edistamisalue ?? "",
        negotiationPhase: summary?.tila ?? "",
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

  await setAgreementTab(identifier, "summary", createEmptySummaryFormValues());

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
): Promise<LandUsePartiesFormValues | null> =>
  getAgreementTab<LandUsePartiesFormValues>(agreementId, "parties");

export const updateParties = async (
  agreementId: string,
  values: LandUsePartiesFormValues,
): Promise<LandUsePartiesFormValues> => {
  await setAgreementTab(agreementId, "parties", values);
  return values;
};

export const getCompensations = async (
  agreementId: string,
): Promise<LandUseCompensationsFormValues | null> =>
  getAgreementTab<LandUseCompensationsFormValues>(agreementId, "compensations");

export const updateCompensations = async (
  agreementId: string,
  values: LandUseCompensationsFormValues,
): Promise<LandUseCompensationsFormValues> => {
  await setAgreementTab(agreementId, "compensations", values);
  return values;
};

export const getCollaterals = async (
  agreementId: string,
): Promise<LandUseCollateralsFormValues | null> =>
  getAgreementTab<LandUseCollateralsFormValues>(agreementId, "collaterals");

export const updateCollaterals = async (
  agreementId: string,
  values: LandUseCollateralsFormValues,
): Promise<LandUseCollateralsFormValues> => {
  await setAgreementTab(agreementId, "collaterals", values);
  return values;
};

export const getMonitoring = async (
  agreementId: string,
): Promise<LandUseMonitoringFormValues | null> =>
  getAgreementTab<LandUseMonitoringFormValues>(agreementId, "monitoring");

export const updateMonitoring = async (
  agreementId: string,
  values: LandUseMonitoringFormValues,
): Promise<LandUseMonitoringFormValues> => {
  const sanitizedValues: LandUseMonitoringFormValues = {
    toteumaEntriesBySiteId: values.toteumaEntriesBySiteId,
    toteumaEntriesByPlotDivisionId: values.toteumaEntriesByPlotDivisionId,
    toteutunutHallintamuotoBySiteId: values.toteutunutHallintamuotoBySiteId,
    plotDivisionsBySiteId: values.plotDivisionsBySiteId,
    sakkoRows: values.sakkoRows,
  };

  await setAgreementTab(agreementId, "monitoring", sanitizedValues);
  return sanitizedValues;
};

export const getDecisions = async (
  agreementId: string,
): Promise<LandUseDecisionsFormValues | null> =>
  getAgreementTab<LandUseDecisionsFormValues>(agreementId, "decisions");

export const updateDecisions = async (
  agreementId: string,
  values: LandUseDecisionsFormValues,
): Promise<LandUseDecisionsFormValues> => {
  await setAgreementTab(agreementId, "decisions", values);
  return values;
};

export const getInvoicing = async (
  agreementId: string,
): Promise<LandUseInvoicingFormValues | null> =>
  getAgreementTab<LandUseInvoicingFormValues>(agreementId, "invoicing");

export const updateInvoicing = async (
  agreementId: string,
  values: LandUseInvoicingFormValues,
): Promise<LandUseInvoicingFormValues> => {
  await setAgreementTab(agreementId, "invoicing", values);
  return values;
};

export const getMap = async (
  agreementId: string,
): Promise<LandUseMapFormValues | null> =>
  getAgreementTab<LandUseMapFormValues>(agreementId, "map");

export const updateMap = async (
  agreementId: string,
  values: LandUseMapFormValues,
): Promise<LandUseMapFormValues> => {
  await setAgreementTab(agreementId, "map", values);
  return values;
};
