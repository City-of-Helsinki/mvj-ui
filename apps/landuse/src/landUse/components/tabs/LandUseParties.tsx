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
import { normalizeSelectValue } from "../../fieldUtils";
import {
  negotiatorsOptions as defaultNegotiatorsOptions,
  signatoriesOptions as defaultSignatoriesOptions,
} from "../../options";

export interface PartyDetails {
  customerType: string | undefined;
  name: string;
  businessId: string;
  language: string | undefined;
  partnerCode: string;
  ovtCode: string;
  customerNumber?: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string | undefined;
  careOf: string;
  phone: string;
  email: string;
  landlord: string | undefined;
  note: string;
}

export interface InvoiceDetails extends PartyDetails {
  sapCustomerNumber: string;
}

export interface LandUsePartiesFormValues {
  customer: {
    reference: string;
    details: PartyDetails;
  };
  contactPerson: {
    name: string | undefined;
    phone: string;
    email: string;
  };
  invoiceRecipient: {
    details: InvoiceDetails;
  };
  negotiatorsOptions: Array<{ label: string; value: string }>;
  signatoriesOptions: Array<{ label: string; value: string }>;
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

const landlordOptions = [
  { label: "Kyllä", value: "kylla" },
  { label: "Ei", value: "ei" },
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

const readOnlyTextValue = (value: string | undefined): string => value || "-";

const getFieldTextValue = (
  isEditMode: boolean,
  value: string | undefined,
): string => (isEditMode ? (value ?? "") : readOnlyTextValue(value));

export const LandUseParties: React.FC<LandUsePartiesProps> = ({
  form,
  isEditMode,
}) => {
  return (
    <Form<LandUsePartiesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const negotiatorsOptions = defaultNegotiatorsOptions;
        const signatoriesOptions = defaultSignatoriesOptions;
        const customerName = values?.customer?.details?.name?.trim() || "Nimi";

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">OSAPUOLET</h2>

              <Fieldset
                heading=""
                className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__grid">
                  <div
                    className="landuse-detail__column"
                    style={{ gridColumn: "span 4" }}
                  >
                    <Field name="customer.reference">
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

              <h3 className="landuse-detail__section-title">
                Asiakkaan tiedot
              </h3>
              <Accordion heading={customerName} initiallyOpen>
                <Fieldset
                  heading=""
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

                    <div className="landuse-detail__column">
                      <Field name="customer.details.name">
                        {({ input }) => (
                          <TextInput
                            id="customer-company"
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
                      <Field name="customer.details.businessId">
                        {({ input }) => (
                          <TextInput
                            id="customer-business-id"
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
                      <Field name="customer.details.language">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="customer-language"
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
                              id="customer-language"
                              label="Kieli"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="customer.details.partnerCode">
                        {({ input }) => (
                          <TextInput
                            id="customer-partner-code"
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
                      <Field name="customer.details.ovtCode">
                        {({ input }) => (
                          <TextInput
                            id="customer-ovt-code"
                            label="Ovt-tunnus"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>
                    <div className="landuse-detail__column" />
                    <div className="landuse-detail__column" />
                    <div className="landuse-detail__column">
                      <Field name="customer.details.streetAddress">
                        {({ input }) => (
                          <TextInput
                            id="customer-street"
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
                      <Field name="customer.details.city">
                        {({ input }) => (
                          <TextInput
                            id="customer-city"
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
                      <Field name="customer.details.postalCode">
                        {({ input }) => (
                          <TextInput
                            id="customer-postal-code"
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
                      <Field name="customer.details.country">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="customer-country"
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
                              id="customer-country"
                              label="Maa"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="customer.details.careOf">
                        {({ input }) => (
                          <TextInput
                            id="customer-care-of"
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
                      <Field name="customer.details.phone">
                        {({ input }) => (
                          <TextInput
                            id="customer-phone"
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
                      <Field name="customer.details.email">
                        {({ input }) => (
                          <TextInput
                            id="customer-email"
                            label="Sähköposti"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="customer.details.landlord">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="customer-landlord"
                              texts={{
                                label: "Vuokranantaja",
                                placeholder: "Valitse vuokranantaja",
                              }}
                              options={landlordOptions}
                              value={normalizeSelectValue(input.value)}
                              onChange={(selected) =>
                                handleSelectChange(selected, input.onChange)
                              }
                            />
                          ) : (
                            <TextInput
                              id="customer-landlord"
                              label="Vuokranantaja"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div
                      className="landuse-detail__column"
                      style={{ gridColumn: "span 3" }}
                    >
                      <Field name="customer.details.note">
                        {({ input }) => (
                          <TextInput
                            id="customer-note"
                            label="Huomautus"
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

                <h3 className="landuse-detail__section-title">Yhteyshenkilö</h3>
                <Fieldset
                  heading=""
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

                <h3 className="landuse-detail__section-title">Laskunsaaja</h3>
                <Fieldset
                  heading=""
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

                    <div className="landuse-detail__column">
                      <Field name="invoiceRecipient.details.name">
                        {({ input }) => (
                          <TextInput
                            id="invoice-company"
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
                      <Field name="invoiceRecipient.details.businessId">
                        {({ input }) => (
                          <TextInput
                            id="invoice-business-id"
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
                      <Field name="invoiceRecipient.details.language">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="invoice-language"
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
                              id="invoice-language"
                              label="Kieli"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="invoiceRecipient.details.partnerCode">
                        {({ input }) => (
                          <TextInput
                            id="invoice-partner-code"
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
                      <Field name="invoiceRecipient.details.ovtCode">
                        {({ input }) => (
                          <TextInput
                            id="invoice-ovt-code"
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
                      <Field name="invoiceRecipient.details.customerNumber">
                        {({ input }) => (
                          <TextInput
                            id="invoice-customer-number"
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
                      <Field name="invoiceRecipient.details.sapCustomerNumber">
                        {({ input }) => (
                          <TextInput
                            id="invoice-sap-customer-number"
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
                      <Field name="invoiceRecipient.details.streetAddress">
                        {({ input }) => (
                          <TextInput
                            id="invoice-street"
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
                      <Field name="invoiceRecipient.details.city">
                        {({ input }) => (
                          <TextInput
                            id="invoice-city"
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
                      <Field name="invoiceRecipient.details.postalCode">
                        {({ input }) => (
                          <TextInput
                            id="invoice-postal-code"
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
                      <Field name="invoiceRecipient.details.country">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="invoice-country"
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
                              id="invoice-country"
                              label="Maa"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="invoiceRecipient.details.careOf">
                        {({ input }) => (
                          <TextInput
                            id="invoice-care-of"
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
                      <Field name="invoiceRecipient.details.phone">
                        {({ input }) => (
                          <TextInput
                            id="invoice-phone"
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
                      <Field name="invoiceRecipient.details.email">
                        {({ input }) => (
                          <TextInput
                            id="invoice-email"
                            label="Sähköposti"
                            value={getFieldTextValue(isEditMode, input.value)}
                            onChange={input.onChange}
                            readOnly={!isEditMode}
                            placeholder="Placeholder"
                          />
                        )}
                      </Field>
                    </div>

                    <div className="landuse-detail__column">
                      <Field name="invoiceRecipient.details.landlord">
                        {({ input }) =>
                          isEditMode ? (
                            <Select
                              id="invoice-landlord"
                              texts={{
                                label: "Vuokranantaja",
                                placeholder: "Valitse vuokranantaja",
                              }}
                              options={landlordOptions}
                              value={normalizeSelectValue(input.value)}
                              onChange={(selected) =>
                                handleSelectChange(selected, input.onChange)
                              }
                            />
                          ) : (
                            <TextInput
                              id="invoice-landlord"
                              label="Vuokranantaja"
                              value={readOnlyTextValue(input.value)}
                              readOnly
                            />
                          )
                        }
                      </Field>
                    </div>

                    <div
                      className="landuse-detail__column"
                      style={{ gridColumn: "span 3" }}
                    >
                      <Field name="invoiceRecipient.details.note">
                        {({ input }) => (
                          <TextInput
                            id="invoice-note"
                            label="Huomautus"
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
