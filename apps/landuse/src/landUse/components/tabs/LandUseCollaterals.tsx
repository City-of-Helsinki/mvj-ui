import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Fieldset,
  IconAngleLeft,
  IconAngleRight,
  IconSize,
  NumberInput,
  StepByStep,
  Table,
  TextInput,
} from "hds-react";
import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";
import { DEFAULT_KOROTUSKERROIN } from "../../constants";
import { useTocEntries } from "../../hooks/useTableOfContents";
import {
  formatLandUseDecimalValue,
  formatLandUseEuroValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
} from "../../utils/number";
import {
  calculateHintaero,
  calculateSaantelynMukainenOriginalValue,
  calculateSopimussakko,
  calculateVakuustarve,
  getVakuustarveKerroinPercent,
  MINIMUM_HINTAERO,
} from "../../utils/vakuustarve";
import type { LandUseSite } from "./LandUseCompensations";

export interface LandUseCollateralsFormValues {
  korotuskerroin?: string | number;
}

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

interface CollateralsVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  kem2: string;
  hintaero: string;
  sopimussakko: string;
  kerroin: string;
  vakuustarve: React.ReactNode;
}

interface LandUseCollateralsProps {
  form: FormApi<LandUseCollateralsFormValues>;
  isEditMode: boolean;
  sites: LandUseSite[];
  perushinta?: string;
  compensationsRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  maankayttokorvausYhteensa?: number;
}

const formatSiteHallintamuoto = (
  hallintamuoto: string[] | undefined,
): string => {
  if (!hallintamuoto || hallintamuoto.length === 0) {
    return "-";
  }

  return hallintamuoto.join(", ");
};

const getKorotuskerroinValue = (value: string | number | undefined): number =>
  parseLandUseNumericValue(value) ?? DEFAULT_KOROTUSKERROIN;

const COLLATERAL_STEP_KEYS = {
  vakuuslaskuri: "vakuuslaskuri",
  kokonaisvakuustarve: "kokonaisvakuustarve",
  vakuustarvekerroin: "vakuustarvekerroin",
} as const;

const COLLATERAL_STEPS = [
  {
    key: COLLATERAL_STEP_KEYS.vakuuslaskuri,
    title: "Vakuuslaskuri",
  },
  {
    key: COLLATERAL_STEP_KEYS.kokonaisvakuustarve,
    title: "Kokonaisvakuustarve",
  },
  {
    key: COLLATERAL_STEP_KEYS.vakuustarvekerroin,
    title: "Vakuustarpeen laskentaperusteet",
  },
] as const;

const getCollateralStepId = (key: string): string => `collaterals-step-${key}`;

