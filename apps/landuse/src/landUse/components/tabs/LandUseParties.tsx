import React from "react";
import {
  TextInput,
  Select,
  Accordion,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
  IconTrash,
  Fieldset,
} from "hds-react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { negotiatorsOptions, signatoriesOptions } from "../../options";

export interface BasePartyDetails {
  customerType: string | undefined;
  name: string;
  language: string | undefined;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string | undefined;
  careOf: string;
  phone: string;
  email: string;
  note: string;
}

export interface PersonPartyDetails extends BasePartyDetails {
  nationalIdentificationNumber: string;
}

export interface CompanyPartyDetails extends BasePartyDetails {
  businessId: string;
}

export interface BillingDetails {
  partnerCode: string;
  ovtCode: string;
  customerNumber: string;
  sapCustomerNumber: string;
  reference: string;
}

export interface LandUsePartiesFormValues {
  customer: {
    details: PersonPartyDetails | CompanyPartyDetails;
  };
  contactPerson: {
    name: string | undefined;
    phone: string;
    email: string;
  };
  billingDetails: BillingDetails;
  invoiceRecipient: {
    details: PersonPartyDetails | CompanyPartyDetails;
  };
  negotiators: Array<{ name: string | undefined }>;
  signatories: Array<{ name: string | undefined }>;
}

interface LandUsePartiesProps {
  form: FormApi<LandUsePartiesFormValues>;
  isEditMode: boolean;
}

const customerTypeOptions = [
  { label: "Yritys", value: "yritys" },
  { label: "Yksityishenkilö", value: "yksityishenkilo" },
];

const languageOptions = [
  { label: "suomi", value: "suomi" },
  { label: "ruotsi", value: "ruotsi" },
  { label: "englanti", value: "englanti" },
];

const countryOptions = [
  { label: "Suomi", value: "suomi" },
  { label: "Ruotsi", value: "ruotsi" },
  { label: "Norja", value: "norja" },
];

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

interface PartyFormProps {
  fieldPrefix: string;
  idPrefix: string;
  isEditMode: boolean;
}

const CompanyPartyForm: React.FC<PartyFormProps> = ({
  fieldPrefix,
  idPrefix,
  isEditMode,
}) => (
  <>
    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.name`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-name`}
            label="Nimi"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.businessId`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-business-id`}
            label="Y-tunnus"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="12345"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.language`}>
        {({ input }) =>
          isEditMode ? (
            <Select
              id={`${idPrefix}-language`}
              texts={{
                label: "Kieli",
                placeholder: "Valitse kieli",
              }}
              options={languageOptions}
              value={normalizeSelectValue(input.value)}
              onChange={(selected) =>
                handleSelectChange(selected, input.onChange)
              }
            />
          ) : (
            <TextInput
              id={`${idPrefix}-language`}
              label="Kieli"
              value={readOnlyTextValue(input.value)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.streetAddress`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-street`}
            label="Katuosoite"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.city`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-city`}
            label="Postitoimipaikka"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.postalCode`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-postal-code`}
            label="Postinumero"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.country`}>
        {({ input }) =>
          isEditMode ? (
            <Select
              id={`${idPrefix}-country`}
              texts={{
                label: "Maa",
                placeholder: "Valitse maa",
              }}
              options={countryOptions}
              value={normalizeSelectValue(input.value)}
              onChange={(selected) =>
                handleSelectChange(selected, input.onChange)
              }
            />
          ) : (
            <TextInput
              id={`${idPrefix}-country`}
              label="Maa"
              value={readOnlyTextValue(input.value)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.careOf`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-care-of`}
            label="c/o"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.phone`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-phone`}
            label="Puhelinnumero"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.email`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-email`}
            label="Sähköposti"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column" style={{ gridColumn: "span 3" }}>
      <Field name={`${fieldPrefix}.note`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-note`}
            label="Huomautus"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>
  </>
);

const PersonPartyForm: React.FC<PartyFormProps> = ({
  fieldPrefix,
  idPrefix,
  isEditMode,
}) => (
  <>
    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.name`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-name`}
            label="Nimi"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.nationalIdentificationNumber`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-national-id`}
            label="Henkilötunnus"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.language`}>
        {({ input }) =>
          isEditMode ? (
            <Select
              id={`${idPrefix}-language`}
              texts={{
                label: "Kieli",
                placeholder: "Valitse kieli",
              }}
              options={languageOptions}
              value={normalizeSelectValue(input.value)}
              onChange={(selected) =>
                handleSelectChange(selected, input.onChange)
              }
            />
          ) : (
            <TextInput
              id={`${idPrefix}-language`}
              label="Kieli"
              value={readOnlyTextValue(input.value)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.streetAddress`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-street`}
            label="Katuosoite"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.city`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-city`}
            label="Postitoimipaikka"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.postalCode`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-postal-code`}
            label="Postinumero"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.country`}>
        {({ input }) =>
          isEditMode ? (
            <Select
              id={`${idPrefix}-country`}
              texts={{
                label: "Maa",
                placeholder: "Valitse maa",
              }}
              options={countryOptions}
              value={normalizeSelectValue(input.value)}
              onChange={(selected) =>
                handleSelectChange(selected, input.onChange)
              }
            />
          ) : (
            <TextInput
              id={`${idPrefix}-country`}
              label="Maa"
              value={readOnlyTextValue(input.value)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.careOf`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-care-of`}
            label="c/o"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.phone`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-phone`}
            label="Puhelinnumero"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column">
      <Field name={`${fieldPrefix}.email`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-email`}
            label="Sähköposti"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>

    <div className="landuse-detail__column" style={{ gridColumn: "span 3" }}>
      <Field name={`${fieldPrefix}.note`}>
        {({ input }) => (
          <TextInput
            id={`${idPrefix}-note`}
            label="Huomautus"
            value={getFieldTextValue(isEditMode, input.value)}
            onChange={input.onChange}
            readOnly={!isEditMode}
            placeholder="Placeholder"
          />
        )}
      </Field>
    </div>
  </>
);

