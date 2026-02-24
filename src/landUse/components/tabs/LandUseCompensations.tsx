import React from "react";
import {
  Button,
  ButtonVariant,
  Checkbox,
  Fieldset,
  IconCopy,
  IconPlusCircleFill,
  TextArea,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { LandUseSiteTreeNode } from "./LandUseSites";
import { collectLeafNodes } from "../../utils/siteTree";

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
  perushinta: boolean;
  muutos: boolean;
}

export interface LandUseCompensationsFormValues {
  rahakorvaus: string;
  maakorvaus: string;
  muuKorvaus: string;
  maakorvausSelite: string;
  muuSelite: string;
  perustietotaulukkoRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  yleisetAlueetNeliot: string;
  yleisetAlueetHankinnanArvo: string;
}

interface LandUseCompensationsProps {
  form: FormApi<LandUseCompensationsFormValues>;
  isEditMode: boolean;
  sites: LandUseSiteTreeNode[];
}

const parseNumber = (value: string | number | undefined): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatInteger = (value: number): string => {
  return value.toLocaleString("fi-FI", {
    maximumFractionDigits: 0,
  });
};

const getRowFieldPath = (
  siteId: string,
  field: keyof PerustietotaulukkoRowValues,
): string => `perustietotaulukkoRowsBySiteId.${siteId}.${field}`;

export const LandUseCompensations: React.FC<LandUseCompensationsProps> = ({
  form,
  isEditMode,
  sites,
}) => {
  const leafSites = collectLeafNodes(sites);

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

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">KORVAUKSET</h2>

              <Fieldset
                heading="Maankäyttökorvaus"
                className="landuse-detail__fieldset--with-margin"
              >
                <h3 className="landuse-detail__subsection-title">
                  Korvauksen määrä
                </h3>
                <div className="landuse-detail__grid landuse-detail__compensation-grid">
                  <Field name="rahakorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-rahakorvaus"
                        label="Rahakorvaus"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="maakorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-maakorvaus"
                        label="Maakorvaus"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="muuKorvaus">
                    {({ input }) => (
                      <TextInput
                        id="landuse-compensations-muu-korvaus"
                        label="Muu"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <TextInput
                    id="landuse-compensations-yhteensa"
                    label="Yhteensä"
                    value={`${formatCurrency(yhteensa)} €`}
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
                heading="Perustietotaulukko"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__compensations-table-header-actions">
                  <Button
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconCopy />}
                  >
                    Kopioi taulukon tiedot
                  </Button>
                </div>

                <div className="landuse-detail__sites-table-wrapper">
                  {leafSites.length > 0 ? (
                    <table className="landuse-detail__sites-table landuse-detail__compensations-table">
                      <thead>
                        <tr>
                          <th>Kohteen tunnus</th>
                          <th>Käyttötarkoitus</th>
                          <th>Hallintamuoto</th>
                          <th>Suojeltu</th>
                          <th>Pinta-ala m²</th>
                          <th>k-m²</th>
                          <th>Yksikköhinta</th>
                          <th>Summa</th>
                          <th>Perushinta</th>
                          <th>Muutos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leafSites.map((site) => {
                          const row = rowsBySiteId[site.id];
                          const rowSumma =
                            parseNumber(site.km2) *
                            parseNumber(row?.yksikkohinta);

                          return (
                            <tr key={site.id}>
                              <td>{site.kohteenTunnus || "-"}</td>
                              <td>{site.kayttotarkoitus || "-"}</td>
                              <td>{site.hallintamuoto || "-"}</td>
                              <td>{site.suojeltu || "-"}</td>
                              <td>{site.pintaAlaM2 || "-"}</td>
                              <td>{site.km2 || "-"}</td>
                              <td>
                                <Field
                                  name={getRowFieldPath(
                                    site.id,
                                    "yksikkohinta",
                                  )}
                                >
                                  {({ input }) => (
                                    <TextInput
                                      id={`landuse-compensations-yksikkohinta-${site.id}`}
                                      label=""
                                      hideLabel
                                      value={input.value ?? ""}
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </td>
                              <td>{`${formatCurrency(rowSumma)} €`}</td>
                              <td>
                                <Field
                                  name={getRowFieldPath(site.id, "perushinta")}
                                  type="checkbox"
                                >
                                  {({ input }) => (
                                    <Checkbox
                                      id={`landuse-compensations-perushinta-${site.id}`}
                                      label=""
                                      name={input.name}
                                      checked={Boolean(input.checked)}
                                      onChange={input.onChange}
                                      onBlur={input.onBlur}
                                      onFocus={input.onFocus}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </td>
                              <td>
                                <Field
                                  name={getRowFieldPath(site.id, "muutos")}
                                  type="checkbox"
                                >
                                  {({ input }) => (
                                    <Checkbox
                                      id={`landuse-compensations-muutos-${site.id}`}
                                      label=""
                                      name={input.name}
                                      checked={Boolean(input.checked)}
                                      onChange={input.onChange}
                                      onBlur={input.onBlur}
                                      onFocus={input.onFocus}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Yhteensä</th>
                          <th colSpan={3} />
                          <th>{formatInteger(totals.pintaAlaM2)}</th>
                          <th>{formatInteger(totals.km2)}</th>
                          <th />
                          <th>{`${formatCurrency(totals.summa)} €`}</th>
                          <th colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
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
                        value={input.value ?? ""}
                        onChange={input.onChange}
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
