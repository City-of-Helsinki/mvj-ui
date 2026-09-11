import { mockLandUseTabStore } from "@/landUse/mocks/landUseMockData";
import {
  clonePartiesFormValues,
  createEmptyBillingFormValues,
  createEmptyPartiesFormValues,
  createEmptyPaymentScheduleFormValues,
  mapMockToSummaryFormValues,
} from "@/landUse/api/landUseFormValues";
import { hasAgreementTab, setAgreementTab } from "@/landUse/api/landUseDb";
import {
  LAND_USE_TAB_KEYS,
  type LandUseTabKey,
} from "@/landUse/api/landUseTypes";

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
        "paymentSchedule",
        agreementMock?.paymentSchedule ??
          createEmptyPaymentScheduleFormValues(),
      );
      await seedTabIfMissing(
        agreementId,
        "billing",
        agreementMock?.billing ?? createEmptyBillingFormValues(),
      );

      const emptyTabs = LAND_USE_TAB_KEYS.filter(
        (key) =>
          key !== "summary" &&
          key !== "parties" &&
          key !== "paymentSchedule" &&
          key !== "billing",
      );

      await Promise.all(
        emptyTabs.map((tabKey) =>
          seedTabIfMissing(agreementId, tabKey, agreementMock?.[tabKey] ?? {}),
        ),
      );
    }),
  );
};
