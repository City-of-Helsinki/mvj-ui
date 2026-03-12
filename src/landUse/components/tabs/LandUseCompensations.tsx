import React from "react";
import {
  Button,
  ButtonVariant,
  Fieldset,
  IconCopy,
  IconPlusCircleFill,
  Notification,
  Table,
  TextArea,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { LandUseSiteTreeNode } from "./LandUseSites";
import { collectLeafNodes } from "../../utils/siteTree";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseEuroValue,
  formatLandUseIntegerValue,
  formatLandUseNumericValue,
  parseLandUseNumericValueOrZero,
} from "../../utils/number";

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

export interface LandUseCompensationsFormValues {
  rahakorvaus: string;
  maakorvaus: string;
  muuKorvaus: string;
  perushinta: string;
  maakorvausSelite: string;
  muuSelite: string;
  perustietotaulukkoRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  yleisetAlueetNeliot: string;
  yleisetAlueetHankinnanArvo: string;
}

interface LandUseCompensationsProps {
  form: FormApi<LandUseCompensationsFormValues>;
  isEditMode: boolean;
  isDecisionPhase: boolean;
  sites: LandUseSiteTreeNode[];
}

const parseNumber = (value: string | number | undefined): number =>
  parseLandUseNumericValueOrZero(value);

const hasDigits = (value: string | number | undefined): boolean => {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  return /\d/.test(value);
};

const formatCurrencyFieldValue = (
  value: string | number | undefined,
): string => {
  if (!hasDigits(value)) {
    return "";
  }

  return formatLandUseEuroDisplayValue(value);
};

const formatEditableMoneyFieldValue = (
  value: string | number | undefined,
): string => {
  if (!hasDigits(value)) {
    return "";
  }

  return formatLandUseNumericValue(parseNumber(value));
};

const getRowFieldPath = (
  siteId: string,
  field: keyof PerustietotaulukkoRowValues,
): string => `perustietotaulukkoRowsBySiteId.${siteId}.${field}`;

const createEstateMapLink = (kohteenTunnus: string): string =>
  `https://kartta.hel.fi/?RegFormEstate=${encodeURIComponent(kohteenTunnus)}`;

