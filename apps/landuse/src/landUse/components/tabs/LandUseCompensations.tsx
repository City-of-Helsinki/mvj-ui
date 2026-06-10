import React, { useEffect } from "react";
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
  normalizeMultiSelectValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "../../utils/fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import {
  formatLandUseEuroValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
  parseNumber,
} from "../../utils/number";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import {
  INITIAL_KORVAUSKYNNYS_EURO,
  INITIAL_KORVAUS_PERCENTAGE,
} from "@/landUse/constants";
import { CurrencyInput } from "@/landUse/components/CurrencyInput";

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
  maankayttokorvausYhteensa: string;
  perushinta: string;
  maakorvausSelite: string;
  muuSelite: string;
  kaavaehdotustaEdeltavaArvo: string;
  perustietotaulukkoRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  korvauskynnys: number;
  purkuTaiMuuVahennys: number;
  korvausprosentti: number;
  maankayttokorvaus: string;
  yleisetAlueetNeliot: string;
  yleisetAlueetHankinnanArvo: string;
}

interface LandUseCompensationsProps {
  form: FormApi<LandUseCompensationsFormValues>;
  isEditMode: boolean;
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
  isEditMode,
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
              <div className="landuse-grid">
                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.kohteenTunnus`}>
                    {({ input }) =>
                      !isEditMode ? (
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
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.kayttotarkoitus`}>
                    {({ input }) =>
                      !isEditMode ? (
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
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.hallintamuoto`}>
                    {({ input }) =>
                      !isEditMode ? (
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
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.suojeltu`}>
                    {({ input }) =>
                      !isEditMode ? (
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
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.pintaAlaM2`}>
                    {({ input }) => (
                      <CurrencyInput
                        id={`landuse-compensations-pinta-ala-${site.id}`}
                        label="Pinta-ala (m²)"
                        value={input.value}
                        onChange={input.onChange}
                        isEditMode={isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.kem2`}>
                    {({ input }) => (
                      <CurrencyInput
                        id={`landuse-compensations-kem2-${site.id}`}
                        label="Kerrosala (kem²)"
                        value={input.value}
                        onChange={input.onChange}
                        isEditMode={isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={getRowFieldPath(site.id, "yksikkohinta")}>
                    {({ input }) => (
                      <CurrencyInput
                        isEditMode={isEditMode}
                        id={`landuse-compensations-yksikkohinta-${site.id}`}
                        label="Yksikköhinta (€/kem²)"
                        value={input.value}
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-3">
                  <Field name={`sites.${siteIndex}.amVelvoite`}>
                    {({ input }) =>
                      !isEditMode ? (
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
              </div>
              {!isEditMode && (
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
}) => {
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

        // Update the yhteensa field in the form whenever component values change
        useEffect(() => {
          const yhteensaStr = yhteensa.toString();
          if (values.maankayttokorvausYhteensa !== yhteensaStr) {
            form.change("maankayttokorvausYhteensa", yhteensaStr);
          }
        }, [yhteensa, values.maankayttokorvausYhteensa]);

        const handleAddSite = () => {
          if (!isEditMode) {
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
          if (!isEditMode) {
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
              <h1>Korvaukset</h1>
              <h2>Maankäyttökorvaus</h2>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-grid">
                  <div className="landuse-grid__column-3">
                    <Field name="rahakorvaus">
                      {({ input, meta }) => (
                        <CurrencyInput
                          id="landuse-compensations-rahakorvaus"
                          label="Rahakorvaus"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={meta.error}
                          invalid={Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-grid__column-3">
                    <Field name="maakorvaus">
                      {({ input, meta }) => (
                        <CurrencyInput
                          id="landuse-compensations-maakorvaus"
                          label="Maakorvaus"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={meta.error}
                          invalid={Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-grid__column-3">
                    <Field name="muuKorvaus">
                      {({ input, meta }) => (
                        <CurrencyInput
                          id="landuse-compensations-muu-korvaus"
                          label="Muu"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={meta.error}
                          invalid={Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-grid__column-3">
                    <Field name="maankayttokorvausYhteensa">
                      {({ input, meta }) => (
                        <CurrencyInput
                          id="landuse-compensations-maankayttokorvaus-yhteensa"
                          label="Yhteensä"
                          isEditMode={false}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={meta.error}
                          invalid={Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-grid__column-6">
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
                  </div>

                  <div className="landuse-grid__column-6">
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
                </div>
              </Fieldset>
              <h2>Maankäyttökorvauksen laskelma</h2>
              <h3>Luonnos</h3>
              <Fieldset
                heading=""
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
              <h3>Kaavaehdotusta edeltävä arvo</h3>
              <Fieldset heading="" className="">
                <div className="landuse-grid">
                  <div className="landuse-grid__column-3">
                    <Field name="kaavaehdotustaEdeltavaArvo">
                      {({ input }) => (
                        <CurrencyInput
                          id="landuse-compensations-kaavaehdotusta-edeltava-arvo"
                          label="Edeltävä arvo"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={input.error}
                          invalid={Boolean(input.error)}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </Fieldset>
              <h3>Kaavaehdotuksen mukainen arvo</h3>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-grid">
                  <div className="landuse-grid__column-3">
                    <Field name="perushinta">
                      {({ input }) => (
                        <CurrencyInput
                          id="landuse-compensations-perushinta"
                          label="Perushinta"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€/kem²"
                          onChange={input.onChange}
                          errorText={input.error}
                          invalid={Boolean(input.error)}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </Fieldset>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__sites-table-wrapper">
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
                      disabled={!isEditMode}
                      onClick={handleAddSite}
                    >
                      Lisää kohde
                    </Button>
                  </div>
                </div>
              </Fieldset>

              <h3>Maankäyttökorvauksen laskuri</h3>
              <Fieldset heading="">
                <div className="landuse-flexbox-horizontal">
                  <span className="math-operator-xl">(</span>
                  <CurrencyInput
                    id="landuse-compensations-arvonnousu"
                    label="Arvonnousu"
                    value={
                      totals.summa -
                      parseNumber(values.kaavaehdotustaEdeltavaArvo)
                    }
                    isEditMode={false}
                    unit="€"
                  />
                  <span className="math-operator-xl">-</span>
                  <Field
                    name="korvauskynnys"
                    initialValue={INITIAL_KORVAUSKYNNYS_EURO}
                    validate={(value) =>
                      // TODO collect validators to central place
                      value <= 0
                        ? "Korvauskynnys ei saa olla negatiivinen"
                        : undefined
                    }
                  >
                    {({ input, meta }) => (
                      <CurrencyInput
                        id="landuse-compensations-korvauskynnys"
                        label="Korvauskynnys"
                        isEditMode={isEditMode}
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                        errorText={meta.error}
                        invalid={Boolean(meta.error)}
                      />
                    )}
                  </Field>
                  <span className="math-operator-xl">+</span>
                  <Field name="purkuTaiMuuVahennys">
                    {({ input }) => (
                      <CurrencyInput
                        id="landuse-compensations-purku-tai-muu-vahennys"
                        label="Purkuvähennys"
                        isEditMode={isEditMode}
                        value={input.value}
                        unit="€"
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                  <span className="math-operator-xl">) *</span>
                  <Field
                    name="korvausprosentti"
                    initialValue={INITIAL_KORVAUS_PERCENTAGE}
                  >
                    {({ input }) => (
                      <CurrencyInput
                        id="landuse-compensations-korvausprosentti"
                        label="Korvausprosentti %"
                        isEditMode={isEditMode}
                        value={input.value}
                        unit="%"
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                  <span className="math-operator-xl"> = </span>
                  <Field name="maankayttokorvaus">
                    {() => {
                      const arvonnousu =
                        totals.summa -
                        parseNumber(values.kaavaehdotustaEdeltavaArvo);
                      const korvauskynnys = parseNumber(values.korvauskynnys);
                      const purkuTaiMuuVahennys = parseNumber(
                        values.purkuTaiMuuVahennys,
                      );
                      const korvausprosentti = parseNumber(
                        values.korvausprosentti,
                      );

                      const maankayttokorvaus =
                        (arvonnousu - korvauskynnys + purkuTaiMuuVahennys) *
                        (korvausprosentti / 100);

                      return (
                        <CurrencyInput
                          id="landuse-compensations-maankayttokorvaus"
                          label="Maankäyttökorvaus"
                          value={maankayttokorvaus}
                          unit="€"
                          isEditMode={false}
                        />
                      );
                    }}
                  </Field>
                </div>
              </Fieldset>

              <h3>Korvauksetta luovutettavat yleiset alueet</h3>
              <Fieldset heading="">
                <div className="landuse-grid">
                  <div className="landuse-grid__column-3">
                    <Field name="yleisetAlueetNeliot">
                      {({ input }) => (
                        <CurrencyInput
                          id="landuse-compensations-yleiset-alueet-neliot"
                          label="Neliöt"
                          isEditMode={isEditMode}
                          unit="m²"
                          value={input.value}
                          onChange={input.onChange}
                          errorText={input.error}
                          invalid={Boolean(input.error)}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-grid__column-3">
                    <Field name="yleisetAlueetHankinnanArvo">
                      {({ input }) => (
                        <CurrencyInput
                          id="landuse-compensations-yleiset-alueet-hankinnan-arvo"
                          label="Hankinnan arvo (€)"
                          isEditMode={isEditMode}
                          value={input.value}
                          unit="€"
                          onChange={input.onChange}
                          errorText={input.error}
                          invalid={Boolean(input.error)}
                        />
                      )}
                    </Field>
                  </div>
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
