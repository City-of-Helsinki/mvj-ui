import { parseLandUseNumericValue } from "./number";

export interface CollateralSelectedGuaranteeValue {
  guaranteeId: string;
  kaytettavaMaara: string;
}

export interface CollateralGuaranteeValue {
  id: string;
  sopimusnumero: string;
  jarjestysnumero: string;
  vakuudenMaara: string;
  alkuperainenVakuuttaJaljella: string;
}

export interface CollateralGuaranteeBalance extends CollateralGuaranteeValue {
  kaytettyMaara: number;
  jaljellaMaara: number;
}

export interface CollateralAgreementGuarantee {
  jarjestysnumero: string;
  vakuudenMaara: string;
  vakuuttaJaljella: string;
}

export interface CollateralAgreementValue {
  sopimusnumero: string;
  vakuudet?: CollateralAgreementGuarantee[];
}

export const getGuaranteesFromAgreements = (
  agreements: CollateralAgreementValue[],
): CollateralGuaranteeValue[] =>
  agreements.flatMap((agreement, agreementIndex) =>
    (agreement.vakuudet ?? []).map((guarantee, guaranteeIndex) => ({
      id: `agreement-${agreementIndex}-guarantee-${guaranteeIndex}`,
      sopimusnumero: agreement.sopimusnumero || "-",
      jarjestysnumero: guarantee.jarjestysnumero || "-",
      vakuudenMaara: guarantee.vakuudenMaara || "-",
      alkuperainenVakuuttaJaljella: guarantee.vakuuttaJaljella || "-",
    })),
  );

export const calculateGuaranteeBalances = (
  guarantees: CollateralGuaranteeValue[],
  selectionsBySiteId?: Record<string, CollateralSelectedGuaranteeValue[]>,
): CollateralGuaranteeBalance[] => {
  const kaytettyMaaraByGuaranteeId = Object.values(selectionsBySiteId ?? {})
    .flat()
    .reduce<Record<string, number>>((accumulator, selection) => {
      const kaytettavaMaara = parseLandUseNumericValue(
        selection.kaytettavaMaara,
      );
      if (kaytettavaMaara === null) {
        return accumulator;
      }

      return {
        ...accumulator,
        [selection.guaranteeId]:
          (accumulator[selection.guaranteeId] ?? 0) + kaytettavaMaara,
      };
    }, {});

  return guarantees.map((guarantee) => {
    const vakuudenMaara = parseLandUseNumericValue(guarantee.vakuudenMaara);
    const alkuperainenJaljella = parseLandUseNumericValue(
      guarantee.alkuperainenVakuuttaJaljella,
    );
    const laskennanPohja = vakuudenMaara ?? alkuperainenJaljella ?? 0;
    const kaytettyMaara = kaytettyMaaraByGuaranteeId[guarantee.id] ?? 0;

    return {
      ...guarantee,
      kaytettyMaara,
      jaljellaMaara: laskennanPohja - kaytettyMaara,
    };
  });
};
