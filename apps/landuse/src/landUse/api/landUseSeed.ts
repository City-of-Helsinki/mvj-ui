import { mockLandUseTabStore } from "../mocks/landUseMockData";
import {
  createEmptyInvoicingFormValues,
  clonePartiesFormValues,
  createEmptyPartiesFormValues,
  mapMockToSummaryFormValues,
} from "./landUseFormValues";
import { hasAgreementTab, setAgreementTab } from "./landUseDb";
import { LAND_USE_TAB_KEYS, type LandUseTabKey } from "./landUseTypes";

const getAgreementIds = (): string[] => {
  const ids = new Set<string>();
  Object.keys(mockLandUseTabStore).forEach((id) => ids.add(id));
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
      const agreementMock = mockLandUseTabStore[agreementId];
      const summaryData = mapMockToSummaryFormValues(
        agreementMock?.summary ?? null,
      );
      const partiesData = agreementMock?.parties
        ? clonePartiesFormValues(agreementMock.parties)
        : createEmptyPartiesFormValues();

      await seedTabIfMissing(agreementId, "summary", summaryData);
      await seedTabIfMissing(agreementId, "parties", partiesData);
      await seedTabIfMissing(
        agreementId,
        "invoicing",
        agreementMock?.invoicing ?? createEmptyInvoicingFormValues(),
      );

      const emptyTabs = LAND_USE_TAB_KEYS.filter(
        (key) => key !== "summary" && key !== "parties" && key !== "invoicing",
      );

      await Promise.all(
        emptyTabs.map((tabKey) =>
          seedTabIfMissing(agreementId, tabKey, agreementMock?.[tabKey] ?? {}),
        ),
      );
    }),
  );
};
