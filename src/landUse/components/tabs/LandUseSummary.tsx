import React, { useEffect, useMemo, useState } from "react";
import {
  TextInput,
  RadioButton,
  SelectionGroup,
  Select,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
  IconTrash,
  Fieldset,
  DateInput,
} from "hds-react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";
import { normalizeSelectValue } from "../../fieldUtils";
import { getAsemakaavat } from "../../api/landUseApi";
import {
  type AsemakaavaListItem,
  landUseEdistamisalueOptions,
  landUseNegotiationPhaseOptions,
} from "../../options";
import { landUseKohdeSelectOptions } from "../../mocks/landUseMockData";

interface ValmistelijaEntry {
  value: string | undefined;
}

interface OsoiteEntry {
  katuosoite: string;
  postinumero: string;
  kaupunki: string;
}

interface KohdeEntry {
  value: string | undefined;
}

export interface LandUseSummaryFormValues {
  maankayttosopimusType: string | undefined;
  edistamisalue: string | undefined;
  tila: string | undefined;
  suunnittelunPerusteenaOlevatKohteet: KohdeEntry[];
  valmistelijat: ValmistelijaEntry[];
  osoitteet: OsoiteEntry[];
  arvioituEsittelyvuosi: string;
  arvioituMaksuvuosi: string;
  toimivaltainenPaattaja: string;
  sisaltaaAmVelvoitteita: string;
  velvoitteidenMaaraika: string;
  asemakaavanNumero: string;
  asemakaavanKasittelyvaihe: string;
  kasittelyvaiheenViimeisinPvm: string;
  asemakaavanHyvaksyjä: string;
  asemakaavanDiaarinumero: string;
}

interface LandUseSummaryProps {
  form: FormApi<LandUseSummaryFormValues>;
  isEditMode: boolean;
}

const maankayttosopimusTypeOptions = [
  {
    label: "Maankäyttösopimus",
    value: "Maankäyttösopimus",
  },
];

const kohdeSelectFilter = (
  option: { label: string },
  filterStr: string,
): boolean => option.label.toLowerCase().includes(filterStr.toLowerCase());

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  } else {
    callback(undefined);
  }
};

