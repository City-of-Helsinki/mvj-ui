import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { useLandUseMetadata } from "@/landUse/api/useLandUseMetadata";
import { useQuery } from "@tanstack/react-query";
import {
  getLandPolicyPrograms,
  getSiteIntendedUses,
  getSiteTenureTypes,
} from "@/landUse/api/landUseApi";
import { Decorator, FormApi } from "final-form";
import createDecorator from "final-form-calculate";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Fieldset,
  IconAngleDown,
  IconAngleUp,
  IconPlusCircleFill,
  IconSize,
  Link,
  Select,
  StepByStep,
  TextArea,
  TextInput,
  ToggleButton,
} from "hds-react";
import React, { useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useTocEntries } from "@/landUse/hooks/useTableOfContents";
import {
  normalizeMultiSelectValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "@/landUse/utils/fieldUtils";
import {
  formatLandUseEuroValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
  parseNumber,
} from "@/landUse/utils/number";
import { ConfirmDeleteButton } from "@/landUse/components/ConfirmDeleteButton";

export interface LandUseSite {
  id: string;
  kohteenTunnus: string;
  pintaAlaM2?: string;
  kem2?: string;
  kayttotarkoitusId?: number | null;
  kayttotarkoitus: string | undefined;
  hallintamuotoIds?: number[];
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
  excelLaskelmaUrl: string;
  kaavaehdotustaEdeltavaArvo: string;
  perustietotaulukkoRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  purkuTaiMuuVahennys: number;
  maankayttokorvaus: string;
  maapoliittinenOhjelmaId?: number | null;
  maapoliittinenOhjelma: string | undefined;
  huojennusProsentti: string;
  yleisetAlueetNeliot: string;
  yleisetAlueetHankinnanArvo: string;
}

interface LandUseCompensationsProps {
  form: FormApi<LandUseCompensationsFormValues>;
  isEditMode: boolean;
  onSetTabDirty?: (formKey: "compensations") => void;
}

const COMPENSATION_STEP_KEYS = {
  laskelma: "laskelma",
  kohteet: "kohteet",
  maankayttokorvaus: "maankayttokorvaus",
  tilastoitavatTiedot: "tilastoitavat-tiedot",
} as const;

const COMPENSATION_STEPS = [
  {
    key: COMPENSATION_STEP_KEYS.laskelma,
    title: "Maankäyttökorvauksen laskelma",
  },
  {
    key: COMPENSATION_STEP_KEYS.kohteet,
    title: "Kohteet",
  },
  {
    key: COMPENSATION_STEP_KEYS.maankayttokorvaus,
    title: "Maankäyttökorvaus",
  },
  {
    key: COMPENSATION_STEP_KEYS.tilastoitavatTiedot,
    title: "Tilastoitavat tiedot",
  },
] as const;

const getCompensationStepId = (key: string): string =>
  `compensations-step-${key}`;

const getRowFieldPath = (
  siteId: string,
  field: keyof PerustietotaulukkoRowValues,
): string => `perustietotaulukkoRowsBySiteId.${siteId}.${field}`;

export const calculateMaankayttokorvausYhteensa = (
  values: Partial<LandUseCompensationsFormValues>,
): string =>
  (
    (parseLandUseNumericValue(values.rahakorvaus) ?? 0) +
    (parseLandUseNumericValue(values.maakorvaus) ?? 0) +
    (parseLandUseNumericValue(values.muuKorvaus) ?? 0)
  ).toString();

// Recalculates the derived "Yhteensä" field so its value is stored in and
// saved with the form whenever any of its source fields change.
export const maankayttokorvausYhteensaDecorator = createDecorator({
  field: /^(rahakorvaus|maakorvaus|muuKorvaus)$/,
  updates: {
    maankayttokorvausYhteensa: (
      _value,
      allValues: Partial<LandUseCompensationsFormValues>,
      previousValues: Partial<LandUseCompensationsFormValues> | undefined,
    ) =>
      previousValues === undefined
        ? allValues.maankayttokorvausYhteensa
        : calculateMaankayttokorvausYhteensa(allValues),
  },
}) as Decorator<LandUseCompensationsFormValues>;

const compensationDecorators = [maankayttokorvausYhteensaDecorator];

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
  intendedUseOptions: SelectOption[];
  tenureTypeOptions: SelectOption[];
  preservationOptions: SelectOption[];
  isEditMode: boolean;
  onSetTabDirty: () => void;
  onRemove: (siteId: string) => void;
  onToggle: (siteId: string) => void;
  isOpen: boolean;
  colCount: number;
}

