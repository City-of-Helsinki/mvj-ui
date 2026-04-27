import React from "react";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Fieldset,
  IconAngleDown,
  IconAngleUp,
  IconPlusCircleFill,
  IconSize,
  NumberInput,
  Notification,
  Select,
  TextArea,
  TextInput,
  ToggleButton,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import {
  formatLandUseEuroValue,
  formatLandUseIntegerValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
  parseNumber,
} from "../../utils/number";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";

export interface LandUseSite {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  kem2?: string;
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
  korotuskerroin?: number;
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

interface SiteRowProps {
  site: LandUseSite;
  siteIndex: number;
  rowValues: PerustietotaulukkoRowValues | undefined;
  isReadOnly: boolean;
  isEditMode: boolean;
  onRemove: (siteId: string) => void;
  onToggle: (siteId: string) => void;
  isOpen: boolean;
  colCount: number;
}

const SiteRow: React.FC<SiteRowProps> = ({
  site,
  siteIndex,
  rowValues,
  isReadOnly,
  onRemove,
  onToggle,
  isOpen,
  colCount,
}) => {
  const yksikkohinta = parseNumber(rowValues?.yksikkohinta);
  const pintaAlaM2 = parseNumber(site.pintaAlaM2);
  const kerrosala = parseNumber(site.kem2);
  const summa = kerrosala * yksikkohinta;

  return (
    <>
      <tr
        className="landuse-compensations-table__row"
        onClick={() => onToggle(site.id)}
      >
        <td className="landuse-compensations-table__toggle-cell">
          <button
            type="button"
            className="landuse-compensations-table__toggle-btn"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Sulje kohteen tiedot" : "Avaa kohteen tiedot"}
          >
            {isOpen ? (
              <IconAngleUp size={IconSize.Small} />
            ) : (
              <IconAngleDown size={IconSize.Small} />
            )}
          </button>
        </td>
        <td>
          {site.kohteenTunnus ? (
            <a
              href={createEstateMapLink(site.kohteenTunnus)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {site.kohteenTunnus}
            </a>
          ) : (
            "-"
          )}
        </td>
        <td>{site.kayttotarkoitus ?? "-"}</td>
        <td>
          {Array.isArray(site.hallintamuoto) && site.hallintamuoto.length > 0
            ? site.hallintamuoto.join(", ")
            : "-"}
        </td>
        <td>{site.suojeltu ?? "-"}</td>
        <td>{formatLandUseNumericValueWithUnit(pintaAlaM2, "m²")}</td>
        <td>{formatLandUseNumericValueWithUnit(kerrosala, "kem²")}</td>
        <td>{formatLandUseNumericValueWithUnit(yksikkohinta, "€/kem²")}</td>
        <td>{formatLandUseEuroValue(summa)}</td>
        <td>{site.amVelvoite ? "Kyllä" : "Ei"}</td>
      </tr>
      {isOpen && (
        <tr className="landuse-compensations-table__detail-row">
          <td colSpan={colCount}>
            <div
              className="landuse-compensations-table__detail-content"
              aria-label={`Kohteen ${site.kohteenTunnus} tiedot`}
            >
              <div className="landuse-grid landuse-compensations-table__detail-grid">
                <Field name={`sites.${siteIndex}.kohteenTunnus`}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-kohteen-tunnus-${site.id}`}
                        label="Kohteen tunnus"
                        value={readOnlyTextValue(input.value)}
                        readOnly
                      />
                    ) : (
                      <TextInput
                        id={`landuse-compensations-kohteen-tunnus-${site.id}`}
                        label="Kohteen tunnus"
                        value={input.value ?? ""}
                        onChange={input.onChange}
                      />
                    )
                  }
                </Field>

                <Field name={`sites.${siteIndex}.kayttotarkoitus`}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-kayttotarkoitus-${site.id}`}
                        label="Käyttötarkoitus"
                        value={readOnlyTextValue(input.value)}
                        readOnly
                      />
                    ) : (
                      <Select
                        id={`landuse-compensations-kayttotarkoitus-${site.id}`}
                        options={kayttotarkoitusOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "Käyttötarkoitus",
                          placeholder: "Valitse",
                        }}
                      />
                    )
                  }
                </Field>

                <Field name={`sites.${siteIndex}.hallintamuoto`}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-hallintamuoto-${site.id}`}
                        label="Hallintamuoto"
                        value={
                          Array.isArray(input.value) && input.value.length > 0
                            ? input.value.join(", ")
                            : "-"
                        }
                        readOnly
                      />
                    ) : (
                      <Select
                        id={`landuse-compensations-hallintamuoto-${site.id}`}
                        options={hallintamuotoOptions}
                        value={normalizeMultiSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleMultiSelectChange(
                            selectedOptions,
                            input.onChange,
                          )
                        }
                        multiSelect
                        texts={{
                          label: "Hallintamuoto",
                          placeholder: "Valitse",
                        }}
                      />
                    )
                  }
                </Field>

                <Field name={`sites.${siteIndex}.suojeltu`}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-suojeltu-${site.id}`}
                        label="Suojeltu"
                        value={readOnlyTextValue(input.value)}
                        readOnly
                      />
                    ) : (
                      <Select
                        id={`landuse-compensations-suojeltu-${site.id}`}
                        options={suojeltuOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "Suojeltu",
                          placeholder: "Valitse",
                        }}
                      />
                    )
                  }
                </Field>

                <Field name={`sites.${siteIndex}.pintaAlaM2`}>
                  {({ input }) => (
                    <TextInput
                      id={`landuse-compensations-pinta-ala-${site.id}`}
                      label="Pinta-ala (m²)"
                      value={getFieldTextValue(!isReadOnly, input.value)}
                      onChange={input.onChange}
                      readOnly={isReadOnly}
                    />
                  )}
                </Field>

                <Field name={`sites.${siteIndex}.kem2`}>
                  {({ input }) => (
                    <TextInput
                      id={`landuse-compensations-kem2-${site.id}`}
                      label="Kerrosala (kem²)"
                      value={getFieldTextValue(!isReadOnly, input.value)}
                      onChange={input.onChange}
                      readOnly={isReadOnly}
                    />
                  )}
                </Field>

                <Field name={getRowFieldPath(site.id, "yksikkohinta")}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-yksikkohinta-${site.id}`}
                        label="Yksikköhinta (€/kem²)"
                        value={readOnlyTextValue(input.value)}
                        readOnly
                      />
                    ) : (
                      <NumberInput
                        id={`landuse-compensations-yksikkohinta-${site.id}`}
                        label="Yksikköhinta"
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                      />
                    )
                  }
                </Field>

                <Field name={`sites.${siteIndex}.amVelvoite`}>
                  {({ input }) =>
                    isReadOnly ? (
                      <TextInput
                        id={`landuse-compensations-amvelvoite-${site.id}`}
                        label="AM-velvoite"
                        value={input.value ? "Kyllä" : "Ei"}
                        readOnly
                      />
                    ) : (
                      <ToggleButton
                        id={`landuse-compensations-amvelvoite-${site.id}`}
                        label="AM-velvoite"
                        checked={Boolean(input.value)}
                        onChange={() => input.onChange(!input.value)}
                      />
                    )
                  }
                </Field>
              </div>
              {!isReadOnly && (
                <div className="landuse-compensations-table__detail-actions">
                  <ConfirmDeleteButton
                    id={`compensations-site-delete-${site.id}`}
                    buttonLabel="Poista kohde"
                    buttonVariant={ButtonVariant.Danger}
                    buttonSize={ButtonSize.Small}
                    onConfirm={() => onRemove(site.id)}
                    dialogTitle="Poista kohde"
                    dialogContent={`Haluatko varmasti poistaa kohteen ${site.kohteenTunnus?.trim() ?? ""}?`}
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const LandUseCompensations: React.FC<LandUseCompensationsProps> = ({
  form,
  isEditMode,
  isDecisionPhase,
}) => {
  const isCompensationsTableReadOnly = !isEditMode || isDecisionPhase;
  const [openSiteId, setOpenSiteId] = React.useState<string | null>(null);

  return (
    <Form<LandUseCompensationsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const sites = values.sites ?? [];
        const rowsBySiteId = values.perustietotaulukkoRowsBySiteId ?? {};
        const yhteensa =
          (parseLandUseNumericValue(values.rahakorvaus) ?? 0) +
          (parseLandUseNumericValue(values.maakorvaus) ?? 0) +
          (parseLandUseNumericValue(values.muuKorvaus) ?? 0);

        const handleAddSite = () => {
          if (isCompensationsTableReadOnly) {
            return;
          }

          const id = createUniqueSiteId(sites);
          const newSite: LandUseSite = {
            id,
            kohteenTunnus: "",
            pintaAlaM2: "",
            kem2: "",
            kayttotarkoitus: undefined,
            hallintamuoto: [],
            suojeltu: undefined,
            amVelvoite: false,
          };
          form.change("sites", [...sites, newSite]);
          setOpenSiteId(id);
        };

        const handleRemoveSite = (siteId: string) => {
          if (isCompensationsTableReadOnly) {
            return;
          }

          form.change(
            "sites",
            sites.filter((site) => site.id !== siteId),
          );

          if (openSiteId === siteId) {
            setOpenSiteId(null);
          }
        };

        const handleToggleSite = (siteId: string) => {
          setOpenSiteId((currentOpenSiteId) =>
            currentOpenSiteId === siteId ? null : siteId,
          );
        };

        const totals = sites.reduce(
          (accumulator, site) => {
            const row = rowsBySiteId[site.id];
            const pintaAla = parseNumber(site.pintaAlaM2);
            const kerrosala = parseNumber(site.kem2);
            const yksikkohinta = parseNumber(row?.yksikkohinta);

            return {
              pintaAlaM2: accumulator.pintaAlaM2 + pintaAla,
              kem2: accumulator.kem2 + kerrosala,
              summa: accumulator.summa + kerrosala * yksikkohinta,
            };
          },
          { pintaAlaM2: 0, kem2: 0, summa: 0 },
        );

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">KORVAUKSET</h2>

              <Fieldset
                heading="Maankäyttökorvaus"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-grid landuse-detail__compensation-grid">
                  <Field name="rahakorvaus">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-rahakorvaus"
                          label="Rahakorvaus"
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-rahakorvaus"
                          label="Rahakorvaus"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>

                  <Field name="maakorvaus">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-maakorvaus"
                          label="Maakorvaus"
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-maakorvaus"
                          label="Maakorvaus"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>

                  <Field name="muuKorvaus">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-muu-korvaus"
                          label="Muu"
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-muu-korvaus"
                          label="Muu"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>

                  {isEditMode ? (
                    <NumberInput
                      id="landuse-compensations-yhteensa"
                      label="Yhteensä"
                      value={yhteensa || 0}
                      unit="€"
                      disabled
                    />
                  ) : (
                    <TextInput
                      id="landuse-compensations-yhteensa"
                      label="Yhteensä"
                      value={formatLandUseEuroValue(yhteensa)}
                      readOnly
                    />
                  )}
                </div>

                <div className="landuse-grid landuse-detail__compensation-grid landuse-detail__compensation-grid--notes">
                  <Field name="maakorvausSelite">
                    {({ input }) =>
                      isEditMode ? (
                        <TextArea
                          id="landuse-compensations-maakorvaus-selite"
                          label="Maakorvaus selite"
                          value={input.value ?? ""}
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-maakorvaus-selite"
                          label="Maakorvaus selite"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>

                  <Field name="muuSelite">
                    {({ input }) =>
                      isEditMode ? (
                        <TextArea
                          id="landuse-compensations-muu-selite"
                          label="Muu selite"
                          value={input.value ?? ""}
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-muu-selite"
                          label="Muu selite"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>
                </div>
              </Fieldset>

              <Fieldset
                heading="Maankäyttökorvauksen laskelma"
                className="landuse-detail__fieldset--with-margin"
              >
                {isEditMode && (
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                  >
                    Lisää tiedosto
                  </Button>
                )}
              </Fieldset>

              <Fieldset
                heading="Perushinta"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-grid landuse-detail__compensation-grid">
                  <Field name="perushinta">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-perushinta"
                          label="Perushinta"
                          value={input.value}
                          unit="€/kem²"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-perushinta"
                          label="Perushinta"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>
                </div>
              </Fieldset>

              <Fieldset
                heading="Perustietotaulukko"
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__sites-table-wrapper">
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
                  <table className="landuse-compensations-table">
                    <thead>
                      <tr>
                        <th className="landuse-compensations-table__toggle-cell" />
                        <th>Kohde</th>
                        <th>Käyttötarkoitus</th>
                        <th>Hallintamuoto</th>
                        <th>Suojeltu</th>
                        <th>Pinta-ala</th>
                        <th>Kerrosala</th>
                        <th>Yksikköhinta</th>
                        <th>Summa</th>
                        <th>AM-velvoite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sites.map((site, index) => (
                        <SiteRow
                          key={site.id}
                          site={site}
                          siteIndex={index}
                          rowValues={rowsBySiteId[site.id]}
                          isReadOnly={isCompensationsTableReadOnly}
                          isEditMode={isEditMode}
                          onRemove={handleRemoveSite}
                          onToggle={handleToggleSite}
                          isOpen={site.id === openSiteId}
                          colCount={10}
                        />
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td />
                        <td>
                          <strong>Yhteensä</strong>
                        </td>
                        <td />
                        <td />
                        <td />
                        <td>
                          <strong>
                            {formatLandUseNumericValueWithUnit(
                              totals.pintaAlaM2,
                              "m²",
                            )}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {formatLandUseNumericValueWithUnit(
                              totals.kem2,
                              "kem²",
                            )}
                          </strong>
                        </td>
                        <td />
                        <td>
                          <strong>
                            {formatLandUseEuroValue(totals.summa)}
                          </strong>
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                  <div>
                    <Button
                      type="button"
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconPlusCircleFill />}
                      disabled={isCompensationsTableReadOnly}
                      onClick={handleAddSite}
                    >
                      Lisää kohde
                    </Button>
                  </div>
                </div>
              </Fieldset>

              <Fieldset heading="Korvauksetta luovutettavat yleiset alueet">
                <div className="landuse-grid landuse-detail__compensation-grid">
                  <Field name="yleisetAlueetNeliot">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-yleiset-alueet-neliot"
                          label="Neliöt"
                          value={input.value}
                          unit="m²"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-yleiset-alueet-neliot"
                          label="Neliöt"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>

                  <Field name="yleisetAlueetHankinnanArvo">
                    {({ input }) =>
                      isEditMode ? (
                        <NumberInput
                          id="landuse-compensations-yleiset-alueet-hankinnan-arvo"
                          label="Hankinnan arvo eur"
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                        />
                      ) : (
                        <TextInput
                          id="landuse-compensations-yleiset-alueet-hankinnan-arvo"
                          label="Hankinnan arvo eur"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
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
