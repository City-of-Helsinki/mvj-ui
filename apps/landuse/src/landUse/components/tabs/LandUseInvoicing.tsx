import React from "react";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  DateInput,
  Fieldset,
  IconAngleDown,
  IconAngleUp,
  IconPlusCircleFill,
  IconSize,
  NumberInput,
  Select,
  TextInput,
} from "hds-react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { landUseInvoicingSelectOptions } from "../../options";
import { formatLandUseEuroDisplayValue } from "../../utils/number";
import type { PartyEntry } from "./LandUseParties";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";

type SelectOption = { label: string; value: string };

export interface LandUseInvoiceRow {
  recipientPartyIndex: string | undefined;
  dueDate: string;
  invoiceNumber: string;
  type: string | undefined;
  status: string | undefined;
  billedAmount: string;
  remainingAmount: string;
}

export interface LandUseInvoicingFormValues {
  invoices?: LandUseInvoiceRow[];
}

interface LandUseInvoicingProps {
  form: FormApi<LandUseInvoicingFormValues>;
  isEditMode: boolean;
  parties: PartyEntry[];
}

const invoiceTypeOptions = landUseInvoicingSelectOptions.type.map((value) => ({
  label: value,
  value,
}));

const invoiceStatusOptions = landUseInvoicingSelectOptions.status.map(
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

const getPartyName = (value: string | undefined): string => value?.trim() ?? "";

const getInvoiceRecipientLabel = (party: PartyEntry, index: number): string => {
  const invoiceRecipientName = getPartyName(
    party.invoiceRecipient?.details?.name,
  );
  if (invoiceRecipientName) {
    return invoiceRecipientName;
  }

  const contractPartyName = getPartyName(party.party?.details?.name);
  if (contractPartyName) {
    return contractPartyName;
  }

  return `Osapuoli ${index + 1}`;
};

const createInvoiceRecipientOptions = (parties: PartyEntry[]): SelectOption[] =>
  parties.map((party, index) => ({
    label: getInvoiceRecipientLabel(party, index),
    value: String(index),
  }));

const getRecipientDisplayValue = (
  recipientPartyIndex: string | undefined,
  partyOptions: SelectOption[],
): string => {
  if (!recipientPartyIndex) {
    return "-";
  }

  return (
    partyOptions.find((option) => option.value === recipientPartyIndex)
      ?.label ?? "-"
  );
};

const createEmptyInvoiceRow = (
  recipientPartyIndex: string | undefined,
): LandUseInvoiceRow => ({
  recipientPartyIndex,
  dueDate: "",
  invoiceNumber: "",
  type: undefined,
  status: undefined,
  billedAmount: "",
  remainingAmount: "",
});

interface InvoiceRowProps {
  fieldName: string;
  index: number;
  isEditMode: boolean;
  isOpen: boolean;
  partyOptions: SelectOption[];
  onRemove: (index: number) => void;
  onToggle: (index: number) => void;
}

const getInvoiceDeleteLabel = (invoiceNumber: string | undefined): string => {
  const trimmedInvoiceNumber = invoiceNumber?.trim();

  if (trimmedInvoiceNumber) {
    return trimmedInvoiceNumber;
  }

  return "tämä lasku";
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  fieldName,
  index,
  isEditMode,
  isOpen,
  partyOptions,
  onRemove,
  onToggle,
}) => {
  return (
    <Field name={fieldName} subscription={{ value: true }}>
      {({ input }) => {
        const rowValue = (input.value ?? {}) as LandUseInvoiceRow;

        return (
          <>
            <tr
              className="landuse-compensations-table__row"
              onClick={() => onToggle(index)}
            >
              <td className="landuse-compensations-table__toggle-cell">
                <button
                  type="button"
                  className="landuse-compensations-table__toggle-btn"
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen ? "Sulje laskun tiedot" : "Avaa laskun tiedot"
                  }
                >
                  {isOpen ? (
                    <IconAngleUp size={IconSize.Small} />
                  ) : (
                    <IconAngleDown size={IconSize.Small} />
                  )}
                </button>
              </td>
              <td>
                {getRecipientDisplayValue(
                  rowValue.recipientPartyIndex,
                  partyOptions,
                )}
              </td>
              <td>{readOnlyTextValue(rowValue.dueDate)}</td>
              <td>{readOnlyTextValue(rowValue.invoiceNumber)}</td>
              <td>{readOnlyTextValue(rowValue.type)}</td>
              <td>{readOnlyTextValue(rowValue.status)}</td>
              <td>{formatLandUseEuroDisplayValue(rowValue.billedAmount)}</td>
              <td>{formatLandUseEuroDisplayValue(rowValue.remainingAmount)}</td>
            </tr>
            {isOpen && (
              <tr className="landuse-compensations-table__detail-row">
                <td colSpan={8}>
                  <div
                    className="landuse-compensations-table__detail-content landuse-compensations-table__detail-content--overflow-visible"
                    aria-label={`Laskun ${rowValue.invoiceNumber || index + 1} tiedot`}
                  >
                    <div className="landuse-grid">
                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.recipientPartyIndex`}>
                          {({ input: recipientInput }) =>
                            isEditMode ? (
                              <Select
                                id={`landuse-invoicing-recipient-${index}`}
                                options={partyOptions}
                                value={normalizeSelectValue(
                                  recipientInput.value,
                                )}
                                onChange={(selectedOptions) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    recipientInput.onChange,
                                  )
                                }
                                disabled={partyOptions.length === 0}
                                texts={{
                                  label: "Laskunsaaja",
                                  placeholder:
                                    partyOptions.length > 0
                                      ? "Valitse"
                                      : "Ei osapuolia",
                                }}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-recipient-${index}`}
                                label="Laskunsaaja"
                                value={getRecipientDisplayValue(
                                  recipientInput.value,
                                  partyOptions,
                                )}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.dueDate`}>
                          {({ input: dueDateInput }) =>
                            isEditMode ? (
                              <DateInput
                                id={`landuse-invoicing-due-date-${index}`}
                                label="Eräpäivä"
                                value={dueDateInput.value}
                                onChange={dueDateInput.onChange}
                                placeholder="DD.MM.YYYY"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-due-date-${index}`}
                                label="Eräpäivä"
                                value={readOnlyTextValue(dueDateInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.invoiceNumber`}>
                          {({ input: invoiceNumberInput }) => (
                            <TextInput
                              id={`landuse-invoicing-invoice-number-${index}`}
                              label="Laskunumero"
                              value={getFieldTextValue(
                                isEditMode,
                                invoiceNumberInput.value,
                              )}
                              onChange={invoiceNumberInput.onChange}
                              readOnly={!isEditMode}
                            />
                          )}
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.type`}>
                          {({ input: typeInput }) =>
                            isEditMode ? (
                              <Select
                                id={`landuse-invoicing-type-${index}`}
                                options={invoiceTypeOptions}
                                value={normalizeSelectValue(typeInput.value)}
                                onChange={(selectedOptions) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    typeInput.onChange,
                                  )
                                }
                                texts={{
                                  label: "Tyyppi",
                                  placeholder: "Valitse",
                                }}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-type-${index}`}
                                label="Tyyppi"
                                value={readOnlyTextValue(typeInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.status`}>
                          {({ input: statusInput }) =>
                            isEditMode ? (
                              <Select
                                id={`landuse-invoicing-status-${index}`}
                                options={invoiceStatusOptions}
                                value={normalizeSelectValue(statusInput.value)}
                                onChange={(selectedOptions) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    statusInput.onChange,
                                  )
                                }
                                texts={{
                                  label: "Laskun tila",
                                  placeholder: "Valitse",
                                }}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-status-${index}`}
                                label="Laskun tila"
                                value={readOnlyTextValue(statusInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.billedAmount`}>
                          {({ input: billedAmountInput }) =>
                            isEditMode ? (
                              <NumberInput
                                id={`landuse-invoicing-billed-amount-${index}`}
                                label="Laskutettu"
                                value={billedAmountInput.value}
                                unit="€"
                                onChange={billedAmountInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-billed-amount-${index}`}
                                label="Laskutettu"
                                value={formatLandUseEuroDisplayValue(
                                  billedAmountInput.value,
                                )}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.remainingAmount`}>
                          {({ input: remainingAmountInput }) =>
                            isEditMode ? (
                              <NumberInput
                                id={`landuse-invoicing-remaining-amount-${index}`}
                                label="Maksamatta"
                                value={remainingAmountInput.value}
                                unit="€"
                                onChange={remainingAmountInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-remaining-amount-${index}`}
                                label="Maksamatta"
                                value={formatLandUseEuroDisplayValue(
                                  remainingAmountInput.value,
                                )}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="landuse-compensations-table__detail-actions">
                        <ConfirmDeleteButton
                          id={`invoicing-delete-${index}`}
                          buttonLabel="Poista lasku"
                          buttonVariant={ButtonVariant.Danger}
                          buttonSize={ButtonSize.Small}
                          onConfirm={() => onRemove(index)}
                          dialogTitle="Poista lasku"
                          dialogContent={`Haluatko varmasti poistaa laskun ${getInvoiceDeleteLabel(rowValue.invoiceNumber)}?`}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </>
        );
      }}
    </Field>
  );
};

export const LandUseInvoicing: React.FC<LandUseInvoicingProps> = ({
  form,
  isEditMode,
  parties,
}) => {
  const [openInvoiceIndex, setOpenInvoiceIndex] = React.useState<number | null>(
    null,
  );

  return (
    <Form<LandUseInvoicingFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => {
        const partyOptions = createInvoiceRecipientOptions(parties ?? []);

        const handleAddInvoice = (
          push: (value: LandUseInvoiceRow) => void,
          currentLength: number,
        ) => {
          push(createEmptyInvoiceRow(partyOptions[0]?.value));
          setOpenInvoiceIndex(currentLength);
        };

        const handleRemoveInvoice = (
          remove: (index: number) => void,
          index: number,
        ) => {
          remove(index);

          setOpenInvoiceIndex((currentOpenInvoiceIndex) => {
            if (currentOpenInvoiceIndex === null) {
              return null;
            }

            if (currentOpenInvoiceIndex === index) {
              return null;
            }

            if (currentOpenInvoiceIndex > index) {
              return currentOpenInvoiceIndex - 1;
            }

            return currentOpenInvoiceIndex;
          });
        };

        const handleToggleInvoice = (index: number) => {
          setOpenInvoiceIndex((currentOpenInvoiceIndex) =>
            currentOpenInvoiceIndex === index ? null : index,
          );
        };

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Laskutus</h1>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__sites-table-wrapper">
                  <FieldArray<LandUseInvoiceRow> name="invoices">
                    {({ fields }) => (
                      <>
                        <table className="landuse-compensations-table">
                          <thead>
                            <tr>
                              <th className="landuse-compensations-table__toggle-cell" />
                              <th>Laskunsaaja</th>
                              <th>Eräpäivä</th>
                              <th>Laskunumero</th>
                              <th>Tyyppi</th>
                              <th>Laskun tila</th>
                              <th>Laskutettu</th>
                              <th>Maksamatta</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.length > 0 ? (
                              fields.map((fieldName, index) => (
                                <InvoiceRow
                                  key={fieldName}
                                  fieldName={fieldName}
                                  index={index}
                                  isEditMode={isEditMode}
                                  isOpen={openInvoiceIndex === index}
                                  partyOptions={partyOptions}
                                  onRemove={(removeIndex) =>
                                    handleRemoveInvoice(
                                      fields.remove,
                                      removeIndex,
                                    )
                                  }
                                  onToggle={handleToggleInvoice}
                                />
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8}>Ei laskuja.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {isEditMode && (
                          <div>
                            <Button
                              type="button"
                              variant={ButtonVariant.Supplementary}
                              iconStart={<IconPlusCircleFill />}
                              onClick={() =>
                                handleAddInvoice(fields.push, fields.length)
                              }
                            >
                              Lisää lasku
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </FieldArray>
                </div>
              </Fieldset>
            </div>
          </form>
        );
      }}
    />
  );
};
