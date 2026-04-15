import React from "react";
import {
  Fieldset,
  IconAngleLeft,
  IconAngleRight,
  NumberInput,
  Notification,
  Table,
  TextInput,
  IconSize,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { LandUseSite } from "./LandUseCompensations";
import {
  formatLandUseEuroValue,
  formatLandUseNumericValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
} from "../../utils/number";
import {
  calculateHintaero,
  calculateSaantelynMukainenOriginalValue,
  calculateSopimussakko,
  calculateVakuustarve,
  getKerroinPercent,
} from "../../utils/vakuustarve";
import { DEFAULT_KOROTUSKERROIN } from "../../constants";

export interface LandUseCollateralsFormValues {
  korotuskerroin?: number;
}

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

interface CollateralsVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  km2: string;
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

export const LandUseCollaterals: React.FC<LandUseCollateralsProps> = ({
  form,
  isEditMode,
  sites,
  perushinta,
  compensationsRowsBySiteId,
  maankayttokorvausYhteensa,
}) => {
  return (
    <Form<LandUseCollateralsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const korotuskerroin =
          parseLandUseNumericValue(values.korotuskerroin) ??
          DEFAULT_KOROTUSKERROIN;

        const vakuuslaskuriRows: CollateralsVakuuslaskuriRow[] = sites.map(
          (site) => {
            const kohteenTunnus = site.kohteenTunnus || "-";
            const vaadittuValue = parseLandUseNumericValue(site.km2);
            const hintaeroValue = calculateHintaero(
              perushinta,
              compensationsRowsBySiteId[site.id]?.yksikkohinta,
            );
            const sopimussakkoValue = calculateSopimussakko(
              hintaeroValue,
              korotuskerroin,
            );
            const kerroinPercent =
              hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;

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
              km2: site.km2 || "-",
              hintaero:
                hintaeroValue !== null
                  ? formatLandUseNumericValue(hintaeroValue)
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
          { key: "km2", headerName: "k-m²" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "kerroin", headerName: "Kerroin" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
        ];

        const collateralsVakuuslaskuriTableRows = vakuuslaskuriRows.map(
          (row, index) => ({
            id: `vakuuslaskuri-row-${row.kohteenTunnus}-${index}`,
            kohteenTunnus: row.kohteenTunnus,
            hallintamuoto: row.hallintamuoto || "-",
            km2: row.km2 || "-",
            hintaero: row.hintaero,
            sopimussakko: row.sopimussakko,
            kerroin: row.kerroin,
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
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "vakuustarvekerroin", headerName: "Vakuustarvekerroin" },
        ];

        const collateralsInfoRows = [
          {
            id: "info-1",
            sopimussakko: "0 € / k-m² - 500 € / k-m²",
            vakuustarvekerroin: "100 %",
          },
          {
            id: "info-2",
            sopimussakko: "501 € / k-m² - 1000 € / k-m²",
            vakuustarvekerroin: "80 %",
          },
          {
            id: "info-3",
            sopimussakko: "1001 € / k-m² - 1500 € / k-m²",
            vakuustarvekerroin: "70 %",
          },
          {
            id: "info-4",
            sopimussakko: "1501 € / k-m² -",
            vakuustarvekerroin: "60 %",
          },
        ];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">VAKUUSTARVE</h2>

              <Fieldset
                heading="Vakuuslaskuri"
                className="landuse-detail__fieldset--with-margin"
              >
                <Field name="korotuskerroin">
                  {({ input }) => (
                    <div className="landuse-detail__collaterals-increase-factor-field">
                      {isEditMode ? (
                        <NumberInput
                          id="collaterals-korotuskerroin"
                          label="Korotuskerroin"
                          min={1}
                          max={2}
                          step={0.05}
                          value={input.value}
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="collaterals-korotuskerroin"
                          label="Korotuskerroin"
                          value={
                            input.value !== undefined && input.value !== ""
                              ? formatLandUseNumericValue(Number(input.value))
                              : "-"
                          }
                          readOnly
                        />
                      )}
                    </div>
                  )}
                </Field>

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

              <Fieldset
                heading="Kokonaisvakuustarve"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__grid landuse-detail__monitoring-collateral-grid">
                  <TextInput
                    id="collaterals-sopimuksen-mukainen"
                    label="Sopimuksen mukainen"
                    value={formatLandUseEuroValue(sopimuksenMukainenValue)}
                    readOnly
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

                  <TextInput
                    id="collaterals-saantelyn-mukainen"
                    label="Sääntelyn mukainen"
                    value={formatLandUseEuroValue(saantelynMukainenValue)}
                    readOnly
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
                <Notification
                  type="info"
                  position="inline"
                  label="Vakuustarvekertoimen määräytyminen"
                >
                  <div className="landuse-detail__monitoring-info-layout">
                    <p>
                      Korotettu vakuustarve määräytyy sopimussakon mukaisesti
                      alla olevien rajojen mukaan.
                    </p>
                    <Table
                      className="landuse-detail__table landuse-detail__monitoring-info-table"
                      cols={collateralsInfoCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={collateralsInfoRows}
                      variant="light"
                    />
                  </div>
                </Notification>
              </Fieldset>
            </div>
          </form>
        );
      }}
    />
  );
};
