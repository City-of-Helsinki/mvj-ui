import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  DateInput,
  Dialog,
  Fieldset,
  IconCheckCircleFill,
  IconClock,
  IconCrossCircleFill,
  IconHammers,
  IconLock,
  IconPlusCircle,
  NumberInput,
  Notification,
  Select,
  StatusLabel,
  StepByStep,
  TextInput,
  Tooltip,
  type StatusLabelType,
} from "hds-react";
import React, { useMemo, useState } from "react";
import { Field, Form, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useTocEntries } from "@/landUse/hooks/useTableOfContents";
import {
  AsemakaavaListItem,
  INTEREST_CALCULATION_DAYS_IN_YEAR,
  LAND_USE_INVOICE_ITEM_TYPES,
  LAND_USE_INVOICE_TYPES,
  LAND_USE_PAYMENT_SCHEDULE_STATUSES,
  landUseInvoiceItemTypeSelectOptions,
} from "@/landUse/options";
import {
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "@/landUse/utils/fieldUtils";
import { calculateInvoicingPeriodDays } from "@/landUse/utils/date";
import { formatLandUseEuroDisplayValue } from "@/landUse/utils/number";
import { ConfirmDeleteButton } from "@/landUse/components/ConfirmDeleteButton";
import {
  LAND_USE_INVOICE_STATUSES,
  type LandUseInvoice,
  type LandUseInvoiceItem,
  type LandUsePaymentScheduleStatus,
} from "@/landUse/options";
import type { LandUseContractsFormValues } from "@/landUse/components/tabs/LandUseContracts";
import type {
  PartyEntry,
  CompanyPartyDetails,
  BillingDetails,
  BasePartyDetails,
} from "@/landUse/components/tabs/LandUseParties";

type ContractItem = NonNullable<
  LandUseContractsFormValues["contracts"]
>[number];

interface ContractOption extends SelectOption {
  sopimusnumero: string;
}

export interface LandUsePaymentScheduleFormValues {
  paymentSchedules?: LandUsePaymentScheduleEntry[];
}

export interface LandUsePaymentScheduleEntry {
  id: string;
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  status: LandUsePaymentScheduleStatus | undefined;
  rejectedReason: string | null;
  signedDate: string;
  korotusProsentti: string;
  korkoPeruskorko: string;
  korkoMarginaali: string;
  daysInYear: string;
  installments: LandUseInvoice[];
}

interface LandUsePaymentScheduleProps {
  form: FormApi<LandUsePaymentScheduleFormValues>;
  isEditMode: boolean;
  parties: PartyEntry[];
  contracts: ContractItem[];
  asemakaavanNumero: AsemakaavaListItem["asemakaavanNumero"];
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
  agreementIdentifier: string;
  onSendToInvoicing: (schedule: LandUsePaymentScheduleEntry) => void;
}

type SelectedPartyInvoiceData = Pick<
  BasePartyDetails,
  "name" | "streetAddress" | "city" | "postalCode"
> &
  Pick<CompanyPartyDetails, "businessId"> &
  Pick<BillingDetails, "ovtCode" | "reference" | "sapCustomerNumber"> & {
    isCompany: boolean;
  };

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

const getSchedulePartyName = (party: PartyEntry, index: number): string => {
  const partyName = getPartyName(party.party?.details?.name);
  return partyName ? partyName : `Osapuoli ${index + 1}`;
};

const createPartyOptions = (parties: PartyEntry[]): SelectOption[] =>
  parties.map((party, index) => ({
    label: getSchedulePartyName(party, index),
    value: String(index),
  }));

const createInvoiceContractOptions = (
  contracts: ContractItem[],
): ContractOption[] =>
  contracts.map((agreement, index) => {
    const contractType = agreement.sopimuksenTyyppi?.trim();
    const contractNumber = agreement.sopimusnumero?.trim() ?? "";
    const parts = [contractType, contractNumber].filter(
      (part): part is string => Boolean(part),
    );

    return {
      label: parts.join(" ") || `Sopimus ${index + 1}`,
      value: String(index),
      sopimusnumero: contractNumber,
    };
  });

const getSelectedPartyInvoiceData = (
  recipientPartyIndex: string | undefined,
  parties: PartyEntry[],
): SelectedPartyInvoiceData => {
  const selectedIndex = Number(recipientPartyIndex);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0) {
    return {
      name: "",
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

  const selectedParty = parties[selectedIndex];
  if (!selectedParty) {
    return {
      name: "",
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
  const isCompany = recipientDetails?.partyType === "yritys";

  return {
    name: recipientDetails?.name ?? "",
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

/**
 * The second invoice row is either a "korotus"
 * or a "korko" (interest, peruskorko + marginaali). Everything that differs
 * between the two variants is derived from a `InterestKind`.
 */
type InterestKind = "korotus" | "korko";

const getInterestKind = (itemType: string): InterestKind | null => {
  if (itemType === LAND_USE_INVOICE_ITEM_TYPES.KOROTUS) return "korotus";
  if (itemType === LAND_USE_INVOICE_ITEM_TYPES.KORKO) return "korko";
  return null;
};

const getRateFieldPath = (
  kind: InterestKind,
  scheduleFieldName: string,
): string =>
  kind === "korotus"
    ? `${scheduleFieldName}.korotusProsentti`
    : `${scheduleFieldName}.korkoPeruskorko`;

// Only korko has a marginaali; korotus is calculated from korotusprosentti alone.
const getMarginFieldPath = (scheduleFieldName: string): string =>
  `${scheduleFieldName}.korkoMarginaali`;

const getInterestPeriodLabels = (
  kind: InterestKind,
): { startLabel: string; endLabel: string } =>
  kind === "korotus"
    ? { startLabel: "Korotuksen alkupäivä", endLabel: "Korotuksen loppupäivä" }
    : { startLabel: "Koron alkupäivä", endLabel: "Koron loppupäivä" };

const formatCalculationLabel = (
  kind: InterestKind,
  rate: string,
  margin: string | null,
  periodDays: number | null,
): string => {
  const days = periodDays !== null ? `${periodDays}` : "-";
  const base = rate || "-";
  if (kind === "korko") {
    return `Laskettu korko (${base}% + ${margin || "-"}%) * ${days} pv`;
  }
  return `Laskettu korotus (${base}%) * ${days} pv`;
};

/** English annual interest calculation: amount × (rate + margin)/100 × days / daysInYear. */
const calculatePeriodRateAmount = ({
  baseAmount,
  rate,
  margin,
  periodDays,
  daysInYear,
}: {
  baseAmount: string;
  rate: string;
  margin: string | null;
  periodDays: number | null;
  daysInYear: string;
}): number | null => {
  if (periodDays === null || periodDays <= 0) return null;
  const parsedAmount = parseFloat(baseAmount);
  const parsedRate = parseFloat(rate);
  const parsedMargin = margin === null ? 0 : parseFloat(margin);
  if (isNaN(parsedAmount) || isNaN(parsedRate) || isNaN(parsedMargin)) {
    return null;
  }
  const parsedDaysInYear = parseFloat(daysInYear) || 365;
  const combinedRate = parsedRate + parsedMargin;
  return (parsedAmount * (combinedRate / 100) * periodDays) / parsedDaysInYear;
};

interface InvoiceItemRowProps {
  itemFieldName: string;
  installmentFieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  itemIndex: number;
  canEdit: boolean;
  periodDays: number | null;
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  itemFieldName,
  installmentFieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  itemIndex,
  canEdit,
  periodDays,
}) => {
  const { input: itemTypeInput } = useField(`${itemFieldName}.itemType`);
  const { input: amountInput } = useField(
    `${itemFieldName}.amountExcludingVat`,
  );
  // Base amount for interest is always the Maankäyttökorvaus row (index 0)
  const { input: baseAmountInput } = useField(
    `${installmentFieldName}.invoiceItems[0].amountExcludingVat`,
  );
  const { input: daysInYearInput } = useField(
    `${scheduleFieldName}.daysInYear`,
  );

  const itemType = itemTypeInput.value;
  const interestKind = getInterestKind(itemType);
  const shouldCalculate = canEdit && interestKind !== null;

  // useField must be called unconditionally; when there's no interest kind the values are unused.
  const { input: rateInput } = useField(
    getRateFieldPath(interestKind ?? "korotus", scheduleFieldName),
  );
  const { input: marginInput } = useField(
    getMarginFieldPath(scheduleFieldName),
  );

  const marginForCalculation =
    interestKind === "korko" ? marginInput.value : null;
  const calculated = shouldCalculate
    ? calculatePeriodRateAmount({
        baseAmount: baseAmountInput.value,
        rate: rateInput.value,
        margin: marginForCalculation,
        periodDays,
        daysInYear: daysInYearInput.value,
      })
    : null;

  return (
    <div className="landuse-grid landuse-grid__bottom-margin">
      <div className="landuse-grid__column-2">
        {/* It is expected that there are two items only, if there were more they would be editable. */}
        {canEdit && itemIndex >= 2 ? (
          <Select
            id={`landuse-payment-schedule-invoice-row-item-type-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
            texts={{ label: "Maksun tyyppi", placeholder: "Valitse" }}
            options={landUseInvoiceItemTypeSelectOptions}
            value={itemTypeInput.value}
            onChange={(selected) => {
              if (selected.length > 0) {
                itemTypeInput.onChange(selected[0].value);
              }
            }}
          />
        ) : (
          <TextInput
            id={`landuse-payment-schedule-invoice-row-item-type-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
            label="Maksun tyyppi"
            value={readOnlyTextValue(itemTypeInput.value)}
            readOnly
          />
        )}
      </div>

      <div className="landuse-grid__column-2">
        <NumericDecimalInput
          id={`landuse-payment-schedule-invoice-row-amount-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
          label="Summa (€)"
          value={amountInput.value}
          onChange={amountInput.onChange}
          unit="€"
          isEditMode={canEdit}
        />
      </div>

      {shouldCalculate && interestKind && (
        <>
          <div className="landuse-grid__column-4">
            <TextInput
              id={`landuse-payment-schedule-invoice-row-calc-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
              label={formatCalculationLabel(
                interestKind,
                rateInput.value,
                marginForCalculation,
                periodDays,
              )}
              tooltip={
                <Tooltip
                  tooltipLabel="Päiviä vuodessa selitys"
                  buttonLabel="Näytä päiviä vuodessa selitys"
                  placement="right"
                >
                  Käytössä englantilainen koronlaskutapa. Vuodessa on 365 päivää
                  ja karkausvuotta ei oteta huomioon.
                </Tooltip>
              }
              value={
                calculated !== null
                  ? formatLandUseEuroDisplayValue(calculated)
                  : "-"
              }
              readOnly
            />
          </div>
          <div className="landuse-grid__column-3 landuse-compensations-table__detail-actions">
            <Button
              type="button"
              size={ButtonSize.Small}
              variant={ButtonVariant.Secondary}
              disabled={calculated === null}
              onClick={() => amountInput.onChange(calculated!.toFixed(2))}
            >
              Käytä laskettua arvoa
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const getScheduleStatusAction = (
  status: LandUsePaymentScheduleStatus | undefined,
): { buttonLabel: string; nextStatus: LandUsePaymentScheduleStatus } | null => {
  if (
    status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT ||
    status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED
  ) {
    return {
      buttonLabel: "Siirrä laskutukseen",
      nextStatus: LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
    };
  }
  return null;
};

const getScheduleStatusLabelType = (
  status: LandUsePaymentScheduleStatus | undefined,
): StatusLabelType => {
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.APPROVED) return "success";
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED) return "error";
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL)
    return "info";
  return "neutral";
};

const getScheduleStatusIcon = (
  status: LandUsePaymentScheduleStatus | undefined,
): React.ReactNode => {
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.APPROVED) {
    return <IconCheckCircleFill aria-hidden />;
  }
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED) {
    return <IconCrossCircleFill aria-hidden />;
  }
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL) {
    return <IconClock aria-hidden />;
  }
  if (status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT) {
    return <IconHammers aria-hidden />;
  }
  return null;
};

const isScheduleEditable = (
  status: LandUsePaymentScheduleStatus | undefined,
): boolean =>
  status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT ||
  status === LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED;

interface BulkCreateFormValues {
  installmentTotal: string;
  contractIndex: string | undefined;
  recipientPartyIndex: string | undefined;
  asemakaavanLainvoimaisuusPvm: string;
}

const buildSecondRowSelite = (
  agreementIdentifier: string,
  sopimusnumero: string,
  asemakaavanNumero: string,
  installmentNumber: number,
  installmentTotal: string,
  recipientName: string,
  isFirst: boolean,
): string =>
  `Maankäyttökorvaus ${agreementIdentifier}, ${sopimusnumero}, ${asemakaavanNumero}, ${installmentNumber}/${installmentTotal}, ${recipientName}, ${isFirst ? "Korotus" : "Korko"}`;

const createBulkInvoice = (
  installmentNumber: number,
  values: BulkCreateFormValues,
  signedDate: string,
  agreementIdentifier: string,
  sopimusnumero: string,
  asemakaavanNumero: string,
  recipientName: string,
): LandUseInvoice => ({
  recipientPartyIndex: values.recipientPartyIndex,
  contractIndex: values.contractIndex,
  installmentNumber: String(installmentNumber),
  installmentTotal: values.installmentTotal,
  signedDate,
  asemakaavanLainvoimaisuusPvm: values.asemakaavanLainvoimaisuusPvm,
  dueDate: "",
  laskentajaksonAlkupvm: "",
  laskentajaksonLoppupvm: "",
  invoiceNumber: "",
  type: LAND_USE_INVOICE_TYPES.MAANKAYTTOKORVAUS,
  status: LAND_USE_INVOICE_STATUSES.DRAFT,
  sentAt: "",
  billedAmount: "",
  remainingAmount: "",
  invoiceItems: [
    {
      itemType: LAND_USE_INVOICE_ITEM_TYPES.MAANKAYTTOKORVAUS,
      description: "Maksutuotot maankäyttösopimuksista",
      amountExcludingVat: "",
    },
    {
      itemType:
        installmentNumber === 1
          ? LAND_USE_INVOICE_ITEM_TYPES.KOROTUS
          : LAND_USE_INVOICE_ITEM_TYPES.KORKO,
      description: buildSecondRowSelite(
        agreementIdentifier,
        sopimusnumero,
        asemakaavanNumero,
        installmentNumber,
        values.installmentTotal,
        recipientName,
        installmentNumber === 1,
      ),
      amountExcludingVat: "",
    },
  ],
});

interface BulkCreateInvoicesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BulkCreateFormValues) => void;
  partyOptions: SelectOption[];
  contractOptions: ContractOption[];
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
}

const BulkCreateInvoicesDialog: React.FC<BulkCreateInvoicesDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partyOptions,
  contractOptions,
  asemakaavanLainvoimaisuusPvm: asemakaavanLainvoimaisuusPvmProp,
}) => {
  const [installmentTotal, setInstallmentTotal] = useState<number | "">("");
  const [contractIndex, setContractIndex] = useState<string | undefined>(
    undefined,
  );
  const [recipientPartyIndex, setRecipientPartyIndex] = useState<
    string | undefined
  >(undefined);
  const [
    asemakaavanLainvoimaisuusPvmValue,
    setAsemakaavanLainvoimaisuusPvmValue,
  ] = useState<AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"]>(
    asemakaavanLainvoimaisuusPvmProp,
  );

  const reset = () => {
    setInstallmentTotal("");
    setContractIndex(undefined);
    setRecipientPartyIndex(undefined);
    setAsemakaavanLainvoimaisuusPvmValue(asemakaavanLainvoimaisuusPvmProp);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleBulkInvoiceCreate = () => {
    onSubmit({
      installmentTotal: String(installmentTotal),
      contractIndex,
      recipientPartyIndex,
      asemakaavanLainvoimaisuusPvm: asemakaavanLainvoimaisuusPvmValue,
    });
    reset();
  };

  const isSubmitDisabled =
    installmentTotal === "" ||
    installmentTotal <= 0 ||
    !contractIndex ||
    !recipientPartyIndex;

  return (
    <Dialog
      id="landuse-bulk-create-invoices-schedule"
      isOpen={isOpen}
      aria-labelledby="landuse-bulk-create-invoices-schedule-title"
      closeButtonLabelText="Sulje"
      close={handleClose}
    >
      <Dialog.Header
        id="landuse-bulk-create-invoices-schedule-title"
        title="Syötä maksusuunnitelma"
      />
      <Dialog.Content>
        <div className="landuse-grid">
          <div className="landuse-grid__column-12">
            <Select
              id="bulk-create-recipient-schedule"
              options={partyOptions}
              value={normalizeSelectValue(recipientPartyIndex)}
              onChange={(selected) =>
                handleSelectChange(selected, setRecipientPartyIndex)
              }
              disabled={partyOptions.length === 0}
              texts={{
                label: "Osapuoli",
                placeholder:
                  partyOptions.length > 0 ? "Valitse" : "Ei osapuolia",
              }}
            />
          </div>
          <div className="landuse-grid__column-12">
            <Select
              id="bulk-create-contract-schedule"
              options={contractOptions}
              value={normalizeSelectValue(contractIndex)}
              onChange={(selected) =>
                handleSelectChange(selected, setContractIndex)
              }
              disabled={contractOptions.length === 0}
              texts={{
                label: "Sopimus",
                placeholder:
                  contractOptions.length > 0 ? "Valitse" : "Ei sopimuksia",
              }}
            />
          </div>
          <div className="landuse-grid__column-12">
            <NumberInput
              id="bulk-create-installment-total-schedule"
              label="Maksueriä yhteensä"
              value={installmentTotal}
              onChange={(e) =>
                setInstallmentTotal(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              min={1}
              step={1}
            />
          </div>
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button variant={ButtonVariant.Secondary} onClick={handleClose}>
          Peruuta
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          onClick={handleBulkInvoiceCreate}
          disabled={isSubmitDisabled}
        >
          Luo maksusuunnitelma
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

interface InstallmentStepProps {
  fieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  canEdit: boolean;
}

const InstallmentStep: React.FC<InstallmentStepProps> = ({
  fieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  canEdit,
}) => {
  const { input: periodStartDateInput } = useField(
    `${fieldName}.laskentajaksonAlkupvm`,
    {
      subscription: { value: true },
    },
  );
  const { input: periodEndDateInput } = useField(
    `${fieldName}.laskentajaksonLoppupvm`,
    {
      subscription: { value: true },
    },
  );
  const rawDays = calculateInvoicingPeriodDays(
    periodStartDateInput.value,
    periodEndDateInput.value,
  );
  const periodDays = rawDays > 0 ? rawDays : null;

  return (
    <Fieldset heading="" className="full-width">
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-3">
          <Field name={`${fieldName}.dueDate`}>
            {({ input }) =>
              canEdit ? (
                <DateInput
                  id={`landuse-payment-schedule-due-date-${scheduleIndex}-${installmentIndex}`}
                  label="Eräpäivä"
                  value={input.value}
                  onChange={input.onChange}
                  placeholder="DD.MM.YYYY"
                  language="fi"
                  disableConfirmation
                />
              ) : (
                <TextInput
                  id={`landuse-payment-schedule-due-date-${scheduleIndex}-${installmentIndex}`}
                  label="Eräpäivä"
                  value={readOnlyTextValue(input.value)}
                  readOnly
                />
              )
            }
          </Field>
        </div>
        <Field name={`${fieldName}.invoiceItems[1].itemType`}>
          {({ input: secondItemTypeInput }) => {
            const kind =
              getInterestKind(secondItemTypeInput.value) ?? "korotus";
            const { startLabel, endLabel } = getInterestPeriodLabels(kind);
            return (
              <>
                <div className="landuse-grid__column-3">
                  <Field name={`${fieldName}.laskentajaksonAlkupvm`}>
                    {({ input }) =>
                      canEdit ? (
                        <DateInput
                          id={`landuse-payment-schedule-laskentajakson-alkupvm-${scheduleIndex}-${installmentIndex}`}
                          label={startLabel}
                          value={input.value}
                          onChange={input.onChange}
                          placeholder="DD.MM.YYYY"
                          language="fi"
                          disableConfirmation
                        />
                      ) : (
                        <TextInput
                          id={`landuse-payment-schedule-laskentajakson-alkupvm-${scheduleIndex}-${installmentIndex}`}
                          label={startLabel}
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>
                </div>
                <div className="landuse-grid__column-3">
                  <Field name={`${fieldName}.laskentajaksonLoppupvm`}>
                    {({ input }) =>
                      canEdit ? (
                        <DateInput
                          id={`landuse-payment-schedule-laskentajakson-loppupvm-${scheduleIndex}-${installmentIndex}`}
                          label={endLabel}
                          value={input.value}
                          onChange={input.onChange}
                          placeholder="DD.MM.YYYY"
                          language="fi"
                          disableConfirmation
                        />
                      ) : (
                        <TextInput
                          id={`landuse-payment-schedule-laskentajakson-loppupvm-${scheduleIndex}-${installmentIndex}`}
                          label={endLabel}
                          value={readOnlyTextValue(input.value)}
                          readOnly
                        />
                      )
                    }
                  </Field>
                </div>
                <div className="landuse-grid__column-3">
                  <TextInput
                    id={`landuse-payment-schedule-korkojakson-pituus-${scheduleIndex}-${installmentIndex}`}
                    label="Korkojakson pituus"
                    value={periodDays !== null ? `${periodDays} pv` : "-"}
                    readOnly
                  />
                </div>
              </>
            );
          }}
        </Field>
      </div>

      <section>
        <FieldArray<LandUseInvoiceItem> name={`${fieldName}.invoiceItems`}>
          {({ fields: itemFields }) => (
            <>
              {itemFields.length > 0 ? (
                itemFields.map((itemFieldName, itemIndex) => (
                  <InvoiceItemRow
                    key={itemFieldName}
                    itemFieldName={itemFieldName}
                    installmentFieldName={fieldName}
                    scheduleFieldName={scheduleFieldName}
                    scheduleIndex={scheduleIndex}
                    installmentIndex={installmentIndex}
                    itemIndex={itemIndex}
                    canEdit={canEdit}
                    periodDays={periodDays}
                  />
                ))
              ) : (
                <p>Ei eriä.</p>
              )}
            </>
          )}
        </FieldArray>
      </section>
    </Fieldset>
  );
};

const buildInstallmentStep = ({
  fieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  isEditMode,
  scheduleStatus,
  invoice,
}: {
  fieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  isEditMode: boolean;
  scheduleStatus: LandUsePaymentScheduleStatus | undefined;
  invoice: LandUseInvoice;
}) => {
  const canEdit = isEditMode && isScheduleEditable(scheduleStatus);
  const installmentLabel =
    invoice.installmentNumber && invoice.installmentTotal
      ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
      : `x/x`;

  return {
    title: `Erä ${installmentLabel}`,
    key: `payment-schedule-${scheduleIndex}-installment-${installmentIndex}`,
    description: (
      <InstallmentStep
        fieldName={fieldName}
        scheduleFieldName={scheduleFieldName}
        scheduleIndex={scheduleIndex}
        installmentIndex={installmentIndex}
        canEdit={canEdit}
      />
    ),
  };
};

interface PartyGroupSectionProps {
  partyValue: string;
  partyLabel: string;
  partyHeadingId: string;
  partySchedules: Array<{
    fieldName: string;
    index: number;
    schedule: LandUsePaymentScheduleEntry;
  }>;
  isEditMode: boolean;
  parties: PartyEntry[];
  contractOptions: ContractOption[];
  onRemoveSchedule: (index: number) => void;
  onSendToInvoicing: (schedule: LandUsePaymentScheduleEntry) => void;
}

const getPartyGroupHeadingId = (partyValue: string): string =>
  `payment-schedule-party-heading-${partyValue}`;

const PartyGroupSection: React.FC<PartyGroupSectionProps> = ({
  partyValue,
  partyLabel,
  partyHeadingId,
  partySchedules,
  isEditMode,
  parties,
  contractOptions,
  onRemoveSchedule,
  onSendToInvoicing,
}) => {
  if (partySchedules.length === 0) {
    return (
      <div className="landuse-payment-schedule__party-group">
        <h2
          id={partyHeadingId}
          className="landuse-payment-schedule__party-heading"
        >
          {partyLabel}
        </h2>
        <p>Ei maksusuunnitelmia.</p>
      </div>
    );
  }

  const selectedPartyData = getSelectedPartyInvoiceData(partyValue, parties);

  return (
    <div className="landuse-payment-schedule__party-group">
      <h2
        id={partyHeadingId}
        className="landuse-payment-schedule__party-heading"
      >
        {partyLabel}
      </h2>
      <Fieldset
        heading="Laskun vastaanottaja"
        border
        tooltip={
          <Tooltip>
            Laskun vastaanottaja on ensisijaisesti osapuolen laskunsaaja, jos
            sellainen on määritelty. Muussa tapauksessa osapuoli.
          </Tooltip>
        }
      >
        <div className="landuse-grid landuse-grid__bottom-margin">
          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-invoice-recipient-${partyValue}`}
              label="Nimi"
              value={readOnlyTextValue(selectedPartyData.name)}
              errorText={selectedPartyData.name ? undefined : "Puuttuu"}
              readOnly
            />
          </div>
          {selectedPartyData.isCompany && (
            <div className="landuse-grid__column-6">
              <TextInput
                id={`landuse-payment-schedule-business-id-${partyValue}`}
                label="Y-tunnus"
                value={readOnlyTextValue(selectedPartyData.businessId)}
                errorText={selectedPartyData.businessId ? undefined : "Puuttuu"}
                readOnly
              />
            </div>
          )}
          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-street-address-${partyValue}`}
              label="Katuosoite"
              value={readOnlyTextValue(selectedPartyData.streetAddress)}
              errorText={
                selectedPartyData.streetAddress ? undefined : "Puuttuu"
              }
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-postal-code-${partyValue}`}
              label="Postinumero"
              value={readOnlyTextValue(selectedPartyData.postalCode)}
              errorText={selectedPartyData.postalCode ? undefined : "Puuttuu"}
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-city-${partyValue}`}
              label="Postitoimipaikka"
              value={readOnlyTextValue(selectedPartyData.city)}
              errorText={selectedPartyData.city ? undefined : "Puuttuu"}
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-sap-customer-number-${partyValue}`}
              label="SAP-asiakasnumero"
              value={readOnlyTextValue(selectedPartyData.sapCustomerNumber)}
              errorText={
                selectedPartyData.sapCustomerNumber ? undefined : "Puuttuu"
              }
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-ovt-code-${partyValue}`}
              label="OVT-tunnus"
              value={readOnlyTextValue(selectedPartyData.ovtCode)}
              infoText={selectedPartyData.ovtCode ? undefined : "Puuttuu"}
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-reference-${partyValue}`}
              label="Asiakkaan viite"
              value={readOnlyTextValue(selectedPartyData.reference)}
              infoText={selectedPartyData.reference ? undefined : "Puuttuu"}
              readOnly
            />
          </div>
        </div>
      </Fieldset>
      {partySchedules.map(
        ({ fieldName, index, schedule }, scheduleListIndex) => {
          const contractNumber =
            contractOptions.find(
              (option) => option.value === schedule.contractIndex,
            )?.sopimusnumero ?? "-";
          const statusAction = getScheduleStatusAction(schedule.status);

          return (
            <section key={schedule.id}>
              <FieldArray<LandUseInvoice> name={`${fieldName}.installments`}>
                {({ fields: installmentFields }) => (
                  <>
                    <div className="landuse-detail__heading-with-delete">
                      <div className="landuse-detail__heading-actions">
                        <h3>
                          {!isScheduleEditable(schedule.status) && (
                            <IconLock aria-label="Maksusuunnitelma lukittu" />
                          )}{" "}
                          Maksusuunnitelma {scheduleListIndex + 1}
                        </h3>
                        <StatusLabel
                          type={getScheduleStatusLabelType(schedule.status)}
                          iconStart={getScheduleStatusIcon(schedule.status)}
                        >
                          {schedule.status ?? "-"}
                        </StatusLabel>
                        {isEditMode && statusAction && (
                          <Button
                            type="button"
                            variant={ButtonVariant.Primary}
                            size={ButtonSize.Small}
                            onClick={() => onSendToInvoicing(schedule)}
                          >
                            {statusAction.buttonLabel}
                          </Button>
                        )}
                      </div>
                      {isEditMode && isScheduleEditable(schedule.status) && (
                        <ConfirmDeleteButton
                          id={`payment-schedule-${index}-delete`}
                          buttonLabel="Poista maksusuunnitelma"
                          onConfirm={() => onRemoveSchedule(index)}
                          dialogTitle="Poista maksusuunnitelma"
                          dialogContent={`Haluatko varmasti poistaa maksusuunnitelman ${scheduleListIndex + 1}?`}
                        />
                      )}
                    </div>
                    {schedule.status ===
                      LAND_USE_PAYMENT_SCHEDULE_STATUSES.REJECTED &&
                      schedule.rejectedReason !== null && (
                        <Notification type="error" label="Hylkäyksen syy">
                          {schedule.rejectedReason}
                        </Notification>
                      )}
                    <StepByStep
                      steps={[
                        {
                          title: `Perustiedot`,
                          key: `payment-schedule-${index}-details`,
                          description: (
                            <Fieldset heading="" className="full-width">
                              <div className="landuse-grid landuse-grid__bottom-margin">
                                <div className="landuse-grid__column-3">
                                  <TextInput
                                    id={`landuse-payment-schedule-contract-${index}`}
                                    label="Sopimus"
                                    value={contractNumber}
                                    readOnly
                                  />
                                </div>
                                <div className="landuse-grid__column-3">
                                  <TextInput
                                    id={`landuse-payment-schedule-signed-date-${index}`}
                                    label="Allekirjoituspäivämäärä"
                                    value={readOnlyTextValue(
                                      schedule.signedDate,
                                    )}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="landuse-grid landuse-grid">
                                <div className="landuse-grid__column-3">
                                  <Field name={`${fieldName}.korotusProsentti`}>
                                    {({ input }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korotus-prosentti-${index}`}
                                        label="Korotusprosentti %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        isEditMode={
                                          isEditMode &&
                                          isScheduleEditable(schedule.status)
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>

                              <div className="landuse-grid landuse-grid">
                                <div className="landuse-grid__column-3">
                                  <Field name={`${fieldName}.korkoPeruskorko`}>
                                    {({ input }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korko-peruskorko-${index}`}
                                        label="Korko %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        isEditMode={
                                          isEditMode &&
                                          isScheduleEditable(schedule.status)
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>
                                <div className="landuse-grid__column-3">
                                  <Field name={`${fieldName}.korkoMarginaali`}>
                                    {({ input }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korko-marginaali-${index}`}
                                        label="Koron marginaali %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        isEditMode={
                                          isEditMode &&
                                          isScheduleEditable(schedule.status)
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>
                            </Fieldset>
                          ),
                        },
                        ...installmentFields.map(
                          (installmentFieldName, installmentIndex) =>
                            buildInstallmentStep({
                              fieldName: installmentFieldName,
                              scheduleFieldName: fieldName,
                              scheduleIndex: index,
                              installmentIndex,
                              isEditMode,
                              scheduleStatus: schedule.status,
                              invoice:
                                installmentFields.value[installmentIndex],
                            }),
                        ),
                      ]}
                    />
                  </>
                )}
              </FieldArray>
            </section>
          );
        },
      )}
    </div>
  );
};

