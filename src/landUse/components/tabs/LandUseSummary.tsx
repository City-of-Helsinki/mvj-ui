import React from "react";
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
  SearchInput,
} from "hds-react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";

interface KohdeEntry {
  kohteenTunnus: string;
  maankayttosopimusType: string;
  edistamisalue: string;
  tila: string;
}

interface ValmistelijaEntry {
  value: string;
}

interface OsoiteEntry {
  katuosoite: string;
  postinumero: string;
  kaupunki: string;
}

export interface LandUseSummaryFormValues {
  kohteet: KohdeEntry[];
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

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  }
};

export const LandUseSummary: React.FC<LandUseSummaryProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUseSummaryFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">PERUSTIEDOT</h2>

            {/* Kohde Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid landuse-detail__grid--with-delete">
                <FieldArray<KohdeEntry> name="kohteet">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <React.Fragment key={name}>
                          <div className="landuse-detail__column">
                            <Field name={`${name}.kohteenTunnus`}>
                              {({ input }) => (
                                <TextInput
                                  id={`kohteen-tunnus-${index}`}
                                  label="Kohteen tunnus"
                                  required
                                  value={input.value}
                                  onChange={input.onChange}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          <div className="landuse-detail__column">
                            <Field name={`${name}.maankayttosopimusType`}>
                              {({ input }) => (
                                <Select
                                  id={`maankayttosopimus-type-${index}`}
                                  options={[
                                    {
                                      label: "Maankäyttösopimus",
                                      value: "Maankäyttösopimus",
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
                                    label: "Maankäyttösopimuksen tyyppi",
                                    placeholder: "Valitse",
                                  }}
                                  disabled={!isEditMode}
                                />
                              )}
                            </Field>
                          </div>

                          <div className="landuse-detail__column">
                            <Field name={`${name}.edistamisalue`}>
                              {({ input }) => (
                                <Select
                                  id={`edistamisalue-${index}`}
                                  options={[
                                    { label: "Placeholder", value: "" },
                                  ]}
                                  value={input.value}
                                  onChange={(selectedOptions) =>
                                    handleSelectChange(
                                      selectedOptions,
                                      input.onChange,
                                    )
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
                            <Field name={`${name}.tila`}>
                              {({ input }) => (
                                <Select
                                  id={`tila-${index}`}
                                  options={[
                                    { label: "Vireillä", value: "Vireillä" },
                                  ]}
                                  value={input.value}
                                  onChange={(selectedOptions) =>
                                    handleSelectChange(
                                      selectedOptions,
                                      input.onChange,
                                    )
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
                        <div className="landuse-detail__column">
                          <Button
                            className="landuse-detail__add-button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() =>
                              fields.push({
                                kohteenTunnus: "",
                                maankayttosopimusType: "",
                                edistamisalue: "",
                                tila: "",
                              })
                            }
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
                            onClick={() => fields.push({ value: "" })}
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
                      <SearchInput
                        id="asemakaavan-numero"
                        label="Asemakaavan numero"
                        value={input.value}
                        onChange={input.onChange}
                        onSubmit={(value) =>
                          console.log("Search submitted:", value)
                        }
                        placeholder="Hae asemakaavaa"
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