const SiteRow: React.FC<SiteRowProps> = ({
  site,
  siteIndex,
  rowValues,
  intendedUseOptions,
  tenureTypeOptions,
  preservationOptions,
  isEditMode,
  onSetTabDirty,
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
        <td>{site.kohteenTunnus ? site.kohteenTunnus : "-"}</td>
        <td>{site.kayttotarkoitus ?? "-"}</td>
        <td>
          {Array.isArray(site.hallintamuoto) && site.hallintamuoto.length > 0
            ? site.hallintamuoto.join(", ")
            : "-"}
        </td>
        <td>{formatLandUseNumericValueWithUnit(pintaAlaM2, "m²")}</td>
        <td>{formatLandUseNumericValueWithUnit(kerrosala, "kem²")}</td>
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
              <div className="landuse-grid--compact-spacing">
                <div className="landuse-grid__column-4">
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
                          inputMode="text"
                          id={`landuse-compensations-kohteen-tunnus-${site.id}`}
                          label="Kohteen tunnus"
                          value={input.value ?? ""}
                          onChange={input.onChange}
                        />
                      )
                    }
                  </Field>
                </div>

                <div className="landuse-grid__column-4">
                  <Field name={`sites.${siteIndex}.kayttotarkoitusId`}>
                    {({ input }) =>
                      !isEditMode ? (
                        <TextInput
                          id={`landuse-compensations-kayttotarkoitus-${site.id}`}
                          label="Käyttötarkoitus"
                          value={readOnlyTextValue(site.kayttotarkoitus)}
                          readOnly
                        />
                      ) : (
                        <Select
                          id={`landuse-compensations-kayttotarkoitus-${site.id}`}
                          options={intendedUseOptions}
                          value={normalizeSelectValue(input.value)}
                          onChange={(selectedOptions) => {
                            input.onChange(
                              selectedOptions[0]
                                ? Number(selectedOptions[0].value)
                                : null,
                            );
                            onSetTabDirty();
                          }}
                          texts={{
                            label: "Käyttötarkoitus",
                            placeholder: "Valitse",
                          }}
                        />
                      )
                    }
                  </Field>
                </div>

                <div className="landuse-grid__column-4">
                  <Field name={`sites.${siteIndex}.hallintamuotoIds`}>
                    {({ input }) =>
                      !isEditMode ? (
                        <TextInput
                          id={`landuse-compensations-hallintamuoto-${site.id}`}
                          label="Hallintamuoto"
                          value={
                            site.hallintamuoto && site.hallintamuoto.length > 0
                              ? site.hallintamuoto.join(", ")
                              : "-"
                          }
                          readOnly
                        />
                      ) : (
                        <Select
                          id={`landuse-compensations-hallintamuoto-${site.id}`}
                          options={tenureTypeOptions}
                          value={normalizeMultiSelectValue(
                            (input.value ?? []).map(String),
                          )}
                          onChange={(selectedOptions) => {
                            input.onChange(
                              selectedOptions.map((option) =>
                                Number(option.value),
                              ),
                            );
                            onSetTabDirty();
                          }}
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

                <div className="landuse-grid__column-4">
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
                          options={preservationOptions}
                          clearable
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

                <div className="landuse-grid__column-4">
                  <Field name={`sites.${siteIndex}.pintaAlaM2`}>
                    {({ input }) => (
                      <NumericDecimalInput
                        id={`landuse-compensations-pinta-ala-${site.id}`}
                        label="Pinta-ala (m²)"
                        value={input.value}
                        onChange={input.onChange}
                        isEditMode={isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-4">
                  <Field name={`sites.${siteIndex}.kem2`}>
                    {({ input }) => (
                      <NumericDecimalInput
                        id={`landuse-compensations-kem2-${site.id}`}
                        label="Kerrosala (kem²)"
                        value={input.value}
                        onChange={input.onChange}
                        isEditMode={isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-4">
                  <Field name={getRowFieldPath(site.id, "yksikkohinta")}>
                    {({ input }) => (
                      <NumericDecimalInput
                        isEditMode={isEditMode}
                        id={`landuse-compensations-yksikkohinta-${site.id}`}
                        label="Yksikköhinta (€/kem²)"
                        value={input.value}
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-grid__column-4">
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

                {isEditMode && (
                  <div className="landuse-grid__column-4 landuse-grid__column--align-bottom">
                    <ConfirmDeleteButton
                      id={`compensations-site-delete-${site.id}`}
                      buttonLabel="Poista kohde"
                      buttonVariant={ButtonVariant.Secondary}
                      buttonSize={ButtonSize.Small}
                      onConfirm={() => onRemove(site.id)}
                      dialogTitle="Poista kohde"
                      dialogContent={`Haluatko varmasti poistaa kohteen ${site.kohteenTunnus?.trim() ?? ""}?`}
                    />
                  </div>
                )}
              </div>
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
  onSetTabDirty,
}) => {
  const metadataQuery = useLandUseMetadata();
  const intendedUsesQuery = useQuery({
    queryKey: ["land-use", "site-intended-uses"],
    queryFn: getSiteIntendedUses,
    staleTime: 60 * 60 * 1000,
  });
  const tenureTypesQuery = useQuery({
    queryKey: ["land-use", "site-tenure-types"],
    queryFn: getSiteTenureTypes,
    staleTime: 60 * 60 * 1000,
  });
  const landPolicyProgramsQuery = useQuery({
    queryKey: ["land-use", "land-policy-programs"],
    queryFn: getLandPolicyPrograms,
    staleTime: 60 * 60 * 1000,
  });
  const intendedUseOptions = (intendedUsesQuery.data ?? []).map(({ id, name }) => ({
    label: name,
    value: String(id),
  }));
  const tenureTypeOptions = (tenureTypesQuery.data ?? []).map(({ id, name }) => ({
    label: name,
    value: String(id),
  }));
  const preservationOptions =
    metadataQuery.data?.preservation_designations ?? [];
  const landPolicyProgramOptions = (landPolicyProgramsQuery.data ?? []).map(
    ({ id, name }) => ({ label: name, value: String(id) }),
  );
  const [openSiteId, setOpenSiteId] = React.useState<string | null>(null);

  const tocEntries = useMemo(
    () => [
      ...COMPENSATION_STEPS.map((step) => ({
        id: getCompensationStepId(step.key),
        text: step.title,
        level: 2,
      })),
    ],
    [],
  );

  useTocEntries(tocEntries);

  return (
    <Form<LandUseCompensationsFormValues>
      form={form}
      onSubmit={() => {}}
      decorators={compensationDecorators}
      render={({ handleSubmit, values }) => {
        const sites = values.sites ?? [];
        const rowsBySiteId = values.perustietotaulukkoRowsBySiteId ?? {};

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
            kayttotarkoitusId: null,
            kayttotarkoitus: undefined,
            hallintamuotoIds: [],
            hallintamuoto: [],
            suojeltu: undefined,
            amVelvoite: false,
          };
          form.change("sites", [...sites, newSite]);
          onSetTabDirty?.("compensations");
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
          onSetTabDirty?.("compensations");

          if (openSiteId === siteId) {
            setOpenSiteId(null);
          }
        };

        const handleToggleSite = (siteId: string) => {
          setOpenSiteId((currentOpenSiteId) =>
            currentOpenSiteId === siteId ? null : siteId,
          );
        };

        const handleMaapoliittinenOhjelmaChange = (
          selectedOptions: SelectOption[],
        ) => {
          const selectedValue = selectedOptions[0]?.value;
          const selectedOption = landPolicyProgramsQuery.data?.find(
            (option) => String(option.id) === selectedValue,
          );

          form.change("maapoliittinenOhjelmaId", selectedOption?.id ?? null);
          form.change("maapoliittinenOhjelma", selectedOption?.name ?? "");
          form.change(
            "huojennusProsentti",
            selectedOption?.default_discount_percentage ?? "",
          );
          onSetTabDirty?.("compensations");
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

        const maankayttokorvausStep = (
          <Fieldset heading="" className="full-width">
            <div className="landuse-grid landuse-grid__bottom-margin">
              <div className="landuse-grid__column-6">
                <Field name="rahakorvaus">
                  {({ input, meta }) => (
                    <NumericDecimalInput
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

              <div className="landuse-grid__column-6">
                <Field name="maakorvaus">
                  {({ input, meta }) => (
                    <NumericDecimalInput
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

              <div className="landuse-grid__column-6">
                <Field name="muuKorvaus">
                  {({ input, meta }) => (
                    <NumericDecimalInput
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
            </div>
            <div className="landuse-grid landuse-grid__bottom-margin">
              <div className="landuse-grid__column-6">
                <Field name="maankayttokorvausYhteensa">
                  {({ input, meta }) => (
                    <NumericDecimalInput
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
            </div>
            <div className="landuse-grid">
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
        );

        const laskelmaStep = (
          <Fieldset heading="" className="full-width">
            <h3>Excel-laskelma</h3>
            <div className="landuse-grid landuse-grid__bottom-margin">
              <div className="landuse-grid__column-6">
                <Field name="excelLaskelmaUrl">
                  {({ input }) =>
                    isEditMode ? (
                      <>
                        <TextInput
                          id="landuse-compensations-excel-laskelma-url"
                          inputMode="url"
                          label="Excel-laskelman verkko-osoite"
                          value={input.value ?? ""}
                          onChange={input.onChange}
                        />
                        {input.value && (
                          <Link href={input.value} external openInNewTab>
                            {input.value}
                          </Link>
                        )}
                      </>
                    ) : input.value ? (
                      <Link href={input.value} external openInNewTab>
                        {input.value}
                      </Link>
                    ) : (
                      <TextInput
                        id="landuse-compensations-excel-laskelma-url"
                        label="Excel-laskelman verkko-osoite"
                        value="-"
                        readOnly
                      />
                    )
                  }
                </Field>
              </div>
            </div>
            <h3>Kaavaehdotusta edeltävä arvo</h3>
            <div className="landuse-grid landuse-grid__bottom-margin">
              <div className="landuse-grid__column-6">
                <Field name="kaavaehdotustaEdeltavaArvo">
                  {({ input }) => (
                    <NumericDecimalInput
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
            <h3>Kaavaehdotuksen mukainen arvo</h3>
            <div className="landuse-grid">
              <div className="landuse-grid__column-6">
                <Field name="perushinta">
                  {({ input }) => (
                    <NumericDecimalInput
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
        );

        const kohteetStep = (
          <>
            <div className="landuse-compensations-table-scroll">
              <table className="landuse-compensations-table">
                <thead>
                  <tr>
                    <th className="landuse-compensations-table__toggle-cell" />
                    <th>Kohde</th>
                    <th>Käyttötarkoitus</th>
                    <th>Hallintamuoto</th>
                    <th>Pinta-ala</th>
                    <th>Kerrosala</th>
                    <th>Summa</th>
                    <th>Velvoite</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site, index) => (
                    <SiteRow
                      key={site.id}
                      site={site}
                      siteIndex={index}
                      rowValues={rowsBySiteId[site.id]}
                      intendedUseOptions={intendedUseOptions}
                      tenureTypeOptions={tenureTypeOptions}
                      preservationOptions={preservationOptions}
                      isEditMode={isEditMode}
                      onSetTabDirty={() => onSetTabDirty?.("compensations")}
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
                        {formatLandUseNumericValueWithUnit(totals.kem2, "kem²")}
                      </strong>
                    </td>
                    <td>
                      <strong>{formatLandUseEuroValue(totals.summa)}</strong>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
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
          </>
        );

        const tilastoitavatTiedotStep = (
          <>
            <h3>Maapoliittinen huojennus</h3>
            <Fieldset heading="" className="full-width">
              <div className="landuse-grid">
                <div className="landuse-grid__column-6">
                  <Field name="maapoliittinenOhjelmaId">
                    {({ input }) =>
                      !isEditMode ? (
                        <TextInput
                          id="landuse-compensations-maapoliittinen-ohjelma"
                          label="Maapoliittinen ohjelma"
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      ) : (
                        <Select
                          id="landuse-compensations-maapoliittinen-ohjelma"
                          options={landPolicyProgramOptions}
                          value={normalizeSelectValue(
                            input.value == null ? undefined : String(input.value),
                          )}
                          onChange={handleMaapoliittinenOhjelmaChange}
                          clearable
                          texts={{
                            label: "Maapoliittinen ohjelma",
                            placeholder: "Valitse",
                          }}
                        />
                      )
                    }
                  </Field>
                </div>

                <div className="landuse-grid__column-6">
                  <Field name="huojennusProsentti">
                    {({ input, meta }) => (
                      <NumericDecimalInput
                        id="landuse-compensations-huojennus-prosentti"
                        label="Huojennus %"
                        isEditMode={isEditMode}
                        value={input.value}
                        unit="%"
                        onChange={input.onChange}
                        errorText={meta.error}
                        invalid={Boolean(meta.error)}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </Fieldset>
            <h3>Korvauksetta luovutettavat yleiset alueet</h3>
            <Fieldset heading="" className="full-width">
              <div className="landuse-grid">
                <div className="landuse-grid__column-6">
                  <Field name="yleisetAlueetNeliot">
                    {({ input }) => (
                      <NumericDecimalInput
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

                <div className="landuse-grid__column-6">
                  <Field name="yleisetAlueetHankinnanArvo">
                    {({ input }) => (
                      <NumericDecimalInput
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
          </>
        );

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Korvaukset</h1>

              <StepByStep
                steps={[
                  {
                    title: COMPENSATION_STEPS[0].title,
                    key: COMPENSATION_STEP_KEYS.laskelma,
                    description: (
                      <div
                        id={getCompensationStepId(
                          COMPENSATION_STEP_KEYS.laskelma,
                        )}
                      >
                        {laskelmaStep}
                      </div>
                    ),
                  },
                  {
                    title: COMPENSATION_STEPS[1].title,
                    key: COMPENSATION_STEP_KEYS.kohteet,
                    description: (
                      <div
                        id={getCompensationStepId(
                          COMPENSATION_STEP_KEYS.kohteet,
                        )}
                      >
                        {kohteetStep}
                      </div>
                    ),
                  },
                  {
                    title: COMPENSATION_STEPS[2].title,
                    key: COMPENSATION_STEP_KEYS.maankayttokorvaus,
                    description: (
                      <div
                        id={getCompensationStepId(
                          COMPENSATION_STEP_KEYS.maankayttokorvaus,
                        )}
                      >
                        {maankayttokorvausStep}
                      </div>
                    ),
                  },
                  {
                    title: COMPENSATION_STEPS[3].title,
                    key: COMPENSATION_STEP_KEYS.tilastoitavatTiedot,
                    description: (
                      <div
                        id={getCompensationStepId(
                          COMPENSATION_STEP_KEYS.tilastoitavatTiedot,
                        )}
                      >
                        {tilastoitavatTiedotStep}
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

export default LandUseCompensations;