export const LandUsePaymentSchedule: React.FC<LandUsePaymentScheduleProps> = ({
  form,
  isEditMode,
  parties,
  contracts,
  asemakaavanNumero,
  asemakaavanLainvoimaisuusPvm,
  agreementIdentifier,
  onSendToInvoicing,
}) => {
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);

  const partyOptions = useMemo(
    () => createPartyOptions(parties ?? []),
    [parties],
  );
  const contractOptions = useMemo(
    () => createInvoiceContractOptions(contracts ?? []),
    [contracts],
  );

  const tocEntries = useMemo(
    () =>
      partyOptions.map((partyOption) => ({
        id: getPartyGroupHeadingId(partyOption.value),
        text: partyOption.label,
        level: 2,
      })),
    [partyOptions],
  );

  useTocEntries(tocEntries);

  const handleBulkCreate = (values: BulkCreateFormValues) => {
    const total = parseInt(values.installmentTotal, 10);
    if (
      !total ||
      total <= 0 ||
      values.contractIndex === undefined ||
      values.recipientPartyIndex === undefined
    ) {
      return;
    }

    const selectedContract = contracts[Number(values.contractIndex)];
    const signedDate = selectedContract?.allekirjoituspvm ?? "";
    const sopimusnumero =
      contractOptions.find((option) => option.value === values.contractIndex)
        ?.sopimusnumero ?? "";
    const recipientName =
      partyOptions.find((o) => o.value === values.recipientPartyIndex)?.label ??
      "";

    const installments = Array.from({ length: total }, (_, index) =>
      createBulkInvoice(
        index + 1,
        values,
        signedDate,
        agreementIdentifier,
        sopimusnumero,
        asemakaavanNumero,
        recipientName,
      ),
    );

    form.mutators.push("paymentSchedules", {
      id: crypto.randomUUID(),
      recipientPartyIndex: values.recipientPartyIndex,
      contractIndex: values.contractIndex,
      status: LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT,
      rejectedReason: null,
      signedDate,
      korotusProsentti: "",
      korkoPeruskorko: "",
      korkoMarginaali: "",
      daysInYear: INTEREST_CALCULATION_DAYS_IN_YEAR.DAYS_365,
      installments,
    } satisfies LandUsePaymentScheduleEntry);

    setIsBulkCreateOpen(false);
  };

  return (
    <>
      <Form<LandUsePaymentScheduleFormValues>
        form={form}
        onSubmit={() => {}}
        render={({ handleSubmit }) => {
          return (
            <div className="landuse-detail__content">
              <h1>Maksusuunnitelmat</h1>

              <div className="landuse-grid landuse-grid__bottom-margin">
                <div className="landuse-grid__column-3">
                  <TextInput
                    id="landuse-payment-schedule-asemakaavanumero"
                    label="Kaavanumero"
                    value={readOnlyTextValue(asemakaavanNumero)}
                    errorText={asemakaavanNumero ? undefined : "Puuttuu"}
                    readOnly
                  />
                </div>
                <div className="landuse-grid__column-3">
                  <TextInput
                    id="landuse-payment-schedule-valid-date"
                    label="Lainvoimaisuuspäivämäärä"
                    value={readOnlyTextValue(asemakaavanLainvoimaisuusPvm)}
                    errorText={
                      asemakaavanLainvoimaisuusPvm ? undefined : "Puuttuu"
                    }
                    readOnly
                  />
                </div>
              </div>
              <div className="landuse-grid landuse-grid__bottom-margin">
                <div className="landuse-grid__column-12">
                  {isEditMode && (
                    <div className="landuse-invoicing__invoice-actions">
                      <Button
                        type="button"
                        variant={ButtonVariant.Primary}
                        iconStart={<IconPlusCircle />}
                        onClick={() => setIsBulkCreateOpen(true)}
                      >
                        Syötä maksusuunnitelma
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <Fieldset
                  heading=""
                  className="landuse-detail__fieldset--with-margin"
                >
                  <FieldArray<LandUsePaymentScheduleEntry> name="paymentSchedules">
                    {({ fields }) => {
                      const groupedByParty = new Map<
                        string,
                        Array<{
                          fieldName: string;
                          index: number;
                          schedule: LandUsePaymentScheduleEntry;
                        }>
                      >();
                      fields.forEach((fieldName, index) => {
                        const schedule = fields.value[index];
                        const key =
                          schedule.recipientPartyIndex ?? "__ungrouped";
                        if (!groupedByParty.has(key)) {
                          groupedByParty.set(key, []);
                        }
                        groupedByParty.get(key)!.push({
                          fieldName,
                          index,
                          schedule,
                        });
                      });

                      return (
                        <>
                          {partyOptions.map((partyOption) => (
                            <PartyGroupSection
                              key={partyOption.value}
                              partyValue={partyOption.value}
                              partyLabel={partyOption.label}
                              partyHeadingId={getPartyGroupHeadingId(
                                partyOption.value,
                              )}
                              partySchedules={
                                groupedByParty.get(partyOption.value) ?? []
                              }
                              isEditMode={isEditMode}
                              parties={parties}
                              contractOptions={contractOptions}
                              onRemoveSchedule={fields.remove}
                              onSendToInvoicing={onSendToInvoicing}
                            />
                          ))}
                        </>
                      );
                    }}
                  </FieldArray>
                </Fieldset>
              </form>
            </div>
          );
        }}
      />
      <BulkCreateInvoicesDialog
        isOpen={isBulkCreateOpen}
        onClose={() => setIsBulkCreateOpen(false)}
        onSubmit={handleBulkCreate}
        partyOptions={partyOptions}
        contractOptions={contractOptions}
        asemakaavanLainvoimaisuusPvm={asemakaavanLainvoimaisuusPvm}
      />
    </>
  );
};
