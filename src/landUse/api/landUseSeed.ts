import { mockLandUseStore } from "../mocks/landUseMockData";
import { mockLandUsePartiesStore } from "../mocks/landUsePartiesMockData";
import {
  clonePartiesFormValues,
  createEmptyPartiesFormValues,
  mapMockToSitesFormValues,
  mapMockToSummaryFormValues,
} from "./landUseFormValues";
import { hasAgreementTab, setAgreementTab } from "./landUseDb";
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

export const seedLandUseDb = async (): Promise<void> => {
  const agreementIds = getAgreementIds();

  await Promise.all(
    agreementIds.map(async (agreementId) => {
      const summaryData = mapMockToSummaryFormValues(
        mockLandUseStore[agreementId] ?? null,
      );
      const sitesData = mapMockToSitesFormValues(
        mockLandUseStore[agreementId] ?? null,
      );
      const partiesData = mockLandUsePartiesStore[agreementId]
        ? clonePartiesFormValues(mockLandUsePartiesStore[agreementId])
        : createEmptyPartiesFormValues();

      await seedTabIfMissing(agreementId, "summary", summaryData);
      await seedTabIfMissing(agreementId, "sites", sitesData);
      await seedTabIfMissing(agreementId, "parties", partiesData);

      const emptyTabs = LAND_USE_TAB_KEYS.filter(
        (key) => key !== "summary" && key !== "parties" && key !== "sites",
      );

      await Promise.all(
        emptyTabs.map((tabKey) => seedTabIfMissing(agreementId, tabKey, {})),
      );
    }),
  );
};