export const LandUseCollaterals: React.FC<LandUseCollateralsProps> = ({
  form,
  isEditMode,
  sites,
  perushinta,
  compensationsRowsBySiteId,
  maankayttokorvausYhteensa,
}) => {
  const tocEntries = useMemo(
    () =>
      COLLATERAL_STEPS.map((step) => ({
        id: getCollateralStepId(step.key),
        text: step.title,
        level: 2,
      })),
    [],
  );

  useTocEntries(tocEntries);

  return (
    <Form<LandUseCollateralsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const korotuskerroin = getKorotuskerroinValue(values.korotuskerroin);

        const vakuuslaskuriRows: CollateralsVakuuslaskuriRow[] = sites.map(
          (site) => {
            const kohteenTunnus = site.kohteenTunnus || "-";
            const vaadittuValue = parseLandUseNumericValue(site.kem2);
            const hintaeroValue = calculateHintaero(
              perushinta,
              compensationsRowsBySiteId[site.id]?.yksikkohinta,
            );
            const sopimussakkoValue = calculateSopimussakko(
              hintaeroValue,
              korotuskerroin,
            );
            const kerroinPercent =
              sopimussakkoValue !== null
                ? getVakuustarveKerroinPercent(sopimussakkoValue)
                : null;

            const vakuustarveValue =
              vaadittuValue !== null &&
              hintaeroValue !== null &&
              kerroinPercent !== null
                ? calculateVakuustarve(
                    vaadittuValue,
                    hintaeroValue,
                    kerroinPercent,
                    korotuskerroin,
                  )
                : null;

            return {
              kohteenTunnus,
              hallintamuoto: formatSiteHallintamuoto(site.hallintamuoto),
              kem2:
                formatLandUseNumericValueWithUnit(vaadittuValue, "kem²") || "-",
              hintaero:
                hintaeroValue !== null
                  ? formatLandUseNumericValueWithUnit(hintaeroValue, "€")
                  : "-",
              sopimussakko: formatLandUseNumericValueWithUnit(
                sopimussakkoValue,
                "€/kem²",
              ),
              kerroin: kerroinPercent !== null ? `${kerroinPercent} %` : "-",
              vakuustarve:
                vakuustarveValue !== null
                  ? formatLandUseEuroValue(vakuustarveValue)
                  : "-",
            };
          },
        );

        const collateralsVakuuslaskuriCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "kem2", headerName: "Kerrosala" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
        ];

        const collateralsVakuuslaskuriTableRows = vakuuslaskuriRows.map(
          (row, index) => ({
            id: `vakuuslaskuri-row-${row.kohteenTunnus}-${index}`,
            kohteenTunnus: row.kohteenTunnus,
            hallintamuoto: row.hallintamuoto || "-",
            kem2: row.kem2 || "-",
            vakuustarve: row.vakuustarve,
          }),
        );

        const sopimuksenMukainenValue = maankayttokorvausYhteensa ?? 0;

        const saantelynMukainenValue = calculateSaantelynMukainenOriginalValue(
          sites,
          compensationsRowsBySiteId,
          perushinta,
          korotuskerroin,
        );

        const totalCollateralSeparatorDirection =
          sopimuksenMukainenValue > saantelynMukainenValue
            ? "left"
            : saantelynMukainenValue > sopimuksenMukainenValue
              ? "right"
              : "equal";

        const collateralsInfoCols = [
          { key: "hintaero", headerName: "Hintaero * Korotuskerroin" },
          { key: "vakuustarvekerroin", headerName: "Vakuustarvekerroin" },
        ];

        const collateralsInfoRows = [
          {
            id: "info-1",
            hintaero: "0 € / kem² - 500 € / kem²",
            vakuustarvekerroin: "100 %",
          },
          {
            id: "info-2",
            hintaero: "501 € / kem² - 1000 € / kem²",
            vakuustarvekerroin: "80 %",
          },
          {
            id: "info-3",
            hintaero: "1001 € / kem² - 1500 € / kem²",
            vakuustarvekerroin: "70 %",
          },
          {
            id: "info-4",
            hintaero: "1501 € / kem² -",
            vakuustarvekerroin: "60 %",
          },
        ];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Vakuustarve</h1>

              <StepByStep
                steps={[
                  {
                    title: COLLATERAL_STEPS[0].title,
                    key: COLLATERAL_STEP_KEYS.vakuuslaskuri,
                    description: (
                      <div
                        id={getCollateralStepId(
                          COLLATERAL_STEP_KEYS.vakuuslaskuri,
                        )}
                      >
                        <Fieldset
                          heading=""
                          className="landuse-detail__fieldset--with-margin"
                        >
                          <div className="landuse-grid">
                            <div className="landuse-grid__column-3">
                              <Field name="korotuskerroin">
                                {({ input }) => {
                                  const korotuskerroinValue =
                                    getKorotuskerroinValue(input.value);

                                  return (
                                    <>
                                      {isEditMode ? (
                                        <NumberInput
                                          id="collaterals-korotuskerroin"
                                          label="Korotuskerroin"
                                          min={1}
                                          max={2}
                                          step={0.05}
                                          value={korotuskerroinValue}
                                          onChange={input.onChange}
                                        />
                                      ) : (
                                        <TextInput
                                          id="collaterals-korotuskerroin"
                                          label="Korotuskerroin"
                                          value={formatLandUseDecimalValue(
                                            korotuskerroinValue,
                                          )}
                                          readOnly
                                        />
                                      )}
                                    </>
                                  );
                                }}
                              </Field>
                            </div>
                          </div>
                          <div className="landuse-detail__table-wrapper">
                            <Table
                              className="landuse-detail__table landuse-detail__monitoring-table"
                              cols={collateralsVakuuslaskuriCols}
                              indexKey="id"
                              renderIndexCol={false}
                              rows={collateralsVakuuslaskuriTableRows}
                              variant="light"
                            />
                          </div>
                        </Fieldset>
                      </div>
                    ),
                  },
                  {
                    title: COLLATERAL_STEPS[1].title,
                    key: COLLATERAL_STEP_KEYS.kokonaisvakuustarve,
                    description: (
                      <div
                        id={getCollateralStepId(
                          COLLATERAL_STEP_KEYS.kokonaisvakuustarve,
                        )}
                      >
                        <Fieldset
                          heading=""
                          className="landuse-detail__fieldset--with-margin"
                        >
                          <div className="landuse-grid">
                            <NumericDecimalInput
                              id="collaterals-sopimuksen-mukainen"
                              label="Maankäyttökorvaus"
                              value={sopimuksenMukainenValue}
                              isEditMode={false}
                              unit="€"
                              style={
                                totalCollateralSeparatorDirection === "left"
                                  ? {
                                      border: "4px solid var(--color-success)",
                                      padding: "var(--spacing-2-xs)",
                                    }
                                  : {
                                      padding: "var(--spacing-2-xs)",
                                    }
                              }
                            />
                            <span
                              className={`landuse-detail__monitoring-collateral-separator landuse-detail__monitoring-collateral-separator--${totalCollateralSeparatorDirection}`}
                              aria-hidden="true"
                            >
                              {totalCollateralSeparatorDirection === "right" ? (
                                <IconAngleLeft size={IconSize.ExtraLarge} />
                              ) : (
                                <IconAngleRight size={IconSize.ExtraLarge} />
                              )}
                            </span>
                            <NumericDecimalInput
                              id="collaterals-saantelyn-mukainen"
                              label="Asumismuotoehdot"
                              value={saantelynMukainenValue}
                              isEditMode={false}
                              unit="€"
                              style={
                                totalCollateralSeparatorDirection === "right"
                                  ? {
                                      border: "4px solid var(--color-success)",
                                      padding: "var(--spacing-2-xs)",
                                    }
                                  : {
                                      padding: "var(--spacing-2-xs)",
                                    }
                              }
                            />
                          </div>
                        </Fieldset>
                      </div>
                    ),
                  },
                  {
                    title: COLLATERAL_STEPS[2].title,
                    key: COLLATERAL_STEP_KEYS.vakuustarvekerroin,
                    description: (
                      <div
                        id={getCollateralStepId(
                          COLLATERAL_STEP_KEYS.vakuustarvekerroin,
                        )}
                      >
                        <div>
                          <p>
                            Vakuustarve kullekin kohteelle lasketaan kaavalla:
                          </p>
                          <pre>
                            <strong>
                              Vakuustarve = Kerrosala * Korotuskerroin *
                              Hintaero * Vakuustarvekerroin
                            </strong>
                          </pre>
                          <p>Hintaero on suurempi seuraavista:</p>
                          <pre>
                            <strong>
                              {`(Perushinta - Yksikköhinta), tai ${MINIMUM_HINTAERO}`}
                            </strong>
                          </pre>
                          <p>
                            Vakuustarvekerroin määräytyy hintaeron ja
                            korotuskertoimen mukaisesti:
                          </p>
                          <Table
                            cols={collateralsInfoCols}
                            indexKey="id"
                            renderIndexCol={false}
                            rows={collateralsInfoRows}
                            variant="light"
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </form>
        );
      }}
    />
  );
};