export const LandUseCompensations: React.FC<LandUseCompensationsProps> = ({
  form,
  isEditMode,
  isDecisionPhase,
  sites,
}) => {
  const leafSites = collectLeafNodes(sites);
  const isCompensationsTableReadOnly = !isEditMode || isDecisionPhase;

  return (
    <Form<LandUseCompensationsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const rowsBySiteId = values.perustietotaulukkoRowsBySiteId ?? {};
        const rahakorvaus = parseNumber(values.rahakorvaus);
        const maakorvaus = parseNumber(values.maakorvaus);
        const muuKorvaus = parseNumber(values.muuKorvaus);
        const yhteensa = rahakorvaus + maakorvaus + muuKorvaus;

        const compensationsTableCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "kayttotarkoitus", headerName: "Käyttötarkoitus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "suojeltu", headerName: "Suojeltu" },
          { key: "pintaAlaM2", headerName: "Pinta-ala m²" },
          { key: "km2", headerName: "k-m²" },
          { key: "yksikkohinta", headerName: "Yksikköhinta" },
          { key: "summa", headerName: "Summa" },
        ];

        const totals = leafSites.reduce(
          (accumulator, site) => {
            const row = rowsBySiteId[site.id];
            const pintaAla = parseNumber(site.pintaAlaM2);
            const kerrosAla = parseNumber(site.km2);
            const yksikkohinta = parseNumber(row?.yksikkohinta);

            return {
              pintaAlaM2: accumulator.pintaAlaM2 + pintaAla,
              km2: accumulator.km2 + kerrosAla,
              summa: accumulator.summa + kerrosAla * yksikkohinta,
            };
          },
          { pintaAlaM2: 0, km2: 0, summa: 0 },
        );

        const compensationsTableRows = leafSites.map((site) => {
          const row = rowsBySiteId[site.id];
          const rowSumma =
            parseNumber(site.km2) * parseNumber(row?.yksikkohinta);

          return {
            id: site.id,
            kohteenTunnus: site.kohteenTunnus ? (
              <a
                href={createEstateMapLink(site.kohteenTunnus)}
                target="_blank"
                rel="noreferrer"
              >
                {site.kohteenTunnus}
              </a>
            ) : (
              "-"
            ),
            kayttotarkoitus: site.kayttotarkoitus || "-",
            hallintamuoto: site.hallintamuoto || "-",
            suojeltu: site.suojeltu || "-",
            pintaAlaM2: site.pintaAlaM2 || "-",
            km2: site.km2 || "-",
            yksikkohinta: (
              <Field name={getRowFieldPath(site.id, "yksikkohinta")}>
                {({ input }) => (
                  <TextInput
                    id={`landuse-compensations-yksikkohinta-${site.id}`}
                    label=""
                    hideLabel
                    value={
                      isCompensationsTableReadOnly
                        ? formatCurrencyFieldValue(input.value)
                        : (input.value ?? "")
                    }
                    onChange={input.onChange}
                    onBlur={(event) => {
                      input.onBlur(event);
                      input.onChange(
                        formatEditableMoneyFieldValue(input.value),
                      );
                    }}
                    disabled={isCompensationsTableReadOnly}
                  />
                )}
              </Field>
            ),
            summa: formatLandUseEuroValue(rowSumma),
          };
        });

        const compensationsTableRowsWithTotals = [
          ...compensationsTableRows,
          {
            id: "totals-row",
            kohteenTunnus: <strong>Yhteensä</strong>,
            kayttotarkoitus: "",
            hallintamuoto: "",
            suojeltu: "",
            pintaAlaM2: formatLandUseIntegerValue(totals.pintaAlaM2),
            km2: formatLandUseIntegerValue(totals.km2),
            yksikkohinta: "",
            summa: formatLandUseEuroValue(totals.summa),
          },
        ];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">KORVAUKSET</h2>

              <Fieldset
                heading="Maankäyttökorvaus"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__grid landuse-detail__compensation-grid">
                  <Field name="rahakorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-rahakorvaus"
                        label="Rahakorvaus"
                        value={
                          isEditMode
                            ? (input.value ?? "")
                            : formatCurrencyFieldValue(input.value)
                        }
                        onChange={input.onChange}
                        onBlur={(event) => {
                          input.onBlur(event);
                          input.onChange(
                            formatEditableMoneyFieldValue(input.value),
                          );
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="maakorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-maakorvaus"
                        label="Maakorvaus"
                        value={
                          isEditMode
                            ? (input.value ?? "")
                            : formatCurrencyFieldValue(input.value)
                        }
                        onChange={input.onChange}
                        onBlur={(event) => {
                          input.onBlur(event);
                          input.onChange(
                            formatEditableMoneyFieldValue(input.value),
                          );
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="muuKorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-muu-korvaus"
                        label="Muu"
                        value={
                          isEditMode
                            ? (input.value ?? "")
                            : formatCurrencyFieldValue(input.value)
                        }
                        onChange={input.onChange}
                        onBlur={(event) => {
                          input.onBlur(event);
                          input.onChange(
                            formatEditableMoneyFieldValue(input.value),
                          );
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <TextInput
                    id="landuse-compensations-yhteensa"
                    label="Yhteensä"
                    value={formatLandUseEuroValue(yhteensa)}
                    readOnly
                    disabled
                  />
                </div>

                <div className="landuse-detail__grid landuse-detail__compensation-grid landuse-detail__compensation-grid--notes">
                  <Field name="maakorvausSelite">
                    {({ input }) => (
                      <TextArea
                        id="landuse-compensations-maakorvaus-selite"
                        label="Maakorvaus selite"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="muuSelite">
                    {({ input }) => (
                      <TextArea
                        id="landuse-compensations-muu-selite"
                        label="Muu selite"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>

              <Fieldset
                heading="Maankäyttökorvauksen laskelma"
                className="landuse-detail__fieldset--with-margin"
              >
                <Button
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconPlusCircleFill />}
                  disabled={!isEditMode}
                >
                  Lisää tiedosto
                </Button>
              </Fieldset>

              <Fieldset
                heading="Perushinta"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__grid landuse-detail__compensation-grid">
                  <Field name="perushinta">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-perushinta"
                        label="Perushinta"
                        value={
                          isEditMode
                            ? (input.value ?? "")
                            : formatCurrencyFieldValue(input.value)
                        }
                        onChange={input.onChange}
                        onBlur={(event) => {
                          input.onBlur(event);
                          input.onChange(
                            formatEditableMoneyFieldValue(input.value),
                          );
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>

              <Fieldset
                heading="Perustietotaulukko"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__sites-table-wrapper hds-table-container">
                  {isDecisionPhase && (
                    <Notification
                      type="info"
                      position="inline"
                      label="Info"
                      style={{ marginBottom: "var(--spacing-m)" }}
                    >
                      Taulukkoa ei voi muokata, kun sopimuksen tila on
                      &quot;Päätös&quot;
                    </Notification>
                  )}
                  <div className="landuse-detail__compensations-table-header-actions">
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconCopy />}
                    >
                      Kopioi taulukon tiedot
                    </Button>
                  </div>
                  {leafSites.length > 0 ? (
                    <Table
                      className="landuse-detail__sites-table landuse-detail__compensations-table"
                      cols={compensationsTableCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={compensationsTableRowsWithTotals}
                      variant="light"
                    />
                  ) : (
                    <p>Perustietotaulukkoon ei ole vielä kohteita.</p>
                  )}
                </div>
              </Fieldset>

              <Fieldset heading="Korvauksesta luovutettavat yleiset alueet">
                <div className="landuse-detail__grid landuse-detail__compensation-grid">
                  <Field name="yleisetAlueetNeliot">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-yleiset-alueet-neliot"
                        label="Neliöt"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="yleisetAlueetHankinnanArvo">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-yleiset-alueet-hankinnan-arvo"
                        label="Hankinnan arvo eur"
                        value={
                          isEditMode
                            ? (input.value ?? "")
                            : formatCurrencyFieldValue(input.value)
                        }
                        onChange={input.onChange}
                        onBlur={(event) => {
                          input.onBlur(event);
                          input.onChange(
                            formatEditableMoneyFieldValue(input.value),
                          );
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>
            </div>
          </form>
        );
      }}
    />
  );
};

export default LandUseCompensations;
