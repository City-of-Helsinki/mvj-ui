import React from "react";
import {
  Button,
  ButtonVariant,
  Dialog,
  Fieldset,
  IconPlusCircleFill,
  IconTrash,
  NumberInput,
  Notification,
  Select,
  Table,
  TextArea,
  TextInput,
  ToggleButton,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { normalizeSelectValue } from "../../fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import {
  formatLandUseEuroValue,
  formatLandUseIntegerValue,
  parseLandUseNumericValueOrZero,
} from "../../utils/number";

export interface LandUseSite {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  km2?: string;
  kayttotarkoitus: string | undefined;
  hallintamuoto: string[] | undefined;
  suojeltu: string | undefined;
  amVelvoite: boolean;
}

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

export interface LandUseCompensationsFormValues {
  sites: LandUseSite[];
  rahakorvaus: string;
  maakorvaus: string;
  muuKorvaus: string;
  perushinta: string;
  vertailunPeruskerroin?: number;
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
}

const parseNumber = (value: string | number | undefined): number =>
  parseLandUseNumericValueOrZero(value);

const getRowFieldPath = (
  siteId: string,
  field: keyof PerustietotaulukkoRowValues,
): string => `perustietotaulukkoRowsBySiteId.${siteId}.${field}`;

const createEstateMapLink = (kohteenTunnus: string): string =>
  `https://kartta.hel.fi/?RegFormEstate=${encodeURIComponent(kohteenTunnus)}`;

const kayttotarkoitusOptions =
  landUseCompensationSelectOptions.kayttotarkoitus.map((value) => ({
    label: value,
    value,
  }));

const hallintamuotoOptions = landUseCompensationSelectOptions.hallintamuoto.map(
  (value) => ({
    label: value,
    value,
  }),
);

const suojeltuOptions = landUseCompensationSelectOptions.suojeltu.map(
  (value) => ({
    label: value,
    value,
  }),
);

type SelectOption = { label: string; value: string };

const handleSelectChange = (
  selectedOptions: SelectOption[],
  callback: (value: string | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  } else {
    callback(undefined);
  }
};

const normalizeMultiSelectValue = (
  value: string[] | string | undefined,
): SelectOption[] => {
  if (Array.isArray(value)) {
    return value.map((optionValue) => ({
      label: optionValue,
      value: optionValue,
    }));
  }

  if (typeof value === "string" && value !== "") {
    return [{ label: value, value }];
  }

  return [];
};

const handleMultiSelectChange = (
  selectedOptions: SelectOption[],
  callback: (value: string[] | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions.map((option) => option.value));
  } else {
    callback(undefined);
  }
};

const createUniqueSiteId = (sites: LandUseSite[]): string => {
  const usedIds = new Set(sites.map((site) => site.id));
  let index = 1;

  while (usedIds.has(`site-${index}`)) {
    index += 1;
  }

  return `site-${index}`;
};