export const LandUseParties: React.FC<LandUsePartiesProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUsePartiesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const customerName = values?.customer?.details?.name?.trim() || "Nimi";

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">OSAPUOLET</h2>

              <Accordion heading={customerName} initiallyOpen>
                <Fieldset
                  heading="Sopimusosapuoli"
                  className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid">
                    <div className="landuse-detail__column">
                      <Field name="customer.details.customerType">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="customer-type"
                              texts={{
                                label: "Asiakastyyppi",
                                placeholder: "Valitse asiakastyyppi",
                              }}
                              options={customerTypeOptions}
                              value={normalizeSelectValue(input.value)}
                              onChange={(selected) =>
                                handleSelectChange(selected, input.onChange)
                              }
                            />
                          ) : (
                            <TextInput
                              id="customer-type"
                              label="Asiakastyyppi"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    {values?.customer?.details?.customerType === "yritys" && (
                      <CompanyPartyForm
                        fieldPrefix="customer.details"
                        idPrefix="customer"
                        isEditMode={isEditMode}
                      />
                    )}
                    {values?.customer?.details?.customerType ===
                      "yksityishenkilo" && (
                      <PersonPartyForm
                        fieldPrefix="customer.details"
                        idPrefix="customer"
                        isEditMode={isEditMode}
                      />
                    )}
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Laskutustiedot"
                  className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid">
                    <div className="landuse-detail__column">
                      <Field name="billingDetails.partnerCode">
                        {({ input }) => (
                          <TextInput
                            id="billing-partner-code"
                            label="Kumppanikoodi"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="billingDetails.ovtCode">
                        {({ input }) => (
                          <TextInput
                            id="billing-ovt-code"
                            label="Ovt-tunnus"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="billingDetails.customerNumber">
                        {({ input }) => (
                          <TextInput
                            id="billing-customer-number"
                            label="Asiakasnumero"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="billingDetails.sapCustomerNumber">
                        {({ input }) => (
                          <TextInput
                            id="billing-sap-customer-number"
                            label="SAP-asiakasnumero"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="billingDetails.reference">
                        {({ input }) => (
                          <TextInput
                            id="customer-reference"
                            label="Viite"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Yhteyshenkilö"
                  className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid">
                    <div className="landuse-detail__column">
                      <Field name="contactPerson.name">
                        {({ input }) => (
                          <TextInput
                            id="contact-person"
                            label="Nimi"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="contactPerson.phone">
                        {({ input }) => (
                          <TextInput
                            id="contact-person-phone"
                            label="Puhelinnumero"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="contactPerson.email">
                        {({ input }) => (
                          <TextInput
                            id="contact-person-email"
                            label="Sähköposti"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Laskunsaaja"
                  className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid">
                    <div className="landuse-detail__column">
                      <Field name="invoiceRecipient.details.customerType">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="invoice-customer-type"
                              texts={{
                                label: "Asiakastyyppi",
                                placeholder: "Valitse asiakastyyppi",
                              }}
                              options={customerTypeOptions}
                              value={normalizeSelectValue(input.value)}
                              onChange={(selected) =>
                                handleSelectChange(selected, input.onChange)
                              }
                            />
                          ) : (
                            <TextInput
                              id="invoice-customer-type"
                              label="Asiakastyyppi"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    {values?.invoiceRecipient?.details?.customerType ===
                      "yritys" && (
                      <CompanyPartyForm
                        fieldPrefix="invoiceRecipient.details"
                        idPrefix="invoice"
                        isEditMode={isEditMode}
                      />
                    )}
                    {values?.invoiceRecipient?.details?.customerType ===
                      "yksityishenkilo" && (
                      <PersonPartyForm
                        fieldPrefix="invoiceRecipient.details"
                        idPrefix="invoice"
                        isEditMode={isEditMode}
                      />
                    )}
                  </div>
                </Fieldset>
              </Accordion>

              <h3 className="landuse-detail__section-title">Neuvottelijat</h3>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
              >
                <FieldArray<{ name: string | undefined }> name="negotiators">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <div
                          className="landuse-detail__grid landuse-detail__grid--with-delete"
                          key={name}
                        >
                          <div className="landuse-detail__column">
                            <Field name={`${name}.name`}>
                              {({ input }) =>
                                isEditMode ? (
                                  <Select
                                    id={`negotiator-${index}`}
                                    texts={{
                                      label: `Neuvottelija ${index + 1}`,
                                      placeholder: "Valitse neuvottelija",
                                    }}
                                    options={negotiatorsOptions}
                                    value={normalizeSelectValue(input.value)}
                                    onChange={(selected) =>
                                      handleSelectChange(
                                        selected,
                                        input.onChange,
                                      )
                                    }
                                  />
                                ) : (
                                  <TextInput
                                    id={`negotiator-${index}`}
                                    label={`Neuvottelija ${index + 1}`}
                                    value={readOnlyTextValue(input.value)}
                                    readOnly
                                  />
                                )
                              }
                            </Field>
                          </div>

                          {isEditMode && (
                            <div
                              className="landuse-detail__column"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <Button
                                aria-label={`Poista neuvottelija ${index + 1}`}
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                type="button"
                                onClick={() => fields.remove(index)}
                              >
                                Poista
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isEditMode && (
                        <div className="landuse-detail__grid">
                          <div className="landuse-detail__column">
                            <Button
                              className="landuse-detail__add-button"
                              variant={ButtonVariant.Supplementary}
                              iconStart={<IconPlusCircleFill />}
                              type="button"
                              onClick={() => fields.push({ name: undefined })}
                            >
                              Lisää neuvottelija
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </Fieldset>

              <h3 className="landuse-detail__section-title">
                Allekirjoittajat
              </h3>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--no-heading"
              >
                <FieldArray<{ name: string | undefined }> name="signatories">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <div
                          className="landuse-detail__grid landuse-detail__grid--with-delete"
                          key={name}
                        >
                          <div className="landuse-detail__column">
                            <Field name={`${name}.name`}>
                              {({ input }) =>
                                isEditMode ? (
                                  <Select
                                    id={`signatory-${index}`}
                                    texts={{
                                      label: `Allekirjoittaja ${index + 1}`,
                                      placeholder: "Valitse allekirjoittaja",
                                    }}
                                    options={signatoriesOptions}
                                    value={normalizeSelectValue(input.value)}
                                    onChange={(selected) =>
                                      handleSelectChange(
                                        selected,
                                        input.onChange,
                                      )
                                    }
                                  />
                                ) : (
                                  <TextInput
                                    id={`signatory-${index}`}
                                    label={`Allekirjoittaja ${index + 1}`}
                                    value={readOnlyTextValue(input.value)}
                                    readOnly
                                  />
                                )
                              }
                            </Field>
                          </div>

                          {isEditMode && (
                            <div
                              className="landuse-detail__column"
                              style={{ justifyContent: "flex-end" }}
                            >
                              <Button
                                aria-label={`Poista allekirjoittaja ${index + 1}`}
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                type="button"
                                onClick={() => fields.remove(index)}
                              >
                                Poista
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isEditMode && (
                        <div className="landuse-detail__grid">
                          <div className="landuse-detail__column">
                            <Button
                              className="landuse-detail__add-button"
                              variant={ButtonVariant.Supplementary}
                              iconStart={<IconPlusCircleFill />}
                              type="button"
                              onClick={() => fields.push({ name: undefined })}
                            >
                              Lisää allekirjoittaja
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
              </Fieldset>
            </div>
          </form>
        );
      }}
    />
  );
};
