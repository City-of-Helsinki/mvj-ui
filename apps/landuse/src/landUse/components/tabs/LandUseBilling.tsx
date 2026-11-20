import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
  Dialog,
  Fieldset,
  IconAngleDown,
  IconAngleUp,
  IconSize,
  Notification,
  TextArea,
  TextInput,
} from "hds-react";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useLandUseMetadata } from "@/landUse/api/useLandUseMetadata";
import { type Invoice, type InvoiceItem } from "@/landUse/options";
import {
  getOptionsDisplayValue,
  readOnlyTextValue,
  type SelectOption,
} from "@/landUse/utils/fieldUtils";
import { getSchedulesPendingInvoiceReview } from "@/landUse/utils/invoiceReview";
import {
  formatLandUseEuroDisplayValue,
  parseLandUseNumericValueOrZero,
} from "@/landUse/utils/number";
import type {
  BasePartyDetails,
  BillingDetails,
  CompanyPartyDetails,
} from "@/landUse/components/tabs/LandUseParties";
import type { PaymentScheduleEntry } from "@/landUse/components/tabs/LandUsePaymentSchedule";
import { SelectedPartyInvoiceData } from "@/landUse/api/landUseTypes";

type BillingPartyDetails = Pick<
  BasePartyDetails,
  "name" | "partyType" | "streetAddress" | "city" | "postalCode"
> & { businessId?: CompanyPartyDetails["businessId"] };

export interface BillingParty {
  id?: string;
  party: { details: BillingPartyDetails };
  invoiceRecipient?: { details: BillingPartyDetails };
  billingDetails: Pick<
    BillingDetails,
    "ovtCode" | "reference" | "sapCustomerNumber"
  >;
}

export type BillingScheduleInstallment = Pick<
  Invoice,
  | "id"
  | "recipientPartyIndex"
  | "installmentNumber"
  | "installmentTotal"
  | "dueDate"
  | "type"
> & { id: string; items?: InvoiceItem[] };

export type BillingSchedule = Pick<
  PaymentScheduleEntry,
  "id" | "recipientPartyIndex" | "status"
> & {
  allInstallmentInvoicesSent: boolean;
  installments: BillingScheduleInstallment[];
};

export interface LandUseBillingFormValues {
  invoices?: BillingInvoice[];
}

export interface BillingInvoice extends Pick<
  Invoice,
  | "id"
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
  | "payments"
> {
  sourceInstallmentId?: string;
  recipientSnapshot?: SelectedPartyInvoiceData;
}

interface LandUseBillingProps {
  form: FormApi<LandUseBillingFormValues>;

  canReviewSchedules: boolean;
  parties: BillingParty[];
  paymentSchedules: BillingSchedule[];
  onAcceptSchedule: (schedule: BillingSchedule) => void;
  onDeclineSchedule: (
    schedule: BillingSchedule,
    rejectedReason: string,
  ) => void;
}

const getPartyName = (value: string | undefined): string => value?.trim() ?? "";

const getInvoiceRecipientLabel = (
  party: BillingParty,
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
  parties: BillingParty[],
): SelectOption[] =>
  parties
    .filter((party) => party.id)
    .map((party, index) => ({
      label: getInvoiceRecipientLabel(party, index),
      value: party.id!,
    }));

const getSelectedPartyInvoiceData = (
  recipientPartyIndex: string | undefined,
  parties: BillingParty[],
): SelectedPartyInvoiceData => {
  if (!recipientPartyIndex) {
    return {
      streetAddress: "",
      city: "",
      postalCode: "",
      ovtCode: "",
      reference: "",
      sapCustomerNumber: "",
      businessId: "",
      isCompany: false,
    };
  }

  const selectedParty = parties.find(
    (party) => party.id === recipientPartyIndex,
  );
  if (!selectedParty) {
    return {
      streetAddress: "",
      city: "",
      postalCode: "",
      ovtCode: "",
      reference: "",
      sapCustomerNumber: "",
      businessId: "",
      isCompany: false,
    };
  }

  const recipientDetails =
    selectedParty.invoiceRecipient?.details ?? selectedParty.party?.details;
  const isCompany = recipientDetails?.partyType === "company";

  return {
    streetAddress: recipientDetails?.streetAddress ?? "",
    city: recipientDetails?.city ?? "",
    postalCode: recipientDetails?.postalCode ?? "",
    ovtCode: selectedParty.billingDetails?.ovtCode ?? "",
    reference: selectedParty.billingDetails?.reference ?? "",
    sapCustomerNumber: selectedParty.billingDetails?.sapCustomerNumber ?? "",
    businessId:
      isCompany && "businessId" in recipientDetails
        ? (recipientDetails.businessId ?? "")
        : "",
    isCompany,
  };
};

