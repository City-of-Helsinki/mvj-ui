import {
  mockLandUseTabStore,
  type MockLandUseData,
} from "@/landUse/mocks/landUseMockData";
import {
  clonePartiesFormValues,
  createEmptyBillingFormValues,
  createEmptyPartiesFormValues,
  createEmptyPaymentScheduleFormValues,
  createEmptySummaryFormValues,
} from "@/landUse/api/landUseFormValues";
import { hasAgreementTab, setAgreementTab } from "@/landUse/api/landUseDb";
import {
  LAND_USE_TAB_KEYS,
  type LandUseTabKey,
} from "@/landUse/api/landUseTypes";
import type { LandUseSummaryFormValues } from "@/landUse/components/tabs/LandUseSummary";
import { normalizeSelectValue } from "@/landUse/utils/fieldUtils";

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
export const mapMockToSummaryFormValues = (
  mockData: MockLandUseData | null,
): LandUseSummaryFormValues => {
  if (!mockData) {
    return createEmptySummaryFormValues();
  }

  return {
    maankayttosopimusType: normalizeSelectValue(mockData.maankayttosopimusType),
    kaupunginosa: mockData.kaupunginosa ?? "",
    edistamisalue: normalizeProjectAreaBoolean(mockData.edistamisalue),
    tila: normalizeSelectValue(mockData.tila),
    suunnittelunPerusteenaOlevatKohteet:
      mockData.suunnittelunPerusteenaOlevatKohteet.map((kohde) => ({
        value: normalizeSelectValue(kohde),
      })),
    valmistelijat: mockData.valmistelijat.map((valmistelija) => ({
      value: normalizeSelectValue(
        `${valmistelija.firstName} ${valmistelija.lastName}`.trim(),
      ),
    })),
    osoitteet: mockData.osoitteet.map((osoite) => ({
      katuosoite: osoite.katuosoite,
      postinumero: osoite.postinumero,
      kaupunki: osoite.kaupunki,
    })),
    arvioituEsittelyvuosi: mockData.arvioituEsittelyvuosi,
    arvioituMaksuvuosi: mockData.arvioituMaksuvuosi,
    toimivaltainenPaattaja: mockData.toimivaltainenPaattaja,
    sisaltaaAmVelvoitteita: mockData.sisaltaaAmVelvoitteita,
    velvoitteidenMaaraika: mockData.velvoitteidenMaaraika,
    asemakaavanNumero: mockData.asemakaavanNumero,
    asemakaavanKasittelyvaihe: mockData.asemakaavanKasittelyvaihe,
    vahvistamisHyvaksymisPvm: mockData.vahvistamisHyvaksymisPvm,
    asemakaavanLainvoimaisuusPvm: mockData.asemakaavanLainvoimaisuusPvm ?? "",
    asemakaavanHyvaksyjä: mockData.asemakaavanHyvaksyjä,
    asemakaavanDiaarinumero: mockData.asemakaavanDiaarinumero,
  };
};

const normalizeProjectAreaBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "string") {
    return value.length > 0;
  }
  return false;
};
