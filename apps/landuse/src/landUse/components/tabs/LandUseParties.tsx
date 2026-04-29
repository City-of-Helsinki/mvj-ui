import React, { useRef } from "react";
import {
  TextInput,
  Select,
  Accordion,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
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
import { createEmptyPartyEntry } from "../../api/landUseFormValues";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";

export interface BasePartyDetails {
  partyType: string | undefined;
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
  ovtCode: string;
  sapCustomerNumber: string;
  reference: string;
}

export interface ContactPerson {
  name: string | undefined;
  phone: string;
  email: string;
}

export interface PartyEntry {
  party: {
    details: PersonPartyDetails | CompanyPartyDetails;
  };
  contactPersons: ContactPerson[];
  billingDetails: BillingDetails;
  invoiceRecipient: {
    details: PersonPartyDetails | CompanyPartyDetails;
  };
}

export interface LandUsePartiesFormValues {
  parties: PartyEntry[];
}

interface LandUsePartiesProps {
  form: FormApi<LandUsePartiesFormValues>;
  isEditMode: boolean;
}

const partyTypeOptions = [
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
    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3" />

    <div className="landuse-grid__column-3" style={{ gridColumn: "span 3" }}>
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
    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3">
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

    <div className="landuse-grid__column-3" style={{ gridColumn: "span 3" }}>
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
  const newlyAddedIndexRef = useRef<number | null>(null);

  return (
    <Form<LandUsePartiesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const partiesCount = values?.parties?.length ?? 0;

        const shouldOpenAccordion = (index: number): boolean => {
          // When there are multiple parties, initially open none of the Accordions
          // When there is only one party, initially open its Accordion
          // When creating a new party, open its Accordion

          if (newlyAddedIndexRef.current === index) {
            newlyAddedIndexRef.current = null;
            return true;
          }
          return partiesCount === 1;
        };

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Osapuolet</h1>

              <FieldArray<PartyEntry> name="parties">
                {({ fields }) => (
                  <>
                    {fields.map((fieldName, index) => {
                      const partyEntry = values?.parties?.[index];
                      const partyName =
                        partyEntry?.party?.details?.name?.trim() ||
                        "Uusi osapuoli";

                      return (
                        <Accordion
                          key={fieldName}
                          heading={partyName}
                          initiallyOpen={shouldOpenAccordion(index)}
                        >
                          <h3>Sopimusosapuoli</h3>
                          <Fieldset heading="" className="full-width">
                            <div className="landuse-grid">
                              <div className="landuse-grid__column-3">
                                <Field
                                  name={`${fieldName}.party.details.partyType`}
                                >
                                  {({ input }) =>
                                    isEditMode ? (
                                      <Select
                                        id={`party-${index}-type`}
                                        texts={{
                                          label: "Asiakastyyppi",
                                          placeholder: "Valitse asiakastyyppi",
                                        }}
                                        options={partyTypeOptions}
                                        value={normalizeSelectValue(
                                          input.value,
                                        )}
                                        onChange={(selected) =>
                                          handleSelectChange(
                                            selected,
                                            input.onChange,
                                          )
                                        }
                                      />
                                    ) : (
                                      <TextInput
                                        id={`party-${index}-type`}
                                        label="Asiakastyyppi"
                                        value={readOnlyTextValue(input.value)}
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              {partyEntry?.party?.details?.partyType ===
                                "yritys" && (
                                <CompanyPartyForm
                                  fieldPrefix={`${fieldName}.party.details`}
                                  idPrefix={`party-${index}`}
                                  isEditMode={isEditMode}
                                />
                              )}
                              {partyEntry?.party?.details?.partyType ===
                                "yksityishenkilo" && (
                                <PersonPartyForm
                                  fieldPrefix={`${fieldName}.party.details`}
                                  idPrefix={`party-${index}`}
                                  isEditMode={isEditMode}
                                />
                              )}
                            </div>
                          </Fieldset>

                          <h3>Yhteyshenkilöt/neuvottelijat</h3>
                          <Fieldset heading="" className="full-width">
                            <FieldArray<ContactPerson>
                              name={`${fieldName}.contactPersons`}
                            >
                              {({ fields: contactPersonFields }) => (
                                <>
                                  {contactPersonFields.map(
                                    (contactPersonFieldName, contactIndex) => (
                                      <div
                                        className="landuse-grid"
                                        key={contactPersonFieldName}
                                      >
                                        <div className="landuse-grid__column-3">
                                          <Field
                                            name={`${contactPersonFieldName}.name`}
                                          >
                                            {({ input }) => (
                                              <TextInput
                                                id={`contact-${index}-person-${contactIndex}`}
                                                label="Nimi"
                                                value={getFieldTextValue(
                                                  isEditMode,
                                                  input.value,
                                                )}
                                                onChange={input.onChange}
                                                readOnly={!isEditMode}
                                                placeholder="Placeholder"
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        <div className="landuse-grid__column-3">
                                          <Field
                                            name={`${contactPersonFieldName}.phone`}
                                          >
                                            {({ input }) => (
                                              <TextInput
                                                id={`contact-${index}-person-phone-${contactIndex}`}
                                                label="Puhelinnumero"
                                                value={getFieldTextValue(
                                                  isEditMode,
                                                  input.value,
                                                )}
                                                onChange={input.onChange}
                                                readOnly={!isEditMode}
                                                placeholder="Placeholder"
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        <div className="landuse-grid__column-3">
                                          <Field
                                            name={`${contactPersonFieldName}.email`}
                                          >
                                            {({ input }) => (
                                              <TextInput
                                                id={`contact-${index}-person-email-${contactIndex}`}
                                                label="Sähköposti"
                                                value={getFieldTextValue(
                                                  isEditMode,
                                                  input.value,
                                                )}
                                                onChange={input.onChange}
                                                readOnly={!isEditMode}
                                                placeholder="Placeholder"
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        <div
                                          className="landuse-grid__column-3"
                                          style={{ justifyContent: "flex-end" }}
                                        >
                                          {isEditMode ? (
                                            <ConfirmDeleteButton
                                              id={`contact-person-delete-${index}-${contactIndex}`}
                                              buttonAriaLabel={`Poista yhteyshenkilö ${contactIndex + 1}`}
                                              buttonVariant={
                                                ButtonVariant.Supplementary
                                              }
                                              onConfirm={() =>
                                                contactPersonFields.remove(
                                                  contactIndex,
                                                )
                                              }
                                              dialogTitle="Poista yhteyshenkilö"
                                              dialogContent={`Haluatko varmasti poistaa yhteyshenkilön ${partyEntry.contactPersons[contactIndex]?.name?.trim() ?? ""}?`}
                                            />
                                          ) : null}
                                        </div>
                                      </div>
                                    ),
                                  )}

                                  {isEditMode && (
                                    <div className="landuse-grid">
                                      <div className="landuse-grid__column-3">
                                        <Button
                                          className="landuse-detail__add-button"
                                          variant={ButtonVariant.Supplementary}
                                          iconStart={<IconPlusCircleFill />}
                                          type="button"
                                          onClick={() =>
                                            contactPersonFields.push({
                                              name: undefined,
                                              phone: "",
                                              email: "",
                                            })
                                          }
                                        >
                                          Lisää yhteyshenkilö
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </FieldArray>
                          </Fieldset>

                          <h3>Laskutustiedot</h3>
                          <Fieldset heading="" className="full-width">
                            <div className="landuse-grid">
                              <div className="landuse-grid__column-3">
                                <Field
                                  name={`${fieldName}.billingDetails.ovtCode`}
                                >
                                  {({ input }) => (
                                    <TextInput
                                      id={`billing-${index}-ovt-code`}
                                      label="Ovt-tunnus"
                                      value={getFieldTextValue(
                                        isEditMode,
                                        input.value,
                                      )}
                                      onChange={input.onChange}
                                      readOnly={!isEditMode}
                                      placeholder="Placeholder"
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-grid__column-3">
                                <Field
                                  name={`${fieldName}.billingDetails.sapCustomerNumber`}
                                >
                                  {({ input }) => (
                                    <TextInput
                                      id={`billing-${index}-sap-customer-number`}
                                      label="SAP-asiakasnumero"
                                      value={getFieldTextValue(
                                        isEditMode,
                                        input.value,
                                      )}
                                      onChange={input.onChange}
                                      readOnly={!isEditMode}
                                      placeholder="Placeholder"
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-grid__column-3">
                                <Field
                                  name={`${fieldName}.billingDetails.reference`}
                                >
                                  {({ input }) => (
                                    <TextInput
                                      id={`billing-${index}-reference`}
                                      label="Viite"
                                      value={getFieldTextValue(
                                        isEditMode,
                                        input.value,
                                      )}
                                      onChange={input.onChange}
                                      readOnly={!isEditMode}
                                      placeholder="Placeholder"
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                          </Fieldset>

                          <h3>Laskunsaaja</h3>
                          <Fieldset heading="" className="full-width">
                            <div className="landuse-grid">
                              <div className="landuse-grid__column-3">
                                <Field
                                  name={`${fieldName}.invoiceRecipient.details.partyType`}
                                >
                                  {({ input }) =>
                                    isEditMode ? (
                                      <Select
                                        id={`invoice-${index}-party-type`}
                                        texts={{
                                          label: "Asiakastyyppi",
                                          placeholder: "Valitse asiakastyyppi",
                                        }}
                                        options={partyTypeOptions}
                                        value={normalizeSelectValue(
                                          input.value,
                                        )}
                                        onChange={(selected) =>
                                          handleSelectChange(
                                            selected,
                                            input.onChange,
                                          )
                                        }
                                      />
                                    ) : (
                                      <TextInput
                                        id={`invoice-${index}-party-type`}
                                        label="Asiakastyyppi"
                                        value={readOnlyTextValue(input.value)}
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              {partyEntry?.invoiceRecipient?.details
                                ?.partyType === "yritys" && (
                                <CompanyPartyForm
                                  fieldPrefix={`${fieldName}.invoiceRecipient.details`}
                                  idPrefix={`invoice-${index}`}
                                  isEditMode={isEditMode}
                                />
                              )}
                              {partyEntry?.invoiceRecipient?.details
                                ?.partyType === "yksityishenkilo" && (
                                <PersonPartyForm
                                  fieldPrefix={`${fieldName}.invoiceRecipient.details`}
                                  idPrefix={`invoice-${index}`}
                                  isEditMode={isEditMode}
                                />
                              )}
                            </div>
                          </Fieldset>

                          {isEditMode && (
                            <ConfirmDeleteButton
                              id={`party-delete-${index}`}
                              buttonLabel="Poista osapuoli"
                              onConfirm={() => fields.remove(index)}
                              dialogTitle="Poista osapuoli"
                              dialogContent={`Haluatko varmasti poistaa osapuolen ${partyName?.trim() ?? ""}?`}
                            />
                          )}
                        </Accordion>
                      );
                    })}

                    {isEditMode && (
                      <Button
                        className="landuse-detail__add-button"
                        variant={ButtonVariant.Supplementary}
                        iconStart={<IconPlusCircleFill />}
                        type="button"
                        onClick={() => {
                          newlyAddedIndexRef.current = fields.length ?? 0;
                          fields.push(createEmptyPartyEntry());
                        }}
                      >
                        Lisää osapuoli
                      </Button>
                    )}
                  </>
                )}
              </FieldArray>
            </div>
          </form>
        );
      }}
    />
  );
};