export const LandUseCompensations: React.FC<LandUseCompensationsProps> = ({
  form,
  isEditMode,
  isDecisionPhase,
}) => {
  const isCompensationsTableReadOnly = !isEditMode || isDecisionPhase;
  const [isAddSiteDialogOpen, setIsAddSiteDialogOpen] = React.useState(false);
  const [newKohteenTunnus, setNewKohteenTunnus] = React.useState("");

  const resetAddSiteDialog = React.useCallback(() => {
    setIsAddSiteDialogOpen(false);
    setNewKohteenTunnus("");
  }, []);

  return (
    <Form<LandUseCompensationsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const sites = values.sites ?? [];
        const rowsBySiteId = values.perustietotaulukkoRowsBySiteId ?? {};
        const rahakorvaus = parseNumber(values.rahakorvaus);
        const maakorvaus = parseNumber(values.maakorvaus);
        const muuKorvaus = parseNumber(values.muuKorvaus);
        const yhteensa = rahakorvaus + maakorvaus + muuKorvaus;

        const handleAddSite = () => {
          if (isCompensationsTableReadOnly) {
            return;
          }

          const kohteenTunnus = newKohteenTunnus.trim();
          if (!kohteenTunnus) {
            return;
          }

          const newSite: LandUseSite = {
            id: createUniqueSiteId(sites),
            kohteenTunnus,
            pintaAlaM2: "",
            km2: "",
            kayttotarkoitus: undefined,
            hallintamuoto: [],
            suojeltu: undefined,
            amVelvoite: false,
          };
          form.change("sites", [...sites, newSite]);
          resetAddSiteDialog();
        };

        const handleRemoveSite = (siteId: string) => {
          if (isCompensationsTableReadOnly) {
            return;
          }

          form.change(
            "sites",
            sites.filter((site) => site.id !== siteId),
          );
        };

        const compensationsTableCols = [
          { key: "kohteenTunnus", headerName: "Kohde" },
          { key: "kayttotarkoitus", headerName: "Käyttötarkoitus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "suojeltu", headerName: "Suojeltu" },
          { key: "pintaAlaM2", headerName: "Pinta-ala m²" },
          { key: "km2", headerName: "k-m²" },
          { key: "yksikkohinta", headerName: "Yksikköhinta €" },
          { key: "summa", headerName: "Summa €" },
          { key: "amVelvoite", headerName: "AM-velvoite" },
          ...(isEditMode
            ? [{ key: "toiminnot", headerName: "Toiminnot" }]
            : []),
        ];

        const totals = sites.reduce(
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

        const compensationsTableRows = sites.map((site, index) => {
          const row = rowsBySiteId[site.id];
          const rowSumma =
            parseNumber(site.km2) * parseNumber(row?.yksikkohinta);

          return {
            id: site.id,
            kohteenTunnus: site.kohteenTunnus ? (
              <a
                href={createEstateMapLink(site.kohteenTunnus)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.kohteenTunnus}
              </a>
            ) : (
              "-"
            ),
            kayttotarkoitus: (
              <Field name={`sites.${index}.kayttotarkoitus`}>
                {({ input }) => (
                  <Select
                    id={`landuse-compensations-kayttotarkoitus-${site.id}`}
                    options={kayttotarkoitusOptions}
                    value={normalizeSelectValue(input.value)}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, input.onChange)
                    }
                    disabled={isCompensationsTableReadOnly}
                    texts={{ label: "", placeholder: "Valitse" }}
                  />
                )}
              </Field>
            ),
            hallintamuoto: (
              <Field name={`sites.${index}.hallintamuoto`}>
                {({ input }) => (
                  <Select
                    id={`landuse-compensations-hallintamuoto-${site.id}`}
                    options={hallintamuotoOptions}
                    value={normalizeMultiSelectValue(input.value)}
                    onChange={(selectedOptions) =>
                      handleMultiSelectChange(selectedOptions, input.onChange)
                    }
                    multiSelect
                    disabled={isCompensationsTableReadOnly}
                    texts={{ label: "", placeholder: "Valitse" }}
                  />
                )}
              </Field>
            ),
            suojeltu: (
              <Field name={`sites.${index}.suojeltu`}>
                {({ input }) => (
                  <Select
                    id={`landuse-compensations-suojeltu-${site.id}`}
                    options={suojeltuOptions}
                    value={normalizeSelectValue(input.value)}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, input.onChange)
                    }
                    disabled={isCompensationsTableReadOnly}
                    texts={{ label: "", placeholder: "Valitse" }}
                  />
                )}
              </Field>
            ),
            pintaAlaM2: (
              <Field name={`sites.${index}.pintaAlaM2`}>
                {({ input }) => (
                  <TextInput
                    id={`landuse-compensations-pinta-ala-${site.id}`}
                    label=""
                    value={input.value ?? ""}
                    onChange={input.onChange}
                    disabled={isCompensationsTableReadOnly}
                  />
                )}
              </Field>
            ),
            km2: (
              <Field name={`sites.${index}.km2`}>
                {({ input }) => (
                  <TextInput
                    id={`landuse-compensations-km2-${site.id}`}
                    label=""
                    value={input.value ?? ""}
                    onChange={input.onChange}
                    disabled={isCompensationsTableReadOnly}
                  />
                )}
              </Field>
            ),
            yksikkohinta: (
              <Field name={getRowFieldPath(site.id, "yksikkohinta")}>
                {({ input }) => (
                  <NumberInput
                    id={`landuse-compensations-yksikkohinta-${site.id}`}
                    label=""
                    hideLabel
                    value={input.value}
                    unit="€"
                    onChange={input.onChange}
                    disabled={isCompensationsTableReadOnly}
                  />
                )}
              </Field>
            ),
            summa: formatLandUseEuroValue(rowSumma),
            amVelvoite: (
              <Field name={`sites.${index}.amVelvoite`}>
                {({ input }) => (
                  <ToggleButton
                    id={`landuse-compensations-amvelvoite-${site.id}`}
                    label="AM-velvoite"
                    checked={Boolean(input.value)}
                    onChange={() => input.onChange(!input.value)}
                    disabled={isCompensationsTableReadOnly}
                  />
                )}
              </Field>
            ),
            ...(isEditMode
              ? {
                  toiminnot: (
                    <Button
                      type="button"
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconTrash />}
                      disabled={isCompensationsTableReadOnly}
                      onClick={() => handleRemoveSite(site.id)}
                    >
                      Poista
                    </Button>
                  ),
                }
              : {}),
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
            amVelvoite: "",
            ...(isEditMode ? { toiminnot: "" } : {}),
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
                      <NumberInput
                        id="landuse-compensations-rahakorvaus"
                        label="Rahakorvaus"
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="maakorvaus">
                    {({ input }) => (
                      <NumberInput
                        id="landuse-compensations-maakorvaus"
                        label="Maakorvaus"
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="muuKorvaus">
                    {({ input }) => (
                      <NumberInput
                        id="landuse-compensations-muu-korvaus"
                        label="Muu"
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <NumberInput
                    id="landuse-compensations-yhteensa"
                    label="Yhteensä"
                    value={yhteensa}
                    unit="€"
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
                  type="button"
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
                      <NumberInput
                        id="landuse-compensations-perushinta"
                        label="Perushinta"
                        value={input.value}
                        unit="€/kem²"
                        onChange={input.onChange}
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
                  {sites.length > 0 ? (
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
                  <div>
                    <Button
                      type="button"
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconPlusCircleFill />}
                      disabled={isCompensationsTableReadOnly}
                      onClick={() => setIsAddSiteDialogOpen(true)}
                    >
                      Lisää kohde
                    </Button>
                  </div>
                </div>
              </Fieldset>

              <Fieldset heading="Korvauksetta luovutettavat yleiset alueet">
                <div className="landuse-detail__grid landuse-detail__compensation-grid">
                  <Field name="yleisetAlueetNeliot">
                    {({ input }) => (
                      <NumberInput
                        id="landuse-compensations-yleiset-alueet-neliot"
                        label="Neliöt"
                        value={input.value}
                        unit="m²"
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>

                  <Field name="yleisetAlueetHankinnanArvo">
                    {({ input }) => (
                      <NumberInput
                        id="landuse-compensations-yleiset-alueet-hankinnan-arvo"
                        label="Hankinnan arvo eur"
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </Fieldset>

              <Dialog
                id="landuse-compensations-add-site-dialog"
                isOpen={isAddSiteDialogOpen}
                aria-labelledby="landuse-compensations-add-site-dialog-title"
                closeButtonLabelText="Sulje"
                close={resetAddSiteDialog}
              >
                <Dialog.Header
                  id="landuse-compensations-add-site-dialog-title"
                  title="Lisää kohde"
                />
                <Dialog.Content>
                  <TextInput
                    id="landuse-compensations-new-kohteen-tunnus"
                    label="Kohteen tunnus"
                    value={newKohteenTunnus}
                    onChange={(event) =>
                      setNewKohteenTunnus(event.target.value)
                    }
                    required
                  />
                </Dialog.Content>
                <Dialog.ActionButtons>
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    onClick={resetAddSiteDialog}
                  >
                    Peruuta
                  </Button>
                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    onClick={handleAddSite}
                    disabled={
                      isCompensationsTableReadOnly || !newKohteenTunnus.trim()
                    }
                  >
                    Lisää kohde
                  </Button>
                </Dialog.ActionButtons>
              </Dialog>
            </div>
          </form>
        );
      }}
    />
  );
};

export default LandUseCompensations;
