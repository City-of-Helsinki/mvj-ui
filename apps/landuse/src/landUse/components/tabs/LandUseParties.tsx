import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  TextInput,
  TextArea,
  Select,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
  Fieldset,
  StepByStep,
} from "hds-react";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  getOptionsDisplayValue,
} from "../../utils/fieldUtils";
import { createEmptyPartyEntry } from "../../api/landUseFormValues";
import { useTocEntries } from "../../hooks/useTableOfContents";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import {
  partyRoleOptions,
  partyTypeOptions,
  languageOptions,
  countryOptions,
} from "../../options";
export interface BasePartyDetails {
  partyRole: string | undefined;
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
  invoiceRecipient?: {
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
  <div className="landuse-grid landuse-grid__bottom-margin">
    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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
              value={getOptionsDisplayValue(input.value, languageOptions)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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
              value={getOptionsDisplayValue(input.value, countryOptions)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-12">
      <Field name={`${fieldPrefix}.note`}>
        {({ input }) => (
          <TextArea
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
  </div>
);

const PersonPartyForm: React.FC<PartyFormProps> = ({
  fieldPrefix,
  idPrefix,
  isEditMode,
}) => (
  <div className="landuse-grid landuse-grid__bottom-margin">
    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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
              value={getOptionsDisplayValue(input.value, languageOptions)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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
              value={getOptionsDisplayValue(input.value, countryOptions)}
              readOnly
            />
          )
        }
      </Field>
    </div>

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-4">
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

    <div className="landuse-grid__column-12">
      <Field name={`${fieldPrefix}.note`}>
        {({ input }) => (
          <TextArea
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
  </div>
);

const getPartyHeadingId = (index: number): string => `party-heading-${index}`;

const getPartyName = (partyEntry: PartyEntry | undefined): string =>
  partyEntry?.party?.details?.name?.trim() || "Uusi osapuoli";

export const LandUseParties: React.FC<LandUsePartiesProps> = ({
  form,
  isEditMode,
}) => {
  const newlyAddedIndexRef = useRef<number | null>(null);
  const [parties, setParties] = useState<PartyEntry[]>(
    () => form.getState().values.parties ?? [],
  );

  useEffect(
    () =>
      form.subscribe((state) => setParties(state.values.parties ?? []), {
        values: true,
      }),
    [form],
  );

  const tocEntries = useMemo(
    () =>
      parties.map((party, index) => ({
        id: getPartyHeadingId(index),
        text: getPartyName(party),
        level: 2,
      })),
    [parties],
  );

  useTocEntries(tocEntries);

  return (
    <Form<LandUsePartiesFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Osapuolet</h1>

              <FieldArray<PartyEntry> name="parties">
                {({ fields }) => (
                  <>
                    {fields.map((fieldName, index) => {
                      const partyEntry = values?.parties?.[index];
                      const partyName = getPartyName(partyEntry);

                      return (
                        <div
                          className="landuse-detail__party-entry"
                          key={`${fieldName}-${index}`}
                        >
                          <div className="landuse-detail__heading-with-delete">
                            <h2 id={getPartyHeadingId(index)}>{partyName}</h2>
                            {isEditMode && (
                              <ConfirmDeleteButton
                                id={`party-${index}-delete`}
                                buttonLabel="Poista osapuoli"
                                onConfirm={() => fields.remove(index)}
                                dialogTitle="Poista osapuoli"
                                dialogContent={`Haluatko varmasti poistaa osapuolen ${partyName?.trim() ?? ""}?`}
                              />
                            )}
                          </div>

                          <StepByStep
                            numberedList
                            steps={[
                              {
                                title: "Sopimusosapuoli",
                                key: "contract-party",
                                description: (
                                  <Fieldset heading="" className="full-width">
                                    <div className="landuse-grid landuse-grid__bottom-margin">
                                      <div className="landuse-grid__column-4">
                                        <Field
                                          name={`${fieldName}.party.details.partyRole`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <Select
                                                id={`party-${index}-role`}
                                                texts={{
                                                  label: "Rooli",
                                                  placeholder: "Valitse rooli",
                                                }}
                                                options={partyRoleOptions}
                                                value={normalizeSelectValue(
                                                  input.value,
                                                )}
                                                onChange={(selected) =>
                                                  handleSelectChange(
                                                    selected,
                                                    input.onChange,
                                                  )
                                                }
                                                required
                                              />
                                            ) : (
                                              <TextInput
                                                id={`party-${index}-role`}
                                                label="Rooli"
                                                value={getOptionsDisplayValue(
                                                  input.value,
                                                  partyRoleOptions,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>
                                    </div>
                                    <div className="landuse-grid landuse-grid__bottom-margin">
                                      <div className="landuse-grid__column-4">
                                        <Field
                                          name={`${fieldName}.party.details.partyType`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <Select
                                                id={`party-${index}-type`}
                                                texts={{
                                                  label: "Asiakastyyppi",
                                                  placeholder:
                                                    "Valitse asiakastyyppi",
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
                                                value={getOptionsDisplayValue(
                                                  input.value,
                                                  partyTypeOptions,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>
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
                                  </Fieldset>
                                ),
                              },
                              {
                                title: "Yhteyshenkilöt/neuvottelijat",
                                key: "contact-persons",
                                description: (
                                  <Fieldset heading="" className="full-width">
                                    <FieldArray<ContactPerson>
                                      name={`${fieldName}.contactPersons`}
                                    >
                                      {({ fields: contactPersonFields }) => (
                                        <>
                                          {contactPersonFields.map(
                                            (
                                              contactPersonFieldName,
                                              contactIndex,
                                            ) => (
                                              <div
                                                className="landuse-grid"
                                                key={contactPersonFieldName}
                                              >
                                                <div className="landuse-grid__column-4">
                                                  <Field
                                                    name={`${contactPersonFieldName}.name`}
                                                  >
                                                    {({ input }) => (
                                                      <TextInput
                                                        id={`party-${index}-contact-${contactIndex}-name`}
                                                        label="Nimi"
                                                        value={getFieldTextValue(
                                                          isEditMode,
                                                          input.value,
                                                        )}
                                                        onChange={
                                                          input.onChange
                                                        }
                                                        readOnly={!isEditMode}
                                                        placeholder="Placeholder"
                                                      />
                                                    )}
                                                  </Field>
                                                </div>

                                                <div className="landuse-grid__column-4">
                                                  <Field
                                                    name={`${contactPersonFieldName}.phone`}
                                                  >
                                                    {({ input }) => (
                                                      <TextInput
                                                        id={`party-${index}-contact-${contactIndex}-phone`}
                                                        label="Puhelinnumero"
                                                        value={getFieldTextValue(
                                                          isEditMode,
                                                          input.value,
                                                        )}
                                                        onChange={
                                                          input.onChange
                                                        }
                                                        readOnly={!isEditMode}
                                                        placeholder="Placeholder"
                                                      />
                                                    )}
                                                  </Field>
                                                </div>

                                                <div className="landuse-grid__column-4">
                                                  <Field
                                                    name={`${contactPersonFieldName}.email`}
                                                  >
                                                    {({ input }) => (
                                                      <TextInput
                                                        id={`party-${index}-contact-${contactIndex}-email`}
                                                        label="Sähköposti"
                                                        value={getFieldTextValue(
                                                          isEditMode,
                                                          input.value,
                                                        )}
                                                        onChange={
                                                          input.onChange
                                                        }
                                                        readOnly={!isEditMode}
                                                        placeholder="Placeholder"
                                                      />
                                                    )}
                                                  </Field>
                                                </div>

                                                <div className="landuse-grid__column-4">
                                                  {isEditMode ? (
                                                    <ConfirmDeleteButton
                                                      id={`party-${index}-contact-${contactIndex}-delete`}
                                                      buttonLabel="Poista yhteyshenkilö"
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
                                              <div className="landuse-grid__column-4">
                                                <Button
                                                  className="landuse-detail__add-button"
                                                  variant={
                                                    ButtonVariant.Supplementary
                                                  }
                                                  iconStart={
                                                    <IconPlusCircleFill />
                                                  }
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
                                ),
                              },
                              {
                                title: "Laskutustiedot",
                                key: "billing-details",
                                description: (
                                  <Fieldset heading="" className="full-width">
                                    <div className="landuse-grid">
                                      <div className="landuse-grid__column-4">
                                        <Field
                                          name={`${fieldName}.billingDetails.ovtCode`}
                                        >
                                          {({ input }) => (
                                            <TextInput
                                              id={`party-${index}-billing-ovt-code`}
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

                                      <div className="landuse-grid__column-4">
                                        <Field
                                          name={`${fieldName}.billingDetails.sapCustomerNumber`}
                                        >
                                          {({ input }) => (
                                            <TextInput
                                              id={`party-${index}-billing-sap-customer-number`}
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

                                      <div className="landuse-grid__column-4">
                                        <Field
                                          name={`${fieldName}.billingDetails.reference`}
                                        >
                                          {({ input }) => (
                                            <TextInput
                                              id={`party-${index}-billing-reference`}
                                              label="Asiakkaan viite"
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
                                ),
                              },
                              {
                                title: "Laskunsaaja",
                                key: "invoice-recipient",
                                description: (
                                  <>
                                    <Fieldset heading="" className="full-width">
                                      <div className="landuse-grid">
                                        <div className="landuse-grid__column-4">
                                          <Field
                                            name={`${fieldName}.invoiceRecipient.details.partyType`}
                                          >
                                            {({ input }) =>
                                              isEditMode ? (
                                                <Select
                                                  id={`party-${index}-invoice-type`}
                                                  texts={{
                                                    label: "Asiakastyyppi",
                                                    placeholder:
                                                      "Valitse asiakastyyppi",
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
                                                  id={`party-${index}-invoice-type`}
                                                  label="Asiakastyyppi"
                                                  value={getOptionsDisplayValue(
                                                    input.value,
                                                    partyTypeOptions,
                                                  )}
                                                  readOnly
                                                />
                                              )
                                            }
                                          </Field>
                                        </div>
                                      </div>

                                      {partyEntry?.invoiceRecipient?.details
                                        ?.partyType === "yritys" && (
                                        <CompanyPartyForm
                                          fieldPrefix={`${fieldName}.invoiceRecipient.details`}
                                          idPrefix={`party-${index}-invoice`}
                                          isEditMode={isEditMode}
                                        />
                                      )}
                                      {partyEntry?.invoiceRecipient?.details
                                        ?.partyType === "yksityishenkilo" && (
                                        <PersonPartyForm
                                          fieldPrefix={`${fieldName}.invoiceRecipient.details`}
                                          idPrefix={`party-${index}-invoice`}
                                          isEditMode={isEditMode}
                                        />
                                      )}
                                    </Fieldset>

                                    <div className="landuse-detail__delete-button-row">
                                      {isEditMode &&
                                      partyEntry.invoiceRecipient ? (
                                        <ConfirmDeleteButton
                                          id={`party-${index}-invoice-delete`}
                                          buttonLabel="Poista laskunsaaja"
                                          buttonAriaLabel={`Poista laskunsaaja`}
                                          buttonVariant={
                                            ButtonVariant.Supplementary
                                          }
                                          onConfirm={() =>
                                            partyEntry.invoiceRecipient &&
                                            fields.update(index, {
                                              ...partyEntry,
                                              invoiceRecipient: undefined,
                                            })
                                          }
                                          dialogTitle="Poista laskunsaaja"
                                          dialogContent={
                                            "Haluatko varmasti poistaa laskunsaajan?"
                                          }
                                        />
                                      ) : null}
                                    </div>
                                  </>
                                ),
                              },
                            ]}
                          />
                        </div>
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
