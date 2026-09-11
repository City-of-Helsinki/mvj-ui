import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
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
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  LAND_USE_INVOICE_STATUSES,
  landUseInvoiceItemTypeSelectOptions,
  landUseInvoiceTypeSelectOptions,
  type LandUseInvoice,
  type LandUseInvoiceItem,
  type LandUseInvoiceStatus,
} from "../../options";
import {
  getFieldTextValue,
  getOptionsDisplayValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "../../utils/fieldUtils";
import { getSchedulesPendingInvoiceReview } from "../../utils/invoiceReview";
import {
  formatLandUseEuroDisplayValue,
  parseLandUseNumericValueOrZero,
} from "../../utils/number";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import type {
  BasePartyDetails,
  BillingDetails,
  CompanyPartyDetails,
} from "./LandUseParties";
import type { LandUsePaymentScheduleEntry } from "./LandUsePaymentSchedule";

type BillingPartyDetails = Pick<
  BasePartyDetails,
  "name" | "partyType" | "streetAddress" | "city" | "postalCode"
> & { businessId?: CompanyPartyDetails["businessId"] };

export interface LandUseBillingParty {
  party: { details: BillingPartyDetails };
  invoiceRecipient?: { details: BillingPartyDetails };
  billingDetails: Pick<BillingDetails, "ovtCode" | "reference">;
}

export type LandUseBillingScheduleInstallment = Pick<
  LandUseInvoice,
  | "recipientPartyIndex"
  | "installmentNumber"
  | "installmentTotal"
  | "dueDate"
  | "type"
  | "invoiceItems"
>;

export type LandUseBillingSchedule = Pick<
  LandUsePaymentScheduleEntry,
  "id" | "recipientPartyIndex" | "status"
> & { installments: LandUseBillingScheduleInstallment[] };

export interface LandUseBillingFormValues {
  invoices?: LandUseBillingInvoice[];
}

export interface LandUseBillingInvoice extends Pick<
  LandUseInvoice,
  | "recipientPartyIndex"
  | "installmentNumber"
  | "installmentTotal"
  | "dueDate"
  | "invoiceNumber"
  | "type"
  | "status"
  | "sentAt"
  | "billedAmount"
  | "remainingAmount"
  | "invoiceItems"
> {
  sourcePaymentScheduleId?: string;
  sourceInstallmentIndex?: number;
}

interface LandUseBillingProps {
  form: FormApi<LandUseBillingFormValues>;
  isEditMode: boolean;
  parties: LandUseBillingParty[];
  paymentSchedules: LandUseBillingSchedule[];
  onAcceptSchedule: (schedule: LandUseBillingSchedule) => void;
  onDeclineSchedule: (schedule: LandUseBillingSchedule) => void;
}

interface SelectedPartyInvoiceData {
  streetAddress: string;
  city: string;
  postalCode: string;
  ovtCode: string;
  reference: string;
  businessId: string;
  isCompany: boolean;
}

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

function isInvoiceEditableBasedOnStatus(
  invoice: Pick<LandUseInvoice, "status"> | undefined,
): boolean {
  if (!invoice || !invoice.status) return true;
  const editableStatuses: LandUseInvoiceStatus[] = [
    LAND_USE_INVOICE_STATUSES.DRAFT,
    LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL,
  ];

  return editableStatuses.includes(invoice.status);
}

export const isInvoiceContentEditableInBilling = (
  invoice: LandUseBillingInvoice,
): boolean =>
  !invoice.sourcePaymentScheduleId && isInvoiceEditableBasedOnStatus(invoice);

const getPartyName = (value: string | undefined): string => value?.trim() ?? "";

const getInvoiceRecipientLabel = (
  party: LandUseBillingParty,
  index: number,
): string => {
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

const createInvoiceRecipientOptions = (
  parties: LandUseBillingParty[],
): SelectOption[] =>
  parties.map((party, index) => ({
    label: getInvoiceRecipientLabel(party, index),
    value: String(index),
  }));

const getSelectedPartyInvoiceData = (
  recipientPartyIndex: string | undefined,
  parties: LandUseBillingParty[],
): SelectedPartyInvoiceData => {
  const selectedIndex = Number(recipientPartyIndex);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0) {
    return {
      streetAddress: "",
      city: "",
      postalCode: "",
      ovtCode: "",
      reference: "",
      businessId: "",
      isCompany: false,
    };
  }

  const selectedParty = parties[selectedIndex];
  if (!selectedParty) {
    return {
      streetAddress: "",
      city: "",
      postalCode: "",
      ovtCode: "",
      reference: "",
      businessId: "",
      isCompany: false,
    };
  }

  const recipientDetails =
    selectedParty.invoiceRecipient?.details ?? selectedParty.party?.details;
  const isCompany = recipientDetails?.partyType === "yritys";

  return {
    streetAddress: recipientDetails?.streetAddress ?? "",
    city: recipientDetails?.city ?? "",
    postalCode: recipientDetails?.postalCode ?? "",
    ovtCode: selectedParty.billingDetails?.ovtCode ?? "",
    reference: selectedParty.billingDetails?.reference ?? "",
    businessId:
      isCompany && "businessId" in recipientDetails
        ? (recipientDetails.businessId ?? "")
        : "",
    isCompany,
  };
};

const createEmptyInvoiceTableRow = (
  recipientPartyIndex: string | undefined,
): LandUseBillingInvoice => ({
  recipientPartyIndex,
  installmentNumber: "",
  installmentTotal: "",
  dueDate: "",
  invoiceNumber: "",
  type: undefined,
  status: "Luonnos",
  sentAt: "",
  billedAmount: "",
  remainingAmount: "",
  invoiceItems: [],
});

const createEmptyInvoiceItemRow = (): LandUseInvoiceItem => ({
  itemType: "",
  description: "",
  amountExcludingVat: "",
});

const getInvoiceStatusAction = (
  status: LandUseInvoiceStatus | undefined,
): { buttonLabel: string; nextStatus: LandUseInvoiceStatus } | null => {
  if (status === LAND_USE_INVOICE_STATUSES.DRAFT) {
    return {
      buttonLabel: "Merkitse valmiiksi",
      nextStatus: LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL,
    };
  }

  if (status === LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL) {
    return {
      buttonLabel: "Hyväksy ja lähetä",
      nextStatus: LAND_USE_INVOICE_STATUSES.OPEN,
    };
  }

  return null;
};

interface InvoiceTableRowProps {
  fieldName: string;
  index: number;
  isEditMode: boolean;
  isExistingInvoice: boolean;
  isOpen: boolean;
  parties: LandUseBillingParty[];
  partyOptions: SelectOption[];
  isInvoiceTableRowEditable: boolean;
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

const getSentAtTimestamp = (): string => new Date().toISOString();

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({
  fieldName,
  index,
  isEditMode,
  isOpen,
  parties,
  partyOptions,
  onRemove,
  onToggle,
}) => {
  return (
    <Field name={fieldName} subscription={{ value: true }}>
      {({ input }) => {
        const invoice = (input.value ?? {}) as LandUseBillingInvoice;
        const installmentDisplayValue =
          invoice.installmentNumber && invoice.installmentTotal
            ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
            : "-";
        const selectedPartyData = getSelectedPartyInvoiceData(
          invoice.recipientPartyIndex,
          parties,
        );
        const canEditInvoiceContent =
          isEditMode && isInvoiceContentEditableInBilling(invoice);

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
                {getOptionsDisplayValue(
                  invoice.recipientPartyIndex,
                  partyOptions,
                )}
              </td>
              <td>{readOnlyTextValue(installmentDisplayValue)}</td>
              <td>{readOnlyTextValue(invoice.dueDate)}</td>
              <td>{readOnlyTextValue(invoice.invoiceNumber)}</td>
              <td>{readOnlyTextValue(invoice.type)}</td>
              <td>{readOnlyTextValue(invoice.status)}</td>
              <td>{formatLandUseEuroDisplayValue(invoice.billedAmount)}</td>
              <td>{formatLandUseEuroDisplayValue(invoice.remainingAmount)}</td>
            </tr>
            {isOpen && (
              <tr className="landuse-compensations-table__detail-row">
                <td colSpan={9}>
                  <div
                    className="landuse-compensations-table__detail-content"
                    aria-label={`Laskun ${invoice.invoiceNumber || index + 1} tiedot`}
                  >
                    <div className="landuse-grid landuse-grid__bottom-margin">
                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.type`}>
                          {({ input: typeInput }) =>
                            canEditInvoiceContent ? (
                              <Select
                                id={`landuse-billing-type-${index}`}
                                options={landUseInvoiceTypeSelectOptions}
                                value={normalizeSelectValue(typeInput.value)}
                                onChange={(selectedOptions) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    typeInput.onChange,
                                  )
                                }
                                texts={{
                                  label: "Laskun tyyppi",
                                  placeholder: "Valitse",
                                }}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-billing-type-${index}`}
                                label="Laskun tyyppi"
                                value={readOnlyTextValue(typeInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.recipientPartyIndex`}>
                          {({ input: recipientInput }) =>
                            canEditInvoiceContent ? (
                              <Select
                                id={`landuse-billing-recipient-${index}`}
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
                                id={`landuse-billing-recipient-${index}`}
                                label="Laskunsaaja"
                                value={getOptionsDisplayValue(
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
                        {selectedPartyData.isCompany && (
                          <TextInput
                            id={`landuse-billing-business-id-${index}`}
                            label="Y-tunnus"
                            value={readOnlyTextValue(
                              selectedPartyData.businessId,
                            )}
                            readOnly
                          />
                        )}
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.dueDate`}>
                          {({ input: dueDateInput }) =>
                            canEditInvoiceContent ? (
                              <DateInput
                                id={`landuse-billing-due-date-${index}`}
                                label="Eräpäivä"
                                value={dueDateInput.value}
                                onChange={dueDateInput.onChange}
                                placeholder="DD.MM.YYYY"
                                language="fi"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-billing-due-date-${index}`}
                                label="Eräpäivä"
                                value={readOnlyTextValue(dueDateInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-billing-street-address-${index}`}
                          label="Katuosoite"
                          value={readOnlyTextValue(
                            selectedPartyData.streetAddress,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-billing-city-${index}`}
                          label="Postitoimipaikka"
                          value={readOnlyTextValue(selectedPartyData.city)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-billing-postal-code-${index}`}
                          label="Postinumero"
                          value={readOnlyTextValue(
                            selectedPartyData.postalCode,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-billing-ovt-code-${index}`}
                          label="OVT-tunnus"
                          value={readOnlyTextValue(selectedPartyData.ovtCode)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-billing-reference-${index}`}
                          label="Asiakkaan viite"
                          value={readOnlyTextValue(selectedPartyData.reference)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-1">
                        <Field name={`${fieldName}.installmentNumber`}>
                          {({ input: installmentNumberInput }) =>
                            canEditInvoiceContent ? (
                              <NumberInput
                                id={`landuse-billing-installment-number-${index}`}
                                label="Laskutuserä"
                                value={installmentNumberInput.value}
                                onChange={installmentNumberInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-billing-installment-number-${index}`}
                                label="Laskutuserä"
                                value={readOnlyTextValue(
                                  installmentNumberInput.value,
                                )}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-2">
                        <Field name={`${fieldName}.installmentTotal`}>
                          {({ input: installmentTotalInput }) =>
                            canEditInvoiceContent ? (
                              <NumberInput
                                id={`landuse-billing-installment-total-${index}`}
                                label="Laskutuseriä yhteensä"
                                value={installmentTotalInput.value}
                                onChange={installmentTotalInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-billing-installment-total-${index}`}
                                label="Laskutuseriä yhteensä"
                                value={readOnlyTextValue(
                                  installmentTotalInput.value,
                                )}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3 landuse-compensations-table__field--background-coat-of-arms-light">
                        <Field name={`${fieldName}.status`}>
                          {({ input: statusInput }) =>
                            (() => {
                              const statusAction = getInvoiceStatusAction(
                                statusInput.value,
                              );

                              return (
                                <>
                                  <TextInput
                                    id={`landuse-billing-status-${index}`}
                                    label="Laskun tila"
                                    value={readOnlyTextValue(statusInput.value)}
                                    readOnly
                                  />
                                  {isEditMode && statusAction && (
                                    <div>
                                      <Button
                                        type="button"
                                        variant={ButtonVariant.Primary}
                                        size={ButtonSize.Small}
                                        onClick={() => {
                                          const nextSentAtValue =
                                            statusAction.nextStatus === "Avoin"
                                              ? getSentAtTimestamp()
                                              : (invoice.sentAt ?? "");
                                          if (
                                            statusAction.nextStatus === "Avoin"
                                          ) {
                                            const invoiceAmount =
                                              invoice.invoiceItems?.reduce(
                                                (sum, item) => {
                                                  const amount = Number(
                                                    item.amountExcludingVat,
                                                  );
                                                  return sum + amount;
                                                },
                                                0,
                                              );
                                            input.onChange({
                                              ...invoice,
                                              status: statusAction.nextStatus,
                                              sentAt: nextSentAtValue,
                                              invoiceNumber:
                                                Date.now().toString(),
                                              billedAmount: invoiceAmount,
                                              remainingAmount: invoiceAmount,
                                            });
                                          } else {
                                            input.onChange({
                                              ...invoice,
                                              status: statusAction.nextStatus,
                                              sentAt: nextSentAtValue,
                                            });
                                          }
                                        }}
                                      >
                                        {statusAction.buttonLabel}
                                      </Button>
                                    </div>
                                  )}
                                </>
                              );
                            })()
                          }
                        </Field>
                      </div>
                    </div>

                    <Fieldset heading="Reskontra">
                      <div className="landuse-grid landuse-grid__bottom-margin">
                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <Field name={`${fieldName}.invoiceNumber`}>
                            {({ input: invoiceNumberInput }) => (
                              <TextInput
                                id={`landuse-billing-invoice-number-${index}`}
                                label="Laskunumero"
                                value={getFieldTextValue(
                                  canEditInvoiceContent,
                                  invoiceNumberInput.value,
                                )}
                                onChange={invoiceNumberInput.onChange}
                                readOnly={!canEditInvoiceContent}
                              />
                            )}
                          </Field>
                        </div>
                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <Field name={`${fieldName}.billedAmount`}>
                            {({ input: billedAmountInput }) => (
                              <NumericDecimalInput
                                id={`landuse-billing-billed-amount-${index}`}
                                label="Laskutettu"
                                isEditMode={canEditInvoiceContent}
                                value={billedAmountInput.value}
                                unit="€"
                                onChange={billedAmountInput.onChange}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <TextInput
                            id={`landuse-billing-sent-at-${index}`}
                            label="Lähetetty laskutukseen"
                            value={readOnlyTextValue(invoice.sentAt)}
                            readOnly
                          />
                        </div>

                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <Field name={`${fieldName}.remainingAmount`}>
                            {({ input: remainingAmountInput }) => (
                              <NumericDecimalInput
                                id={`landuse-billing-remaining-amount-${index}`}
                                label="Maksamatta"
                                isEditMode={canEditInvoiceContent}
                                value={remainingAmountInput.value}
                                unit="€"
                                onChange={remainingAmountInput.onChange}
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                    </Fieldset>
                    <div className="landuse-grid">
                      <div className="landuse-grid__column-12">
                        <Fieldset heading="Laskurivit">
                          <FieldArray<LandUseInvoiceItem>
                            name={`${fieldName}.invoiceItems`}
                          >
                            {({ fields: invoiceItemFields }) => (
                              <>
                                {invoiceItemFields.length > 0 ? (
                                  invoiceItemFields.map(
                                    (
                                      invoiceItemFieldName,
                                      invoiceItemIndex,
                                    ) => (
                                      <Card
                                        border
                                        key={invoiceItemFieldName}
                                        style={{ marginBottom: "0.5rem" }}
                                      >
                                        <div className="landuse-grid">
                                          <div
                                            className={
                                              "landuse-grid__column-12"
                                            }
                                          >
                                            <Field
                                              name={`${invoiceItemFieldName}.description`}
                                            >
                                              {({
                                                input: descriptionInput,
                                              }) => (
                                                <TextInput
                                                  id={`landuse-billing-invoice-row-description-${index}-${invoiceItemIndex}`}
                                                  label="Selite"
                                                  value={getFieldTextValue(
                                                    canEditInvoiceContent,
                                                    descriptionInput.value,
                                                  )}
                                                  onChange={
                                                    descriptionInput.onChange
                                                  }
                                                  readOnly={
                                                    !canEditInvoiceContent
                                                  }
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className="landuse-grid__column-2">
                                            <Field
                                              name={`${invoiceItemFieldName}.itemType`}
                                            >
                                              {({ input: itemTypeInput }) =>
                                                canEditInvoiceContent ? (
                                                  <Select
                                                    id={`landuse-billing-invoice-row-item-type-${index}-${invoiceItemIndex}`}
                                                    texts={{
                                                      label:
                                                        "Laskurivin tyyppi",
                                                      placeholder: "Valitse",
                                                    }}
                                                    options={
                                                      landUseInvoiceItemTypeSelectOptions
                                                    }
                                                    value={itemTypeInput.value}
                                                    onChange={(selected) => {
                                                      if (selected.length > 0) {
                                                        itemTypeInput.onChange(
                                                          selected[0].value,
                                                        );
                                                      }
                                                    }}
                                                  />
                                                ) : (
                                                  <TextInput
                                                    id={`landuse-billing-invoice-row-item-type-${index}-${invoiceItemIndex}`}
                                                    label="Laskurivin tyyppi"
                                                    value={readOnlyTextValue(
                                                      itemTypeInput.value,
                                                    )}
                                                    readOnly
                                                  />
                                                )
                                              }
                                            </Field>
                                          </div>

                                          <Field
                                            name={`${invoiceItemFieldName}.amountExcludingVat`}
                                          >
                                            {({ input: amountInput }) => (
                                              <div className="landuse-grid__column-2">
                                                <NumericDecimalInput
                                                  id={`landuse-billing-invoice-row-amount-${index}-${invoiceItemIndex}`}
                                                  label="Veroton summa (€)"
                                                  value={amountInput.value}
                                                  onChange={
                                                    amountInput.onChange
                                                  }
                                                  unit="€"
                                                  isEditMode={
                                                    canEditInvoiceContent
                                                  }
                                                />
                                              </div>
                                            )}
                                          </Field>

                                          {canEditInvoiceContent && (
                                            <div className="landuse-grid__column-2 landuse-compensations-table__detail-actions">
                                              <Button
                                                type="button"
                                                size={ButtonSize.Small}
                                                variant={
                                                  ButtonVariant.Secondary
                                                }
                                                onClick={() =>
                                                  invoiceItemFields.remove(
                                                    invoiceItemIndex,
                                                  )
                                                }
                                              >
                                                Poista rivi
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </Card>
                                    ),
                                  )
                                ) : (
                                  <p>Ei laskurivejä.</p>
                                )}

                                {canEditInvoiceContent && (
                                  <div>
                                    <Button
                                      type="button"
                                      variant={ButtonVariant.Supplementary}
                                      size={ButtonSize.Small}
                                      iconStart={<IconPlusCircleFill />}
                                      onClick={() =>
                                        invoiceItemFields.push(
                                          createEmptyInvoiceItemRow(),
                                        )
                                      }
                                    >
                                      Lisää laskurivi
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </FieldArray>
                        </Fieldset>
                      </div>
                    </div>
                    {/* TODO: Do not allow deleting sent invoices, for now enabled for testing */}
                    {canEditInvoiceContent && (
                      <div className="landuse-compensations-table__detail-actions">
                        <ConfirmDeleteButton
                          id={`billing-delete-${index}`}
                          buttonLabel="Poista lasku"
                          buttonVariant={ButtonVariant.Danger}
                          buttonSize={ButtonSize.Small}
                          onConfirm={() => onRemove(index)}
                          dialogTitle="Poista lasku"
                          dialogContent={`Haluatko varmasti poistaa laskun ${getInvoiceDeleteLabel(invoice.invoiceNumber)}?`}
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

interface InvoiceReviewTableProps {
  schedules: LandUseBillingSchedule[];
  parties: LandUseBillingParty[];
  partyOptions: SelectOption[];
  isEditMode: boolean;
  onAccept: (schedule: LandUseBillingSchedule) => void;
  onDecline: (schedule: LandUseBillingSchedule) => void;
}

const InvoiceReviewTable: React.FC<InvoiceReviewTableProps> = ({
  schedules,
  parties,
  partyOptions,
  isEditMode,
  onAccept,
  onDecline,
}) => {
  const [openInvoice, setOpenInvoice] = useState<string | null>(null);

  return (
    <>
      {schedules.length > 0 ? (
        schedules.map((schedule, scheduleIndex) => {
          const invoiceRecipientIndex =
            schedule.installments[0]?.recipientPartyIndex ??
            schedule.recipientPartyIndex;
          const invoiceRecipientName = getOptionsDisplayValue(
            invoiceRecipientIndex,
            partyOptions,
          );

          return (
            <section key={schedule.id}>
              <h3>{invoiceRecipientName}</h3>
              <div className="landuse-detail__sites-table-wrapper">
                <table className="landuse-compensations-table">
                  <thead>
                    <tr>
                      <th className="landuse-compensations-table__toggle-cell" />
                      <th>Laskunsaaja</th>
                      <th>Laskutuserä</th>
                      <th>Eräpäivä</th>
                      <th>Veroton summa yhteensä</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.installments.map((installment, index) => {
                      const rowId = `${schedule.id}-${index}`;
                      const isOpen = openInvoice === rowId;
                      const selectedPartyData = getSelectedPartyInvoiceData(
                        installment.recipientPartyIndex,
                        parties,
                      );
                      const installmentDisplayValue =
                        installment.installmentNumber &&
                        installment.installmentTotal
                          ? `${installment.installmentNumber}/${installment.installmentTotal}`
                          : "-";
                      const amountExcludingVatTotal =
                        installment.invoiceItems?.reduce(
                          (sum, invoiceItem) =>
                            sum +
                            parseLandUseNumericValueOrZero(
                              invoiceItem.amountExcludingVat,
                            ),
                          0,
                        ) ?? 0;

                      return (
                        <React.Fragment key={rowId}>
                          <tr
                            className="landuse-compensations-table__row"
                            onClick={() =>
                              setOpenInvoice(isOpen ? null : rowId)
                            }
                          >
                            <td className="landuse-compensations-table__toggle-cell">
                              <button
                                type="button"
                                className="landuse-compensations-table__toggle-btn"
                                aria-expanded={isOpen}
                                aria-label={
                                  isOpen
                                    ? "Sulje laskun tiedot"
                                    : "Avaa laskun tiedot"
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
                              {getOptionsDisplayValue(
                                schedule.recipientPartyIndex,
                                partyOptions,
                              )}
                            </td>
                            <td>
                              {readOnlyTextValue(installmentDisplayValue)}
                            </td>
                            <td>{readOnlyTextValue(installment.dueDate)}</td>
                            <td>
                              {formatLandUseEuroDisplayValue(
                                amountExcludingVatTotal,
                              )}
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="landuse-compensations-table__detail-row">
                              <td colSpan={5}>
                                <div
                                  className="landuse-compensations-table__detail-content"
                                  aria-label={`Laskun ${index + 1} tiedot`}
                                >
                                  <div className="landuse-grid landuse-grid__bottom-margin">
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-type-${scheduleIndex}-${index}`}
                                        label="Laskun tyyppi"
                                        value={readOnlyTextValue(
                                          installment.type,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-recipient-${scheduleIndex}-${index}`}
                                        label="Laskunsaaja"
                                        value={getOptionsDisplayValue(
                                          installment.recipientPartyIndex,
                                          partyOptions,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      {selectedPartyData.isCompany && (
                                        <TextInput
                                          id={`landuse-billing-review-business-id-${scheduleIndex}-${index}`}
                                          label="Y-tunnus"
                                          value={readOnlyTextValue(
                                            selectedPartyData.businessId,
                                          )}
                                          readOnly
                                        />
                                      )}
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-due-date-${scheduleIndex}-${index}`}
                                        label="Eräpäivä"
                                        value={readOnlyTextValue(
                                          installment.dueDate,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-street-address-${scheduleIndex}-${index}`}
                                        label="Katuosoite"
                                        value={readOnlyTextValue(
                                          selectedPartyData.streetAddress,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-city-${scheduleIndex}-${index}`}
                                        label="Postitoimipaikka"
                                        value={readOnlyTextValue(
                                          selectedPartyData.city,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-postal-code-${scheduleIndex}-${index}`}
                                        label="Postinumero"
                                        value={readOnlyTextValue(
                                          selectedPartyData.postalCode,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-ovt-code-${scheduleIndex}-${index}`}
                                        label="OVT-tunnus"
                                        value={readOnlyTextValue(
                                          selectedPartyData.ovtCode,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-3">
                                      <TextInput
                                        id={`landuse-billing-review-reference-${scheduleIndex}-${index}`}
                                        label="Asiakkaan viite"
                                        value={readOnlyTextValue(
                                          selectedPartyData.reference,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-1">
                                      <TextInput
                                        id={`landuse-billing-review-installment-number-${scheduleIndex}-${index}`}
                                        label="Laskutuserä"
                                        value={readOnlyTextValue(
                                          installment.installmentNumber,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                    <div className="landuse-grid__column-2">
                                      <TextInput
                                        id={`landuse-billing-review-installment-total-${scheduleIndex}-${index}`}
                                        label="Laskutuseriä yhteensä"
                                        value={readOnlyTextValue(
                                          installment.installmentTotal,
                                        )}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                  <Fieldset heading="Laskurivit">
                                    {installment.invoiceItems?.length ? (
                                      installment.invoiceItems.map(
                                        (invoiceItem, invoiceItemIndex) => (
                                          <Card
                                            border
                                            key={`${rowId}-${invoiceItemIndex}`}
                                            style={{ marginBottom: "0.5rem" }}
                                          >
                                            <div
                                              key={`${rowId}-${invoiceItemIndex}`}
                                              className="landuse-grid"
                                            >
                                              <div className="landuse-grid__column-12">
                                                <TextInput
                                                  id={`landuse-billing-review-description-${scheduleIndex}-${index}-${invoiceItemIndex}`}
                                                  label="Selite"
                                                  value={readOnlyTextValue(
                                                    invoiceItem.description,
                                                  )}
                                                  readOnly
                                                />
                                              </div>
                                              <div className="landuse-grid__column-2">
                                                <TextInput
                                                  id={`landuse-billing-review-item-type-${scheduleIndex}-${index}-${invoiceItemIndex}`}
                                                  label="Laskurivin tyyppi"
                                                  value={readOnlyTextValue(
                                                    invoiceItem.itemType,
                                                  )}
                                                  readOnly
                                                />
                                              </div>
                                              <div className="landuse-grid__column-2">
                                                <NumericDecimalInput
                                                  id={`landuse-billing-review-amount-${scheduleIndex}-${index}-${invoiceItemIndex}`}
                                                  label="Veroton summa (€)"
                                                  value={
                                                    invoiceItem.amountExcludingVat
                                                  }
                                                  unit="€"
                                                  isEditMode={false}
                                                />
                                              </div>
                                            </div>
                                          </Card>
                                        ),
                                      )
                                    ) : (
                                      <p>Ei laskurivejä.</p>
                                    )}
                                  </Fieldset>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {isEditMode && (
                <div className="landuse-compensations-table__detail-actions">
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    size={ButtonSize.Small}
                    onClick={() => onDecline(schedule)}
                  >
                    Hylkää kaikki
                  </Button>
                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    size={ButtonSize.Small}
                    onClick={() => onAccept(schedule)}
                  >
                    Hyväksy kaikki ja luo laskut
                  </Button>
                </div>
              )}
            </section>
          );
        })
      ) : (
        <p>Ei hyväksyttäviä maksusuunnitelmia.</p>
      )}
    </>
  );
};

export const LandUseBilling: React.FC<LandUseBillingProps> = ({
  form,
  isEditMode,
  parties,
  paymentSchedules,
  onAcceptSchedule,
  onDeclineSchedule,
}) => {
  const [openInvoiceIndex, setOpenInvoiceIndex] = useState<number | null>(null);

  const partyOptions = React.useMemo(
    () => createInvoiceRecipientOptions(parties ?? []),
    [parties],
  );
  const schedulesPendingReview =
    getSchedulesPendingInvoiceReview(paymentSchedules);

  return (
    <Form<LandUseBillingFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit }) => {
        const existingInvoices =
          (
            form.getState().initialValues as
              LandUseBillingFormValues | undefined
          )?.invoices ?? [];

        const handleAddInvoice = (
          push: (value: LandUseBillingInvoice) => void,
          currentLength: number,
        ) => {
          push(createEmptyInvoiceTableRow(partyOptions[0]?.value));
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
          <div className="landuse-detail__content">
            <h1>Laskutus ja reskontra</h1>
            <h2>Hyväksymistä odottavat maksusuunnitelmat</h2>
            <InvoiceReviewTable
              schedules={schedulesPendingReview}
              parties={parties}
              partyOptions={partyOptions}
              isEditMode={isEditMode}
              onAccept={onAcceptSchedule}
              onDecline={onDeclineSchedule}
            />
            <h2>Laskut</h2>
            <form onSubmit={handleSubmit}>
              <Fieldset
                heading=""
                className="landuse-detail__fieldset--with-margin"
              >
                <div className="landuse-detail__sites-table-wrapper">
                  <FieldArray<LandUseBillingInvoice> name="invoices">
                    {({ fields }) => (
                      <>
                        <table className="landuse-compensations-table">
                          <thead>
                            <tr>
                              <th className="landuse-compensations-table__toggle-cell" />
                              <th>Laskunsaaja</th>
                              <th>Laskutuserä</th>
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
                                <InvoiceTableRow
                                  key={fieldName}
                                  fieldName={fieldName}
                                  index={index}
                                  isEditMode={isEditMode}
                                  isExistingInvoice={Boolean(
                                    existingInvoices[index],
                                  )}
                                  isOpen={openInvoiceIndex === index}
                                  parties={parties}
                                  partyOptions={partyOptions}
                                  isInvoiceTableRowEditable={isInvoiceEditableBasedOnStatus(
                                    existingInvoices[index] as LandUseInvoice,
                                  )}
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
                                <td colSpan={9}>Ei laskuja.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {isEditMode && (
                          <div className="landuse-invoicing__invoice-actions">
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
            </form>
          </div>
        );
      }}
    />
  );
};