interface InvoiceTableRowProps {
  fieldName: string;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({
  fieldName,
  index,
  isOpen,
  onToggle,
}) => {
  const metadataQuery = useLandUseMetadata();
  const invoiceTypeOptions = metadataQuery.data?.invoice_types ?? [];
  const invoiceItemTypeOptions = metadataQuery.data?.invoice_item_types ?? [];
  return (
    <Field name={fieldName} subscription={{ value: true }}>
      {({ input }) => {
        const invoice = (input.value ?? {}) as BillingInvoice;
        const installmentDisplayValue =
          invoice.installmentNumber && invoice.installmentTotal
            ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
            : "-";
        const selectedPartyData: Partial<SelectedPartyInvoiceData> =
          invoice.recipientSnapshot ?? {};

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
              <td>{readOnlyTextValue(selectedPartyData?.name)}</td>
              <td>{readOnlyTextValue(installmentDisplayValue)}</td>
              <td>{readOnlyTextValue(invoice.dueDate)}</td>
              <td>
                {invoice.invoiceNumber === undefined
                  ? "-"
                  : String(invoice.invoiceNumber)}
              </td>
              <td>
                {getOptionsDisplayValue(invoice.type, invoiceTypeOptions)}
              </td>
              <td>
                {getOptionsDisplayValue(
                  invoice.status,
                  metadataQuery.data?.invoice_statuses ?? [],
                )}
              </td>
              <td>{formatLandUseEuroDisplayValue(invoice.billedAmount)}</td>
              <td>{formatLandUseEuroDisplayValue(invoice.remainingAmount)}</td>
            </tr>
            {isOpen && (
              <tr className="landuse-compensations-table__detail-row">
                <td colSpan={9}>
                  <div
                    className="landuse-compensations-table__detail-content"
                    aria-label={`Laskun ${invoice.invoiceNumber ?? index + 1} tiedot`}
                  >
                    <div className="landuse-grid landuse-grid__bottom-margin">
                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.type`}>
                          {({ input: typeInput }) => (
                            <TextInput
                              id={`landuse-billing-type-${index}`}
                              label="Laskun tyyppi"
                              value={getOptionsDisplayValue(
                                typeInput.value,
                                invoiceTypeOptions,
                              )}
                              readOnly
                            />
                          )}
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.recipientPartyIndex`}>
                          {() => (
                            <TextInput
                              id={`landuse-billing-recipient-${index}`}
                              label="Laskunsaaja"
                              value={readOnlyTextValue(selectedPartyData?.name)}
                              readOnly
                            />
                          )}
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
                          {({ input: dueDateInput }) => (
                            <TextInput
                              id={`landuse-billing-due-date-${index}`}
                              label="Eräpäivä"
                              value={readOnlyTextValue(dueDateInput.value)}
                              readOnly
                            />
                          )}
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
                          id={`landuse-billing-sap-customer-number-${index}`}
                          label="SAP-asiakasnumero"
                          value={readOnlyTextValue(
                            selectedPartyData.sapCustomerNumber,
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
                          {({ input: installmentNumberInput }) => (
                            <TextInput
                              id={`landuse-billing-installment-number-${index}`}
                              label="Laskutuserä"
                              value={readOnlyTextValue(
                                installmentNumberInput.value,
                              )}
                              readOnly
                            />
                          )}
                        </Field>
                      </div>

                      <div className="landuse-grid__column-2">
                        <Field name={`${fieldName}.installmentTotal`}>
                          {({ input: installmentTotalInput }) => (
                            <TextInput
                              id={`landuse-billing-installment-total-${index}`}
                              label="Laskutuseriä yhteensä"
                              value={readOnlyTextValue(
                                installmentTotalInput.value,
                              )}
                              readOnly
                            />
                          )}
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3 landuse-compensations-table__field--background-coat-of-arms-light">
                        <Field name={`${fieldName}.status`}>
                          {({ input: statusInput }) =>
                            (() => {
                              return (
                                <TextInput
                                  id={`landuse-billing-status-${index}`}
                                  label="Laskun tila"
                                  value={getOptionsDisplayValue(
                                    statusInput.value,
                                    metadataQuery.data?.invoice_statuses ?? [],
                                  )}
                                  readOnly
                                />
                              );
                            })()
                          }
                        </Field>
                      </div>
                    </div>

                    <Fieldset heading="Reskontra">
                      <div className="landuse-grid landuse-grid__bottom-margin">
                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <TextInput
                            inputMode="text"
                            id={`landuse-billing-invoice-number-${index}`}
                            label="Laskunumero"
                            value={
                              invoice.invoiceNumber === undefined
                                ? "-"
                                : String(invoice.invoiceNumber)
                            }
                            readOnly
                          />
                        </div>
                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <Field name={`${fieldName}.billedAmount`}>
                            {({ input: billedAmountInput }) => (
                              <NumericDecimalInput
                                id={`landuse-billing-billed-amount-${index}`}
                                label="Laskutettu"
                                isEditMode={false}
                                value={billedAmountInput.value}
                                unit="€"
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                          <TextInput
                            id={`landuse-billing-sent-at-${index}`}
                            label="Lähetetty SAP:iin"
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
                                isEditMode={false}
                                value={remainingAmountInput.value}
                                unit="€"
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                    </Fieldset>
                    {(invoice.payments?.length ?? 0) > 0 && (
                      <Fieldset heading="Maksusuoritukset">
                        <div className="landuse-detail__sites-table-wrapper">
                          <table className="landuse-compensations-table">
                            <thead>
                              <tr>
                                <th>Maksupäivä</th>
                                <th>Maksettu</th>
                                <th>Arkistointitunnus</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.payments?.map((payment) => (
                                <tr key={payment.id}>
                                  <td>{payment.paidDate}</td>
                                  <td>
                                    {formatLandUseEuroDisplayValue(
                                      payment.paidAmount,
                                    )}
                                  </td>
                                  <td>{payment.filingCode}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Fieldset>
                    )}
                    <div className="landuse-grid">
                      <div className="landuse-grid__column-12">
                        <Fieldset heading="Laskurivit">
                          <FieldArray<InvoiceItem>
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
                                                  inputMode="text"
                                                  id={`landuse-billing-invoice-row-description-${index}-${invoiceItemIndex}`}
                                                  label="Selite"
                                                  value={readOnlyTextValue(
                                                    descriptionInput.value,
                                                  )}

                                                  readOnly
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <div className="landuse-grid__column-2">
                                            <Field
                                              name={`${invoiceItemFieldName}.itemType`}
                                            >
                                              {({ input: itemTypeInput }) => (
                                                <TextInput
                                                  id={`landuse-billing-invoice-row-item-type-${index}-${invoiceItemIndex}`}
                                                  label="Laskurivin tyyppi"
                                                  value={getOptionsDisplayValue(
                                                    itemTypeInput.value,
                                                    invoiceItemTypeOptions,
                                                  )}
                                                  readOnly
                                                />
                                              )}
                                            </Field>
                                          </div>

                                          <Field
                                            name={`${invoiceItemFieldName}.amountExcludingVat`}
                                          >
                                            {({ input: amountInput }) => (
                                              <div className="landuse-grid__column-2">
                                                <NumericDecimalInput
                                                  id={`landuse-billing-invoice-row-amount-${index}-${invoiceItemIndex}`}
                                                  label="Summa (€)"
                                                  value={amountInput.value}

                                                  unit="€"
                                                  isEditMode={false}
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                      </Card>
                                    ),
                                  )
                                ) : (
                                  <p>Ei laskurivejä.</p>
                                )}
                              </>
                            )}
                          </FieldArray>
                        </Fieldset>
                      </div>
                    </div>
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
  schedules: BillingSchedule[];
  parties: BillingParty[];
  partyOptions: SelectOption[];

  canReviewSchedules: boolean;
  onAccept: (schedule: BillingSchedule) => void;
  onDecline: (schedule: BillingSchedule, rejectedReason: string) => void;
}

const InvoiceReviewTable: React.FC<InvoiceReviewTableProps> = ({
  schedules,
  parties,
  partyOptions,
  canReviewSchedules,
  onAccept,
  onDecline,
}) => {
  const metadataQuery = useLandUseMetadata();
  const [openInvoice, setOpenInvoice] = useState<string | null>(null);
  const [scheduleToAccept, setScheduleToAccept] =
    useState<BillingSchedule | null>(null);
  const [scheduleToDecline, setScheduleToDecline] =
    useState<BillingSchedule | null>(null);
  const [rejectedReason, setRejectedReason] = useState("");

  const closeAcceptDialog = () => {
    setScheduleToAccept(null);
  };

  const handleAcceptConfirm = () => {
    if (!scheduleToAccept || scheduleToAccept.allInstallmentInvoicesSent)
      return;

    onAccept(scheduleToAccept);
    closeAcceptDialog();
  };

  const closeDeclineDialog = () => {
    setScheduleToDecline(null);
    setRejectedReason("");
  };

  const handleDeclineConfirm = () => {
    if (!scheduleToDecline || scheduleToDecline.allInstallmentInvoicesSent)
      return;

    onDecline(scheduleToDecline, rejectedReason);
    closeDeclineDialog();
  };

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
              {schedule.allInstallmentInvoicesSent && (
                <Notification type="error">
                  Kaikki maksusuunnitelman laskut on jo lähetetty SAP:iin.
                </Notification>
              )}
              <div className="landuse-detail__sites-table-wrapper">
                <table className="landuse-compensations-table">
                  <thead>
                    <tr>
                      <th className="landuse-compensations-table__toggle-cell" />
                      <th>Laskunsaaja</th>
                      <th>Laskutuserä</th>
                      <th>Eräpäivä</th>
                      <th>Summa yhteensä</th>
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
                        installment.items?.reduce(
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
                                        value={getOptionsDisplayValue(
                                          installment.type,
                                          metadataQuery.data?.invoice_types ??
                                            [],
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
                                        id={`landuse-billing-review-sap-customer-number-${scheduleIndex}-${index}`}
                                        label="SAP-asiakasnumero"
                                        value={readOnlyTextValue(
                                          selectedPartyData.sapCustomerNumber,
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
                                    {installment.items?.length ? (
                                      installment.items.map(
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
                                                  value={getOptionsDisplayValue(
                                                    invoiceItem.itemType,
                                                    metadataQuery.data
                                                      ?.invoice_item_types ??
                                                      [],
                                                  )}
                                                  readOnly
                                                />
                                              </div>
                                              <div className="landuse-grid__column-2">
                                                <NumericDecimalInput
                                                  id={`landuse-billing-review-amount-${scheduleIndex}-${index}-${invoiceItemIndex}`}
                                                  label="Summa (€)"
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
              {canReviewSchedules && (
                <div className="landuse-compensations-table__detail-actions">
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    size={ButtonSize.Small}
                    disabled={schedule.allInstallmentInvoicesSent}
                    onClick={() => setScheduleToDecline(schedule)}
                  >
                    Hylkää kaikki
                  </Button>
                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    size={ButtonSize.Small}
                    disabled={schedule.allInstallmentInvoicesSent}
                    onClick={() => setScheduleToAccept(schedule)}
                  >
                    Hyväksy maksusuunnitelma ja luo laskut
                  </Button>
                </div>
              )}
            </section>
          );
        })
      ) : (
        <p>Ei hyväksyttäviä maksusuunnitelmia.</p>
      )}
      <Dialog
        id="landuse-accept-payment-schedule"
        isOpen={scheduleToAccept !== null}
        aria-labelledby="landuse-accept-payment-schedule-title"
        closeButtonLabelText="Sulje"
        close={closeAcceptDialog}
      >
        <Dialog.Header
          id="landuse-accept-payment-schedule-title"
          title="Hyväksy maksusuunnitelma"
        />
        <Dialog.Content>
          Hyväksytyistä maksueristä luodaan laskut odottamaan lähettämistä.
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            onClick={closeAcceptDialog}
          >
            Peruuta
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.Primary}
            disabled={scheduleToAccept?.allInstallmentInvoicesSent ?? false}
            onClick={handleAcceptConfirm}
          >
            Hyväksy ja luo laskut
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
      <Dialog
        id="landuse-decline-payment-schedule"
        isOpen={scheduleToDecline !== null}
        aria-labelledby="landuse-decline-payment-schedule-title"
        closeButtonLabelText="Sulje"
        close={closeDeclineDialog}
      >
        <Dialog.Header
          id="landuse-decline-payment-schedule-title"
          title="Hylkää maksusuunnitelma"
        />
        <Dialog.Content>
          <TextArea
            id="landuse-payment-schedule-rejected-reason"
            label="Hylkäyksen syy"
            value={rejectedReason}
            onChange={(event) => setRejectedReason(event.target.value)}
          />
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            onClick={closeDeclineDialog}
          >
            Peruuta
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.Danger}
            disabled={scheduleToDecline?.allInstallmentInvoicesSent ?? false}
            onClick={handleDeclineConfirm}
          >
            Hylkää kaikki
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    </>
  );
};

export const LandUseBilling: React.FC<LandUseBillingProps> = ({
  form,
  canReviewSchedules,
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

              canReviewSchedules={canReviewSchedules}
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
                  <FieldArray<BillingInvoice> name="invoices">
                    {({ fields }) => (
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

                                isOpen={openInvoiceIndex === index}

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
