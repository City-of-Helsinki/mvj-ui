import { mockLandUseStore } from "../mocks/landUseMockData";
import { mockLandUsePartiesStore } from "../mocks/landUsePartiesMockData";
import {
  clonePartiesFormValues,
  createEmptyPartiesFormValues,
  mapMockToSummaryFormValues,
} from "./landUseFormValues";
import {
  hasAgreementListItem,
  hasAgreementTab,
  setAgreementListItem,
  setAgreementTab,
} from "./landUseDb";
import type { LandUseListItem } from "./landUseListTypes";
import { LAND_USE_TAB_KEYS, type LandUseTabKey } from "./landUseTypes";

const getAgreementIds = (): string[] => {
  const ids = new Set<string>();
  Object.keys(mockLandUseStore).forEach((id) => ids.add(id));
  Object.keys(mockLandUsePartiesStore).forEach((id) => ids.add(id));
  return Array.from(ids);
};

const seedTabIfMissing = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
  data: T,
): Promise<void> => {
  const exists = await hasAgreementTab(agreementId, tabKey);
  if (!exists) {
    await setAgreementTab(agreementId, tabKey, data);
  }
};

const seedListItemIfMissing = async (item: LandUseListItem): Promise<void> => {
  const exists = await hasAgreementListItem(item.identifier);
  if (!exists) {
    await setAgreementListItem(item);
  }
};

export const seedLandUseDb = async (): Promise<void> => {
  const agreementIds = getAgreementIds();

  await Promise.all(
    agreementIds.map(async (agreementId) => {
      const summaryData = mapMockToSummaryFormValues(
        mockLandUseStore[agreementId] ?? null,
      );
      const partiesData = mockLandUsePartiesStore[agreementId]
        ? clonePartiesFormValues(mockLandUsePartiesStore[agreementId])
        : createEmptyPartiesFormValues();

      await seedTabIfMissing(agreementId, "summary", summaryData);
      await seedTabIfMissing(agreementId, "parties", partiesData);

      const emptyTabs = LAND_USE_TAB_KEYS.filter(
        (key) => key !== "summary" && key !== "parties",
      );

      await Promise.all(
        emptyTabs.map((tabKey) => seedTabIfMissing(agreementId, tabKey, {})),
      );
    }),
  );

  await Promise.all(
    mockLandUseStore
      ? Object.values(mockLandUseStore).map((item) =>
          seedListItemIfMissing({
            id: item.identifier,
            identifier: item.identifier,
            party: item.party ?? "",
            zoningPlanNumber: item.zoningPlanNumber ?? "",
            target: item.kohteet[0]?.edistamisalue ?? "",
            projectArea: item.projectArea ?? "",
            negotiationPhase:
              item.kohteet[0]?.tila ?? item.negotiationPhase ?? "",
          }),
        )
      : [],
  );
};
