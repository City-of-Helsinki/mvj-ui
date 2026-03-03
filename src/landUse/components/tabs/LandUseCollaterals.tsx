import React from "react";
import {
  Button,
  ButtonVariant,
  Fieldset,
  IconCopy,
  Notification,
  Table,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { LandUseSiteTreeNode } from "./LandUseSites";
import { collectLeafNodes } from "../../utils/siteTree";
import { parseLandUseNumericValue } from "../../utils/number";

export interface LandUseCollateralsFormValues {
  sopimuksenMukainen?: string;
  rahakorvaus?: string;
}

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

interface CollateralsVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  km2: string;
  hintaero: string;
  kerroin: string;
  vakuustarve: string;
  vakuudet: string;
}

interface CollateralsGuarantee {
  jarjestysnumero: string;
  vakuudenMaara: string;
  vakuuttaJaljella: string;
}

interface CollateralsAgreement {
  sopimusnumero: string;
  vakuudet?: CollateralsGuarantee[];
}

interface LandUseCollateralsProps {
  form: FormApi<LandUseCollateralsFormValues>;
  isEditMode: boolean;
  sites: LandUseSiteTreeNode[];
  compensationsRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  agreements: CollateralsAgreement[];
}

const formatEuroValue = (value: number): string =>
  `${value.toLocaleString("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;

const formatNumericValue = (value: number): string =>
  value.toLocaleString("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const getKerroinPercent = (hintaero: number): number => {
  if (hintaero <= 500) {
    return 100;
  }

  if (hintaero <= 1000) {
    return 80;
  }

  if (hintaero <= 1500) {
    return 70;
  }

  return 60;
};

export const LandUseCollaterals: React.FC<LandUseCollateralsProps> = ({
  form,
  isEditMode,
  sites,
  compensationsRowsBySiteId,
  agreements,
}) => {
  const leafSites = collectLeafNodes(sites);

  return (
    <Form<LandUseCollateralsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const vakuuslaskuriRows: CollateralsVakuuslaskuriRow[] = leafSites.map(
          (site) => {
            const kohteenTunnus = site.kohteenTunnus || "-";
            const vaadittuValue = parseLandUseNumericValue(site.km2);
            const hintaeroValue = parseLandUseNumericValue(
              compensationsRowsBySiteId[site.id]?.yksikkohinta,
            );
            const kerroinPercent =
              hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;

            const vakuustarveValue =
              vaadittuValue !== null &&
              hintaeroValue !== null &&
              kerroinPercent !== null
                ? vaadittuValue * hintaeroValue * (kerroinPercent / 100)
                : null;

            return {
              kohteenTunnus,
              hallintamuoto: site.hallintamuoto || "-",
              km2: site.km2 || "-",
              hintaero:
                hintaeroValue !== null
                  ? formatNumericValue(hintaeroValue)
                  : "-",
              kerroin: kerroinPercent !== null ? `${kerroinPercent} %` : "-",
              vakuustarve:
                vakuustarveValue !== null
                  ? formatEuroValue(vakuustarveValue)
                  : "-",
              vakuudet: "-",
            };
          },
        );

        const collateralsVakuuslaskuriCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "km2", headerName: "k-m²" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "kerroin", headerName: "Kerroin" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
          { key: "vakuudet", headerName: "Vakuudet" },
        ];

        const collateralsVakuuslaskuriTableRows = vakuuslaskuriRows.map(
          (row, index) => ({
            id: `vakuuslaskuri-row-${row.kohteenTunnus}-${index}`,
            kohteenTunnus: row.kohteenTunnus,
            hallintamuoto: row.hallintamuoto || "-",
            km2: row.km2 || "-",
            hintaero: row.hintaero,
            kerroin: row.kerroin,
            vakuustarve: row.vakuustarve,
            vakuudet: row.vakuudet,
          }),
        );

        const collateralsInfoCols = [
          { key: "hintaero", headerName: "Hintaero" },
          { key: "vakuustarvekerroin", headerName: "Vakuustarvekerroin" },
        ];

        const collateralsInfoRows = [
          {
            id: "info-1",
            hintaero: "0 € / k-m² - 500 € / k-m²",
            vakuustarvekerroin: "100 %",
          },
          {
            id: "info-2",
            hintaero: "501 € / k-m² - 1000 € / k-m²",
            vakuustarvekerroin: "80 %",
          },
          {
            id: "info-3",
            hintaero: "1001 € / k-m² - 1500 € / k-m²",
            vakuustarvekerroin: "70 %",
          },
          {
            id: "info-4",
            hintaero: "1501 € / k-m² -",
            vakuustarvekerroin: "60 %",
          },
        ];

        const collateralsGuaranteesCols = [
          { key: "sopimusnumero", headerName: "Sopimusnumero" },
          { key: "jarjestysnumero", headerName: "Vakuuden järjestysnumero" },
          { key: "vakuudenMaara", headerName: "Vakuuden määrä" },
          { key: "vakuuttaJaljella", headerName: "Vakuutta jäljellä" },
        ];

        const collateralsGuaranteesRows = agreements.flatMap(
          (agreement, agreementIndex) =>
            (agreement.vakuudet ?? []).map((guarantee, guaranteeIndex) => ({
              id: `vakuus-row-${agreementIndex}-${guaranteeIndex}`,
              sopimusnumero: agreement.sopimusnumero || "-",
              jarjestysnumero: guarantee.jarjestysnumero || "-",
              vakuudenMaara: guarantee.vakuudenMaara || "-",
              vakuuttaJaljella: guarantee.vakuuttaJaljella || "-",
            })),
        );

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">VAKUUDET</h2>

              <Fieldset
                heading="Vakuuslaskuri"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__monitoring-table-toolbar">
                  <Button
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconCopy />}
                    disabled={!isEditMode}
                  >
                    Hae taulukon tiedot
                  </Button>
                  <Button
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconCopy />}
                    disabled={!isEditMode}
                  >
                    Kopioi taulukon tiedot
                  </Button>
                </div>

                <div className="landuse-detail__sites-table-wrapper">
                  <Table
                    className="landuse-detail__sites-table landuse-detail__monitoring-table"
                    cols={collateralsVakuuslaskuriCols}
                    indexKey="id"
                    renderIndexCol={false}
                    rows={collateralsVakuuslaskuriTableRows}
                    variant="light"
                  />
                </div>
              </Fieldset>

              <Fieldset
                heading="Jäljellä oleva vakuustarve"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__grid landuse-detail__monitoring-remaining-grid">
                  <Field name="sopimuksenMukainen">
                    {({ input }) => (
                      <TextInput
                        id="collaterals-sopimuksen-mukainen"
                        label="Sopimuksen mukainen"
                        value={
                          input.value ?? values.sopimuksenMukainen ?? "0 €"
                        }
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="rahakorvaus">
                    {({ input }) => (
                      <TextInput
                        id="collaterals-raha-korvaus"
                        label="Rahakorvaus"
                        value={input.value ?? values.rahakorvaus ?? "10 000 €"}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
                <Notification type="info" position="inline" label="Info">
                  <div className="landuse-detail__monitoring-info-layout">
                    <p>
                      Korotettu vakuustarve määräytyy hintaeron mukaisesti alla
                      olevien rajojen mukaan.
                    </p>
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-info-table"
                      cols={collateralsInfoCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={collateralsInfoRows}
                      variant="light"
                    />
                  </div>
                </Notification>
              </Fieldset>

              <Fieldset heading="Vakuudet">
                <div className="landuse-detail__sites-table-wrapper">
                  <Table
                    className="landuse-detail__sites-table landuse-detail__monitoring-table"
                    cols={collateralsGuaranteesCols}
                    indexKey="id"
                    renderIndexCol={false}
                    rows={collateralsGuaranteesRows}
                    variant="light"
                  />
                </div>
              </Fieldset>
            </div>
          </form>
        );
      }}
    />
  );
};