export const LandUseSummary: React.FC<LandUseSummaryProps> = ({
  form,
  isEditMode,
}) => {
  const [asemakaavat, setAsemakaavat] = useState<AsemakaavaListItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadAsemakaavat = async () => {
      const items = await getAsemakaavat();
      if (isMounted) {
        setAsemakaavat(items);
      }
    };

    void loadAsemakaavat();

    return () => {
      isMounted = false;
    };
  }, []);

  const asemakaavaNumberOptions = useMemo(
    () =>
      asemakaavat.map((item) => ({
        label: item.asemakaavanNumero,
        value: item.asemakaavanNumero,
      })),
    [asemakaavat],
  );

  const handleAsemakaavaNumberChange = (
    selectedOptions: { label: string; value: string }[],
  ) => {
    const selectedNumber = selectedOptions[0]?.value ?? "";
    const selectedAsemakaava = asemakaavat.find(
      (item) => item.asemakaavanNumero === selectedNumber,
    );

    form.batch(() => {
      form.change("asemakaavanNumero", selectedNumber);
      form.change(
        "asemakaavanKasittelyvaihe",
        selectedAsemakaava?.asemakaavanKasittelyvaihe ?? "",
      );
      form.change(
        "kasittelyvaiheenViimeisinPvm",
        selectedAsemakaava?.kasittelyvaiheenViimeisinPvm ?? "",
      );
      form.change(
        "asemakaavanHyvaksyjä",
        selectedAsemakaava?.asemakaavanHyvaksyjä ?? "",
      );
      form.change(
        "asemakaavanDiaarinumero",
        selectedAsemakaava?.asemakaavanDiaarinumero ?? "",
      );
    });
  };

  return (
    <Form<LandUseSummaryFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">PERUSTIEDOT</h2>

            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                <div className="landuse-detail__column">
                  <Field name="maankayttosopimusType">
                    {({ input }) => (
                      <Select
                        id="summary-maankayttosopimus-type"
                        options={maankayttosopimusTypeOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "Maankäyttösopimuksen tyyppi",
                          placeholder: "Valitse",
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="edistamisalue">
                    {({ input }) => (
                      <Select
                        id="summary-edistamisalue"
                        options={landUseEdistamisalueOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "Edistämisalue",
                          placeholder: "Valitse",
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="tila">
                    {({ input }) => (
                      <Select
                        id="summary-tila"
                        options={landUseNegotiationPhaseOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "Maankäyttösopimuksen tila",
                          placeholder: "Valitse",
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </Fieldset>

            <h3 className="landuse-detail__section-title">
              Suunnittelun perusteena olevat kohteet
            </h3>
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                <FieldArray<KohdeEntry> name="suunnittelunPerusteenaOlevatKohteet">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <div
                          key={name}
                          style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "16px",
                          }}
                        >
                          <div
                            className="landuse-detail__column"
                            style={{ flex: "0 1 480px" }}
                          >
                            <Field name={`${name}.value`}>
                              {({ input }) => (
                                <Select
                                  id={`suunnittelun-kohde-${index}`}
                                  options={landUseKohdeSelectOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selectedOptions) =>
                                    handleSelectChange(
                                      selectedOptions,
                                      input.onChange,
                                    )
                                  }
                                  filter={kohdeSelectFilter}
                                  texts={{
                                    label: `Kohde ${index + 1}`,
                                    placeholder: "Valitse",
                                  }}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          {isEditMode && (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Button
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                onClick={() => fields.remove(index)}
                                style={{ width: "fit-content" }}
                              >
                                Poista
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isEditMode && (
                        <div
                          className="landuse-detail__column"
                          style={{ gridColumn: "1 / -1" }}
                        >
                          <Button
                            className="landuse-detail__add-button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() => fields.push({ value: undefined })}
                          >
                            Lisää kohde
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </div>
            </Fieldset>

            {/* Valmistelija Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                <FieldArray<ValmistelijaEntry> name="valmistelijat">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <React.Fragment key={name}>
                          <div className="landuse-detail__column">
                            <Field name={`${name}.value`}>
                              {({ input }) => (
                                <Select
                                  id={`valmistelija-${index}`}
                                  options={[
                                    {
                                      label: "Valmistelija 1",
                                      value: "valmistelija1",
                                    },
                                    {
                                      label: "Valmistelija 2",
                                      value: "valmistelija2",
                                    },
                                    {
                                      label: "Valmistelija 3",
                                      value: "valmistelija3",
                                    },
                                  ]}
                                  value={input.value}
                                  onChange={(selectedOptions) =>
                                    handleSelectChange(
                                      selectedOptions,
                                      input.onChange,
                                    )
                                  }
                                  texts={{
                                    label: "Valmistelija",
                                    placeholder: "Valitse",
                                  }}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          {isEditMode && (
                            <div
                              className="landuse-detail__column"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <Button
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                onClick={() => fields.remove(index)}
                                disabled={fields.length === 1}
                                style={{ width: "fit-content" }}
                              >
                                Poista
                              </Button>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {isEditMode && (
                        <div
                          className="landuse-detail__column"
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            className="landuse-detail__add-button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() => fields.push({ value: undefined })}
                          >
                            Lisää valmistelija
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </div>
            </Fieldset>

            {/* Additional Fields Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                <div className="landuse-detail__column">
                  <Field name="arvioituEsittelyvuosi">
                    {({ input }) => (
                      <TextInput
                        id="arvioitu-esittelyvuosi"
                        label="Arvioitu esittelyvuosi"
                        value={input.value}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="arvioituMaksuvuosi">
                    {({ input }) => (
                      <TextInput
                        id="arvioitu-maksuvuosi"
                        label="Arvioitu maksuvuosi"
                        value={input.value}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <div className="landuse-detail__field-group">
                    <Field name="sisaltaaAmVelvoitteita">
                      {({ input }) => (
                        <SelectionGroup label="Sisältää AM-velvoitteita">
                          <RadioButton
                            id="am-velvoitteet-kylla"
                            label="Kyllä"
                            checked={input.value === "kyllä"}
                            onChange={() => input.onChange("kyllä")}
                            disabled={!isEditMode}
                          />
                          <RadioButton
                            id="am-velvoitteet-ei"
                            label="Ei"
                            checked={input.value === "ei"}
                            onChange={() => input.onChange("ei")}
                            disabled={!isEditMode}
                          />
                        </SelectionGroup>
                      )}
                    </Field>
                  </div>
                </div>

                <div className="landuse-detail__column">
                  <Field name="velvoitteidenMaaraika">
                    {({ input }) => (
                      <DateInput
                        id="velvoitteiden-maaraika"
                        label="Velvoitteiden määräaika"
                        value={input.value}
                        onChange={input.onChange}
                        placeholder="DD.MM.YYYY"
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="toimivaltainenPaattaja">
                    {({ input }) => (
                      <TextInput
                        id="toimivaltainen-paattaja"
                        label="Toimivaltainen päättäjä"
                        value={input.value}
                        onChange={input.onChange}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </Fieldset>

            {/* Osoitteet Section */}
            <h3 className="landuse-detail__section-title">Osoitteet</h3>
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading"
            >
              <div className="landuse-detail__grid">
                <FieldArray<OsoiteEntry> name="osoitteet">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <React.Fragment key={name}>
                          <div className="landuse-detail__column">
                            <Field name={`${name}.katuosoite`}>
                              {({ input }) => (
                                <TextInput
                                  id={`katuosoite-${index}`}
                                  label="Katuosoite"
                                  value={input.value}
                                  onChange={input.onChange}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          <div className="landuse-detail__column">
                            <Field name={`${name}.postinumero`}>
                              {({ input }) => (
                                <TextInput
                                  id={`postinumero-${index}`}
                                  label="Postinumero"
                                  value={input.value}
                                  onChange={input.onChange}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          <div className="landuse-detail__column">
                            <Field name={`${name}.kaupunki`}>
                              {({ input }) => (
                                <TextInput
                                  id={`kaupunki-${index}`}
                                  label="Kaupunki"
                                  value={input.value}
                                  onChange={input.onChange}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          {isEditMode && (
                            <div
                              className="landuse-detail__column"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <Button
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                onClick={() => fields.remove(index)}
                                style={{ width: "fit-content" }}
                              >
                                Poista
                              </Button>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {isEditMode && (
                        <div className="landuse-detail__column">
                          <Button
                            className="landuse-detail__add-button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() =>
                              fields.push({
                                katuosoite: "",
                                postinumero: "",
                                kaupunki: "",
                              })
                            }
                          >
                            Lisää osoite
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </div>
            </Fieldset>

            {/* Asemakaavat Section */}
            <h3 className="landuse-detail__section-title">Asemakaavatiedot</h3>
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading"
            >
              <div className="landuse-detail__grid">
                <div className="landuse-detail__column">
                  <Field name="asemakaavanNumero">
                    {({ input }) => (
                      <Select
                        id="asemakaavan-numero"
                        options={asemakaavaNumberOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={handleAsemakaavaNumberChange}
                        filter={kohdeSelectFilter}
                        texts={{
                          label: "Asemakaavan numero",
                          placeholder: "Valitse",
                        }}
                        disabled={!isEditMode}
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="asemakaavanKasittelyvaihe">
                    {({ input }) => (
                      <TextInput
                        id="asemakaavan-kasittelyvaihe"
                        label="Asemakaavan käsittelyvaihe"
                        value={input.value}
                        onChange={input.onChange}
                        disabled
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="kasittelyvaiheenViimeisinPvm">
                    {({ input }) => (
                      <TextInput
                        id="kasittelyvaiheen-viimeisin-pvm"
                        label="Käsittelyvaiheen viimeisin pvm"
                        value={input.value}
                        onChange={input.onChange}
                        disabled
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="asemakaavanHyvaksyjä">
                    {({ input }) => (
                      <TextInput
                        id="asemakaavan-hyvaksyja"
                        label="Asemakaavan hyväksyjä"
                        value={input.value}
                        onChange={input.onChange}
                        disabled
                      />
                    )}
                  </Field>
                </div>

                <div className="landuse-detail__column">
                  <Field name="asemakaavanDiaarinumero">
                    {({ input }) => (
                      <TextInput
                        id="asemakaavan-diaarinumero"
                        label="Asemakaavan diaarinumero"
                        value={input.value}
                        onChange={input.onChange}
                        disabled
                      />
                    )}
                  </Field>
                </div>
              </div>
            </Fieldset>
          </div>
        </form>
      )}
    />
  );
};
