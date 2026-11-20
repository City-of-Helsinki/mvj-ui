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
  PAYMENT_SCHEDULE_STATUSES,
  PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES,
} from "@/landUse/options";
import {
  getOptionsDisplayValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "@/landUse/utils/fieldUtils";
import { calculateInvoicingPeriodDays } from "@/landUse/utils/date";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseIntegerValue,
  parseLandUseNumericValueOrZero,
} from "@/landUse/utils/number";
import { ConfirmDeleteButton } from "@/landUse/components/ConfirmDeleteButton";
import { useLandUseMetadata } from "@/landUse/api/useLandUseMetadata";
import { areAllInvoicesInScheduleSent } from "@/landUse/utils/invoiceReview";
import {
  INVOICE_STATUSES,
  type PaymentScheduleInstallment,
  type PaymentScheduleInstallmentItem,
  type PaymentScheduleStatus,
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
  paymentSchedules?: PaymentScheduleEntry[];
}

export interface PaymentScheduleEntry {
  id?: string;
  clientKey?: string;
  createdAt?: string;
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  status: PaymentScheduleStatus | undefined;
  rejectedReason: string | null;
  signedDate: string;
  korotusProsentti: string;
  korkoPeruskorko: string;
  korkoMarginaali: string;
  daysInYear: string;
  installments: PaymentScheduleInstallment[];
}

interface LandUsePaymentScheduleProps {
  form: FormApi<LandUsePaymentScheduleFormValues>;
  isEditMode: boolean;
  canSubmitSchedules: boolean;
  parties: PartyEntry[];
  contracts: ContractItem[];
  asemakaavanNumero: AsemakaavaListItem["asemakaavanNumero"];
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
  agreementIdentifier: string;
  onSendToInvoicing: (schedule: PaymentScheduleEntry) => Promise<void>;
  onReturnToDraft?: (schedule: PaymentScheduleEntry) => Promise<void>;
}

type SelectedPartyInvoiceData = Pick<
  BasePartyDetails,
  "name" | "streetAddress" | "city" | "postalCode"
> &
  Pick<CompanyPartyDetails, "businessId"> &
  Pick<BillingDetails, "ovtCode" | "reference" | "sapCustomerNumber"> & {
    isCompany: boolean;
  };

export const validateRequiredInstallmentField = (
  value: unknown,
): string | undefined => {
  return isPaymentScheduleFieldFilled(value) ? undefined : "Pakollinen tieto";
};

const isPaymentScheduleFieldFilled = (value: unknown): boolean =>
  typeof value === "string"
    ? Boolean(value.trim())
    : value !== null && value !== undefined;

export const getMissingPaymentScheduleFieldLabels = (
  schedule: PaymentScheduleEntry,
  party: SelectedPartyInvoiceData,
): string[] => {
  const missingPartyFields = [
    ["Nimi", party.name],
    ...(party.isCompany ? [["Y-tunnus", party.businessId]] : []),
    ["Katuosoite", party.streetAddress],
    ["Postinumero", party.postalCode],
    ["Postitoimipaikka", party.city],
    ["SAP-asiakasnumero", party.sapCustomerNumber],
  ].flatMap(([label, value]) =>
    isPaymentScheduleFieldFilled(value) ? [] : [label],
  );

  const missingBasicFieldLabels = [
    ["Korotusprosentti %", schedule.korotusProsentti],
    ["Korko %", schedule.korkoPeruskorko],
    ["Koron marginaali %", schedule.korkoMarginaali],
  ].flatMap(([label, value]) =>
    isPaymentScheduleFieldFilled(value) ? [] : [label],
  );

  const missingInstallmentFields = schedule.installments
    .filter((installment) => !installment.invoice)
    .flatMap((installment, installmentIndex) => {
      const secondItemKind = getInterestKind(
        installment.items?.[1]?.itemType ?? "",
      );
      const periodLabels = getInterestPeriodLabels(secondItemKind ?? "korotus");
      const installmentLabel = `Erä ${installmentIndex + 1}`;
      const fields = [
        ["Eräpäivä", installment.dueDate],
        [periodLabels.startLabel, installment.laskentajaksonAlkupvm],
        [periodLabels.endLabel, installment.laskentajaksonLoppupvm],
        ...(!installment.items?.length ? [["Maksurivit", ""]] : []),
        ...(installment.items ?? []).flatMap((item, itemIndex) => [
          [`Maksun tyyppi, rivi ${itemIndex + 1}`, item.itemType],
          [`Summa (€), rivi ${itemIndex + 1}`, item.amountExcludingVat],
        ]),
      ];

      return fields.flatMap(([label, value]) =>
        isPaymentScheduleFieldFilled(value)
          ? []
          : [`${installmentLabel}: ${label}`],
      );
    });

  return [
    ...missingPartyFields,
    ...missingBasicFieldLabels,
    ...missingInstallmentFields,
  ];
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
  parties
    .filter((party) => party.id)
    .map((party, index) => ({
      label: getSchedulePartyName(party, index),
      value: party.id!,
    }));

const createContractOptions = (
  contracts: ContractItem[],
  contractTypeChoices: SelectOption[],
): ContractOption[] =>
  contracts
    .filter((agreement) => agreement.id)
    .map((agreement, index) => {
      const contractTypeCode = agreement.sopimuksenTyyppi?.trim();
      const contractType = contractTypeCode
        ? getOptionsDisplayValue(contractTypeCode, contractTypeChoices)
        : "";
      const contractNumber = agreement.sopimusnumero?.trim() ?? "";
      const parts = [contractType, contractNumber].filter(
        (part): part is string => Boolean(part),
      );

      return {
        label: parts.join(" ") || `Sopimus ${index + 1}`,
        value: agreement.id!,
        sopimusnumero: contractNumber,
      };
    });

const getSelectedPartyInvoiceData = (
  recipientPartyIndex: string | undefined,
  parties: PartyEntry[],
): SelectedPartyInvoiceData => {
  if (!recipientPartyIndex) {
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

  const selectedParty = parties.find(
    (party) => party.id === recipientPartyIndex,
  );
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
  const isCompany = recipientDetails?.partyType === "company";

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
 * The second installment item is either a "korotus" or a "korko" (interest,
 * peruskorko + marginaali).
 * Everything that differs between the two variants is derived from `InterestKind`.
 */
type InterestKind = "korotus" | "korko";

const getInterestKind = (itemType: string): InterestKind | null => {
  if (itemType === PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.KOROTUS)
    return "korotus";
  if (itemType === PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.KORKO)
    return "korko";
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
    return `Laskettu korko (${base}% + ${margin || "-"}%) x ${days} pv`;
  }
  return `Laskettu korotus (${base}%) x ${days} pv`;
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

interface InstallmentItemProps {
  itemFieldName: string;
  installmentFieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  itemIndex: number;
  canEdit: boolean;
  periodDays: number | null;
  validateInstallments: boolean;
}

const InstallmentItem: React.FC<InstallmentItemProps> = ({
  itemFieldName,
  installmentFieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  itemIndex,
  canEdit,
  periodDays,
  validateInstallments,
}) => {
  const metadataQuery = useLandUseMetadata();
  const scheduleItemTypeOptions =
    metadataQuery.data?.payment_schedule_item_types ?? [];
  const { input: itemTypeInput, meta: itemTypeMeta } = useField<string>(
    `${itemFieldName}.itemType`,
    {
      validate: validateInstallments
        ? validateRequiredInstallmentField
        : undefined,
    },
  );
  const { input: amountInput, meta: amountMeta } = useField<string>(
    `${itemFieldName}.amountExcludingVat`,
    {
      validate: validateInstallments
        ? validateRequiredInstallmentField
        : undefined,
    },
  );
  // Base amount for interest is always the Maankäyttökorvaus item (index 0)
  const { input: baseAmountInput } = useField(
    `${installmentFieldName}.items[0].amountExcludingVat`,
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
            id={`landuse-payment-schedule-installment-item-type-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
            texts={{ label: "Maksun tyyppi", placeholder: "Valitse" }}
            options={scheduleItemTypeOptions}
            value={itemTypeInput.value}
            invalid={Boolean(itemTypeMeta.error)}
            required
            onChange={(selected) => {
              if (selected.length > 0) {
                itemTypeInput.onChange(selected[0].value);
              }
            }}
          />
        ) : (
          <TextInput
            id={`landuse-payment-schedule-installment-item-type-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
            label="Maksun tyyppi"
            value={getOptionsDisplayValue(
              itemTypeInput.value,
              scheduleItemTypeOptions,
            )}
            invalid={Boolean(itemTypeMeta.error)}
            errorText={itemTypeMeta.error}
            required
            readOnly
          />
        )}
      </div>

      <div className="landuse-grid__column-2">
        <NumericDecimalInput
          id={`landuse-payment-schedule-installment-amount-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
          label="Summa (€)"
          value={amountInput.value}
          onChange={amountInput.onChange}
          unit="€"
          isEditMode={canEdit}
          invalid={Boolean(amountMeta.error)}
          errorText={amountMeta.error}
          required
        />
      </div>

      {shouldCalculate && interestKind && (
        <>
          <div className="landuse-grid__column-4">
            <TextInput
              id={`landuse-payment-schedule-installment-calc-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
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

const getPaymentScheduleStatusAction = (
  status: PaymentScheduleStatus | undefined,
): { buttonLabel: string; nextStatus: PaymentScheduleStatus } | null => {
  if (
    status === PAYMENT_SCHEDULE_STATUSES.DRAFT ||
    status === PAYMENT_SCHEDULE_STATUSES.REJECTED
  ) {
    return {
      buttonLabel: "Siirrä laskutukseen",
      nextStatus: PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
    };
  }
  return null;
};

const getPaymentScheduleStatusLabelType = (
  status: PaymentScheduleStatus | undefined,
): StatusLabelType => {
  if (status === PAYMENT_SCHEDULE_STATUSES.APPROVED) return "success";
  if (status === PAYMENT_SCHEDULE_STATUSES.REJECTED) return "error";
  if (status === PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL) return "info";
  return "neutral";
};

const getPaymentScheduleStatusIcon = (
  status: PaymentScheduleStatus | undefined,
): React.ReactNode => {
  if (status === PAYMENT_SCHEDULE_STATUSES.APPROVED) {
    return <IconCheckCircleFill aria-hidden />;
  }
  if (status === PAYMENT_SCHEDULE_STATUSES.REJECTED) {
    return <IconCrossCircleFill aria-hidden />;
  }
  if (status === PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL) {
    return <IconClock aria-hidden />;
  }
  if (status === PAYMENT_SCHEDULE_STATUSES.DRAFT) {
    return <IconHammers aria-hidden />;
  }
  return null;
};

const isPaymentScheduleEditable = (
  status: PaymentScheduleStatus | undefined,
): boolean =>
  status === PAYMENT_SCHEDULE_STATUSES.DRAFT ||
  status === PAYMENT_SCHEDULE_STATUSES.REJECTED;

const calculatePaymentScheduleTotals = (
  installments: PaymentScheduleInstallment[],
): { landUseCompensationTotal: number; scheduleTotal: number } =>
  installments.reduce(
    (totals, installment) =>
      (installment.invoice?.invoiceItems ?? installment.items ?? []).reduce(
        (itemTotals, item) => {
          const amount = parseLandUseNumericValueOrZero(
            item.amountExcludingVat,
          );

          return {
            landUseCompensationTotal:
              itemTotals.landUseCompensationTotal +
              (item.itemType ===
              PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.MAANKAYTTOKORVAUS
                ? amount
                : 0),
            scheduleTotal: itemTotals.scheduleTotal + amount,
          };
        },
        totals,
      ),
    { landUseCompensationTotal: 0, scheduleTotal: 0 },
  );

interface CreatePaymentScheduleDialogValues {
  installmentTotal: string;
  contractIndex: string | undefined;
  recipientPartyIndex: string | undefined;
  asemakaavanLainvoimaisuusPvm: string;
}

const buildSecondItemDescription = (
  agreementIdentifier: string,
  sopimusnumero: string,
  asemakaavanNumero: string,
  installmentNumber: number,
  installmentTotal: string,
  recipientName: string,
  isFirst: boolean,
): string =>
  `Maankäyttökorvaus ${agreementIdentifier}, ${sopimusnumero}, ${asemakaavanNumero}, ${installmentNumber}/${installmentTotal}, ${recipientName}, ${isFirst ? "Korotus" : "Korko"}`;

const createInstallment = (
  installmentNumber: number,
  scheduleDialogValues: CreatePaymentScheduleDialogValues,
  signedDate: string,
  agreementIdentifier: string,
  sopimusnumero: string,
  asemakaavanNumero: string,
  recipientName: string,
  isFirst = installmentNumber === 1,
): PaymentScheduleInstallment => {
  const secondItemDescription = buildSecondItemDescription(
    agreementIdentifier,
    sopimusnumero,
    asemakaavanNumero,
    installmentNumber,
    scheduleDialogValues.installmentTotal,
    recipientName,
    isFirst,
  );
  return {
    recipientPartyIndex: scheduleDialogValues.recipientPartyIndex,
    contractIndex: scheduleDialogValues.contractIndex,
    installmentNumber: String(installmentNumber),
    installmentTotal: scheduleDialogValues.installmentTotal,
    signedDate,
    asemakaavanLainvoimaisuusPvm:
      scheduleDialogValues.asemakaavanLainvoimaisuusPvm,
    dueDate: "",
    laskentajaksonAlkupvm: "",
    laskentajaksonLoppupvm: "",
    type: PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.MAANKAYTTOKORVAUS,
    items: [
      {
        itemType: PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.MAANKAYTTOKORVAUS,
        description: "Maksutuotot maankäyttösopimuksista",
        amountExcludingVat: "",
      },
      {
        itemType: isFirst
          ? PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.KOROTUS
          : PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.KORKO,
        description: secondItemDescription,
        amountExcludingVat: "",
      },
    ],
  };
};

interface CreatePaymentScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreatePaymentScheduleDialogValues) => void;
  partyOptions: SelectOption[];
  contractOptions: ContractOption[];
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
}

const CreatePaymentScheduleDialog: React.FC<
  CreatePaymentScheduleDialogProps
> = ({
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

  const handleCreatePaymentSchedule = () => {
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
      id="landuse-create-payment-schedule"
      isOpen={isOpen}
      aria-labelledby="landuse-create-payment-schedule-title"
      closeButtonLabelText="Sulje"
      close={handleClose}
    >
      <Dialog.Header
        id="landuse-create-payment-schedule-title"
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
          onClick={handleCreatePaymentSchedule}
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
  validateInstallments: boolean;
  recipientData: NonNullable<
    PaymentScheduleInstallment["invoice"]
  >["recipientSnapshot"];
  invoice: PaymentScheduleInstallment["invoice"];
}

const InstallmentStep: React.FC<InstallmentStepProps> = ({
  fieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  canEdit,
  validateInstallments,
  recipientData,
  invoice,
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
      {invoice && (
        <Fieldset heading="Laskun vastaanottajan tiedot" border>
          <div className="landuse-grid landuse-grid__bottom-margin">
            {[
              ["Nimi", recipientData?.name],
              ...(recipientData?.isCompany
                ? [["Y-tunnus", recipientData.businessId]]
                : []),
              ["Katuosoite", recipientData?.streetAddress],
              ["Postinumero", recipientData?.postalCode],
              ["Postitoimipaikka", recipientData?.city],
              ["SAP-asiakasnumero", recipientData?.sapCustomerNumber],
              ["OVT-tunnus", recipientData?.ovtCode],
              ["Asiakkaan viite", recipientData?.reference],
            ].map(([label, value], fieldIndex) => (
              <div className="landuse-grid__column-3" key={label}>
                <TextInput
                  id={`landuse-installment-recipient-${scheduleIndex}-${installmentIndex}-${fieldIndex}`}
                  label={label}
                  value={readOnlyTextValue(value)}
                  readOnly
                />
              </div>
            ))}
          </div>
        </Fieldset>
      )}
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-3">
          <Field<string>
            name={`${fieldName}${invoice ? ".invoice" : ""}.dueDate`}
            validate={
              validateInstallments
                ? validateRequiredInstallmentField
                : undefined
            }
          >
            {({ input, meta }) =>
              canEdit ? (
                <DateInput
                  id={`landuse-payment-schedule-due-date-${scheduleIndex}-${installmentIndex}`}
                  label="Eräpäivä"
                  value={input.value}
                  onChange={input.onChange}
                  placeholder="DD.MM.YYYY"
                  language="fi"
                  disableConfirmation
                  invalid={Boolean(meta.error)}
                  errorText={meta.error}
                  required
                />
              ) : (
                <TextInput
                  id={`landuse-payment-schedule-due-date-${scheduleIndex}-${installmentIndex}`}
                  label="Eräpäivä"
                  value={readOnlyTextValue(input.value)}
                  invalid={Boolean(meta.error)}
                  errorText={meta.error}
                  required
                  readOnly
                />
              )
            }
          </Field>
        </div>
        <Field
          name={`${fieldName}.${invoice ? "invoice.invoiceItems" : "items"}[1].itemType`}
        >
          {({ input: secondItemTypeInput }) => {
            const kind =
              getInterestKind(secondItemTypeInput.value) ?? "korotus";
            const { startLabel, endLabel } = getInterestPeriodLabels(kind);
            return (
              <>
                <div className="landuse-grid__column-3">
                  <Field<string>
                    name={`${fieldName}.laskentajaksonAlkupvm`}
                    validate={
                      validateInstallments
                        ? validateRequiredInstallmentField
                        : undefined
                    }
                  >
                    {({ input, meta }) =>
                      canEdit ? (
                        <DateInput
                          id={`landuse-payment-schedule-laskentajakson-alkupvm-${scheduleIndex}-${installmentIndex}`}
                          label={startLabel}
                          value={input.value}
                          onChange={input.onChange}
                          placeholder="DD.MM.YYYY"
                          language="fi"
                          disableConfirmation
                          invalid={Boolean(meta.error)}
                          errorText={meta.error}
                          required
                        />
                      ) : (
                        <TextInput
                          id={`landuse-payment-schedule-laskentajakson-alkupvm-${scheduleIndex}-${installmentIndex}`}
                          label={startLabel}
                          value={readOnlyTextValue(input.value)}
                          invalid={Boolean(meta.error)}
                          errorText={meta.error}
                          required
                          readOnly
                        />
                      )
                    }
                  </Field>
                </div>
                <div className="landuse-grid__column-3">
                  <Field<string>
                    name={`${fieldName}.laskentajaksonLoppupvm`}
                    validate={
                      validateInstallments
                        ? validateRequiredInstallmentField
                        : undefined
                    }
                  >
                    {({ input, meta }) =>
                      canEdit ? (
                        <DateInput
                          id={`landuse-payment-schedule-laskentajakson-loppupvm-${scheduleIndex}-${installmentIndex}`}
                          label={endLabel}
                          value={input.value}
                          onChange={input.onChange}
                          placeholder="DD.MM.YYYY"
                          language="fi"
                          disableConfirmation
                          invalid={Boolean(meta.error)}
                          errorText={meta.error}
                          required
                        />
                      ) : (
                        <TextInput
                          id={`landuse-payment-schedule-laskentajakson-loppupvm-${scheduleIndex}-${installmentIndex}`}
                          label={endLabel}
                          value={readOnlyTextValue(input.value)}
                          invalid={Boolean(meta.error)}
                          errorText={meta.error}
                          required
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
        <FieldArray<PaymentScheduleInstallmentItem>
          name={`${fieldName}.${invoice ? "invoice.invoiceItems" : "items"}`}
        >
          {({ fields: itemFields }) => (
            <>
              {itemFields.length > 0 ? (
                itemFields.map((itemFieldName, itemIndex) => (
                  <InstallmentItem
                    key={itemFieldName}
                    itemFieldName={itemFieldName}
                    installmentFieldName={fieldName}
                    scheduleFieldName={scheduleFieldName}
                    scheduleIndex={scheduleIndex}
                    installmentIndex={installmentIndex}
                    itemIndex={itemIndex}
                    canEdit={canEdit}
                    periodDays={periodDays}
                    validateInstallments={validateInstallments}
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
  installment,
  validateInstallments,
  recipientData,
  invoiceStatusOptions,
  onRemove,
}: {
  fieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  isEditMode: boolean;
  scheduleStatus: PaymentScheduleStatus | undefined;
  installment: PaymentScheduleInstallment;
  validateInstallments: boolean;
  recipientData: SelectedPartyInvoiceData;
  invoiceStatusOptions: SelectOption[];
  onRemove: () => void;
}) => {
  const canEdit =
    !installment.invoice &&
    isEditMode &&
    isPaymentScheduleEditable(scheduleStatus);
  const savedInvoice = installment.invoice;
  const displayedInstallment = savedInvoice ?? installment;
  const installmentLabel =
    displayedInstallment.installmentNumber &&
    displayedInstallment.installmentTotal
      ? `${displayedInstallment.installmentNumber}/${displayedInstallment.installmentTotal}`
      : `x/x`;
  const invoiceNumber = savedInvoice?.invoiceNumber;
  const invoiceNumberLabel =
    invoiceNumber === undefined
      ? "-"
      : formatLandUseIntegerValue(invoiceNumber);
  const installmentTitle = savedInvoice
    ? `Erä ${installmentLabel} (Laskunumero: ${invoiceNumberLabel})`
    : `Erä ${installmentLabel}`;

  return {
    title: (
      <span
        className="landuse-detail__heading-with-delete"
        style={{ width: "100%" }}
      >
        <span className="landuse-detail__heading-actions">
          <span>{installmentTitle}</span>
          {savedInvoice?.status && (
            <StatusLabel
              type={
                savedInvoice.status === INVOICE_STATUSES.PAID
                  ? "success"
                  : "info"
              }
            >
              {getOptionsDisplayValue(
                savedInvoice.status,
                invoiceStatusOptions,
              )}
            </StatusLabel>
          )}
        </span>
        {canEdit && (
          <ConfirmDeleteButton
            id={`payment-schedule-${scheduleIndex}-installment-${installmentIndex}-delete`}
            buttonLabel="Poista erä"
            onConfirm={onRemove}
            dialogTitle="Poista erä"
            dialogContent={`Haluatko varmasti poistaa erän ${installmentLabel}?`}
          />
        )}
      </span>
    ) as unknown as string,
    key: `payment-schedule-${scheduleIndex}-installment-${installmentIndex}`,
    description: (
      <InstallmentStep
        key={validateInstallments ? "validate" : "draft"}
        fieldName={fieldName}
        scheduleFieldName={scheduleFieldName}
        scheduleIndex={scheduleIndex}
        installmentIndex={installmentIndex}
        canEdit={canEdit}
        validateInstallments={validateInstallments}
        recipientData={
          savedInvoice ? savedInvoice.recipientSnapshot : recipientData
        }
        invoice={savedInvoice}
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
    schedule: PaymentScheduleEntry;
  }>;
  isEditMode: boolean;
  canSubmitSchedules: boolean;
  parties: PartyEntry[];
  contractOptions: ContractOption[];
  onRemoveSchedule: (index: number) => void;
  onAddInstallment: (schedule: PaymentScheduleEntry, index: number) => void;
  onRemoveInstallment: (
    schedule: PaymentScheduleEntry,
    index: number,
    installmentIndex: number,
  ) => void;
  onSendToInvoicing: (schedule: PaymentScheduleEntry) => Promise<void>;
  onReturnToDraft?: (schedule: PaymentScheduleEntry) => Promise<void>;
}

const getPartyGroupHeadingId = (partyValue: string): string =>
  `payment-schedule-party-heading-${partyValue}`;

const PartyGroupSection: React.FC<PartyGroupSectionProps> = ({
  partyValue,
  partyLabel,
  partyHeadingId,
  partySchedules,
  isEditMode,
  canSubmitSchedules,
  parties,
  contractOptions,
  onRemoveSchedule,
  onAddInstallment,
  onRemoveInstallment,
  onSendToInvoicing,
  onReturnToDraft,
}) => {
  const metadataQuery = useLandUseMetadata();
  const [scheduleToSend, setScheduleToSend] =
    useState<PaymentScheduleEntry | null>(null);
  const [scheduleToReturn, setScheduleToReturn] =
    useState<PaymentScheduleEntry | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  const invoicesToDeleteCount =
    scheduleToReturn?.installments.filter(
      ({ invoice }) =>
        invoice?.status === INVOICE_STATUSES.WAITING_TO_BE_SENT &&
        !invoice.sentAt,
    ).length ?? 0;

  const invoicesToKeepCount =
    scheduleToReturn?.installments.filter(
      ({ invoice }) =>
        invoice?.status !== INVOICE_STATUSES.WAITING_TO_BE_SENT ||
        !!invoice.sentAt,
    ).length ?? 0;

  const handleReturnConfirm = async () => {
    if (!scheduleToReturn || !onReturnToDraft || isReturning) return;
    if (areAllInvoicesInScheduleSent(scheduleToReturn)) return;
    setIsReturning(true);
    try {
      await onReturnToDraft(scheduleToReturn);
      setScheduleToReturn(null);
    } catch {
      return;
    } finally {
      setIsReturning(false);
    }
  };

  const closeSendDialog = () => {
    setScheduleToSend(null);
  };

  const handleSendConfirm = async () => {
    if (!scheduleToSend?.id || areAllInvoicesInScheduleSent(scheduleToSend)) {
      return;
    }

    await onSendToInvoicing(scheduleToSend);
    closeSendDialog();
  };

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
  const missingSendFieldLabels = scheduleToSend
    ? getMissingPaymentScheduleFieldLabels(scheduleToSend, selectedPartyData)
    : [];

  return (
    <div className="landuse-payment-schedule__party-group">
      <h2
        id={partyHeadingId}
        className="landuse-payment-schedule__party-heading"
      >
        {partyLabel}
      </h2>
      <Fieldset
        heading="Osapuolen laskun vastaanottajan tiedot"
        border
        tooltip={
          <Tooltip>
            Laskun vastaanottaja on ensisijaisesti osapuolen laskunsaaja, jos
            sellainen on määritelty. Muussa tapauksessa osapuoli. Näyttää tiedot
            osapuolet-välilehdeltä.
          </Tooltip>
        }
      >
        <div className="landuse-grid landuse-grid__bottom-margin">
          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-recipient-${partyValue}`}
              label="Nimi"
              value={readOnlyTextValue(selectedPartyData.name)}
              errorText={selectedPartyData.name ? undefined : "Puuttuu"}
              required
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
                required
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
              required
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-postal-code-${partyValue}`}
              label="Postinumero"
              value={readOnlyTextValue(selectedPartyData.postalCode)}
              errorText={selectedPartyData.postalCode ? undefined : "Puuttuu"}
              required
              readOnly
            />
          </div>

          <div className="landuse-grid__column-6">
            <TextInput
              id={`landuse-payment-schedule-city-${partyValue}`}
              label="Postitoimipaikka"
              value={readOnlyTextValue(selectedPartyData.city)}
              errorText={selectedPartyData.city ? undefined : "Puuttuu"}
              required
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
              required
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
          const statusAction = getPaymentScheduleStatusAction(schedule.status);
          const { landUseCompensationTotal, scheduleTotal } =
            calculatePaymentScheduleTotals(schedule.installments);
          const allInstallmentInvoicesSent =
            areAllInvoicesInScheduleSent(schedule);

          return (
            <section key={schedule.id ?? schedule.clientKey}>
              <FieldArray<PaymentScheduleInstallment>
                name={`${fieldName}.installments`}
              >
                {({ fields: installmentFields }) => (
                  <>
                    <div className="landuse-detail__heading-with-delete">
                      <div className="landuse-detail__heading-actions">
                        <h3>
                          {!isPaymentScheduleEditable(schedule.status) && (
                            <IconLock aria-label="Maksusuunnitelma lukittu" />
                          )}{" "}
                          Maksusuunnitelma{" "}
                          {schedule.createdAt || "(tallentamaton)"}
                        </h3>
                        <StatusLabel
                          type={getPaymentScheduleStatusLabelType(
                            schedule.status,
                          )}
                          iconStart={getPaymentScheduleStatusIcon(
                            schedule.status,
                          )}
                        >
                          {getOptionsDisplayValue(
                            schedule.status,
                            metadataQuery.data?.payment_schedule_statuses ?? [],
                          )}
                        </StatusLabel>
                        {isEditMode &&
                          onReturnToDraft &&
                          (schedule.status ===
                            PAYMENT_SCHEDULE_STATUSES.APPROVED ||
                            schedule.status ===
                              PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL) && (
                            <Button
                              type="button"
                              variant={ButtonVariant.Secondary}
                              size={ButtonSize.Small}
                              disabled={allInstallmentInvoicesSent}
                              onClick={() => setScheduleToReturn(schedule)}
                            >
                              Palauta luonnokseksi
                            </Button>
                          )}
                        {canSubmitSchedules && statusAction && (
                          <span
                            title={
                              !schedule.id
                                ? "Tallentamattomia suunnitelmia ei voi lähettää laskutukseen"
                                : undefined
                            }
                          >
                            <Button
                              type="button"
                              variant={ButtonVariant.Primary}
                              size={ButtonSize.Small}
                              disabled={
                                !schedule.id || allInstallmentInvoicesSent
                              }
                              onClick={() => setScheduleToSend(schedule)}
                            >
                              {statusAction.buttonLabel}
                            </Button>
                          </span>
                        )}
                      </div>
                      {isEditMode &&
                        isPaymentScheduleEditable(schedule.status) &&
                        !schedule.installments.some(
                          (installment) => installment.invoice,
                        ) && (
                          <ConfirmDeleteButton
                            id={`payment-schedule-${index}-delete`}
                            buttonLabel="Poista maksusuunnitelma"
                            onConfirm={() => onRemoveSchedule(index)}
                            dialogTitle="Poista maksusuunnitelma"
                            dialogContent={`Haluatko varmasti poistaa maksusuunnitelman ${scheduleListIndex + 1}?`}
                          />
                        )}
                    </div>
                    {allInstallmentInvoicesSent && (
                      <Notification type="success">
                        Kaikki maksusuunnitelman laskut on lähetetty SAP:iin.
                      </Notification>
                    )}
                    {schedule.status === PAYMENT_SCHEDULE_STATUSES.REJECTED &&
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
                            <Fieldset
                              key={
                                Boolean(schedule.id) &&
                                scheduleToSend?.id === schedule.id
                                  ? "validate"
                                  : "draft"
                              }
                              heading=""
                              className="full-width"
                            >
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
                                <div className="landuse-grid__column-3">
                                  <TextInput
                                    id={`landuse-payment-schedule-land-use-compensation-total-${index}`}
                                    label="Erien maankäyttökorvausten summa"
                                    value={formatLandUseEuroDisplayValue(
                                      landUseCompensationTotal,
                                    )}
                                    readOnly
                                  />
                                </div>
                                <div className="landuse-grid__column-3">
                                  <TextInput
                                    id={`landuse-payment-schedule-total-${index}`}
                                    label="Erien koko summa"
                                    tooltip={
                                      <Tooltip>
                                        Erien maankäyttökorvausten, korotusten,
                                        ja korkojen summa
                                      </Tooltip>
                                    }
                                    value={formatLandUseEuroDisplayValue(
                                      scheduleTotal,
                                    )}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="landuse-grid landuse-grid">
                                <div className="landuse-grid__column-3">
                                  <Field<string | number>
                                    name={`${fieldName}.korotusProsentti`}
                                    validate={
                                      Boolean(schedule.id) &&
                                      scheduleToSend?.id === schedule.id
                                        ? validateRequiredInstallmentField
                                        : undefined
                                    }
                                  >
                                    {({ input, meta }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korotus-prosentti-${index}`}
                                        label="Korotusprosentti %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        invalid={Boolean(meta.error)}
                                        errorText={meta.error}
                                        required
                                        isEditMode={
                                          isEditMode &&
                                          isPaymentScheduleEditable(
                                            schedule.status,
                                          )
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>
                                <div className="landuse-grid__column-3">
                                  <Field<string | number>
                                    name={`${fieldName}.korkoPeruskorko`}
                                    validate={
                                      Boolean(schedule.id) &&
                                      scheduleToSend?.id === schedule.id
                                        ? validateRequiredInstallmentField
                                        : undefined
                                    }
                                  >
                                    {({ input, meta }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korko-peruskorko-${index}`}
                                        label="Korko %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        invalid={Boolean(meta.error)}
                                        errorText={meta.error}
                                        required
                                        isEditMode={
                                          isEditMode &&
                                          isPaymentScheduleEditable(
                                            schedule.status,
                                          )
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>
                                <div className="landuse-grid__column-3">
                                  <Field<string | number>
                                    name={`${fieldName}.korkoMarginaali`}
                                    validate={
                                      Boolean(schedule.id) &&
                                      scheduleToSend?.id === schedule.id
                                        ? validateRequiredInstallmentField
                                        : undefined
                                    }
                                  >
                                    {({ input, meta }) => (
                                      <NumericDecimalInput
                                        id={`landuse-payment-schedule-korko-marginaali-${index}`}
                                        label="Koron marginaali %"
                                        value={input.value}
                                        onChange={input.onChange}
                                        unit="%"
                                        invalid={Boolean(meta.error)}
                                        errorText={meta.error}
                                        required
                                        isEditMode={
                                          isEditMode &&
                                          isPaymentScheduleEditable(
                                            schedule.status,
                                          )
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
                              installment:
                                installmentFields.value[installmentIndex],
                              recipientData: selectedPartyData,
                              invoiceStatusOptions:
                                metadataQuery.data?.invoice_statuses ?? [],
                              validateInstallments:
                                Boolean(schedule.id) &&
                                scheduleToSend?.id === schedule.id,
                              onRemove: () =>
                                onRemoveInstallment(
                                  schedule,
                                  index,
                                  installmentIndex,
                                ),
                            }),
                        ),
                      ]}
                    />
                    {isEditMode &&
                      isPaymentScheduleEditable(schedule.status) && (
                        <Button
                          type="button"
                          variant={ButtonVariant.Secondary}
                          size={ButtonSize.Small}
                          iconStart={<IconPlusCircle />}
                          onClick={() => onAddInstallment(schedule, index)}
                        >
                          Lisää erä
                        </Button>
                      )}
                  </>
                )}
              </FieldArray>
            </section>
          );
        },
      )}
      <Dialog
        id={`landuse-return-payment-schedule-${partyValue}`}
        isOpen={scheduleToReturn !== null}
        aria-labelledby={`landuse-return-payment-schedule-${partyValue}-title`}
        closeButtonLabelText="Sulje"
        close={() => {
          if (!isReturning) setScheduleToReturn(null);
        }}
      >
        <Dialog.Header
          id={`landuse-return-payment-schedule-${partyValue}-title`}
          title="Palauta maksusuunnitelma luonnokseksi"
        />
        <Dialog.Content>
          {scheduleToReturn?.status ===
            PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL && (
            <p>Suunnitelmaa ei ole vielä tarkastettu.</p>
          )}
          {scheduleToReturn?.status === PAYMENT_SCHEDULE_STATUSES.APPROVED && (
            <>
              <p>
                Suunnitelma on hyväksytty. Lähettämättömät laskut poistetaan ja
                palautetaan muokattaviksi. Lähetettyjä laskuja ei voi enää
                palauttaa.
              </p>
              <ul>
                <li>Palautettavia laskuja: {invoicesToDeleteCount} kpl</li>
                <li>Lähetettyjä laskuja: {invoicesToKeepCount} kpl</li>
              </ul>
            </>
          )}
          <p>Haluatko palauttaa maksusuunnitelman luonnokseksi?</p>
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            disabled={isReturning}
            onClick={() => setScheduleToReturn(null)}
          >
            Peruuta
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.Primary}
            disabled={
              isReturning ||
              (scheduleToReturn !== null &&
                areAllInvoicesInScheduleSent(scheduleToReturn))
            }
            onClick={handleReturnConfirm}
          >
            Palauta luonnokseksi
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
      <Dialog
        id={`landuse-send-payment-schedule-${partyValue}`}
        isOpen={scheduleToSend !== null}
        aria-labelledby={`landuse-send-payment-schedule-${partyValue}-title`}
        closeButtonLabelText="Sulje"
        close={closeSendDialog}
      >
        <Dialog.Header
          id={`landuse-send-payment-schedule-${partyValue}-title`}
          title="Siirrä maksusuunnitelma laskutukseen"
        />
        <Dialog.Content>
          {missingSendFieldLabels.length > 0 ? (
            <>
              <p>Seuraavat pakolliset tiedot puuttuvat:</p>
              <ul>
                {missingSendFieldLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </>
          ) : (
            "Maksusuunnitelman maksuerät siirretään laskutukseen hyväksyttäviksi."
          )}
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            onClick={closeSendDialog}
          >
            Peruuta
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.Primary}
            onClick={handleSendConfirm}
            disabled={missingSendFieldLabels.length > 0}
          >
            Siirrä laskutukseen
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    </div>
  );
};

export const LandUsePaymentSchedule: React.FC<LandUsePaymentScheduleProps> = ({
  form,
  isEditMode,
  canSubmitSchedules,
  parties,
  contracts,
  asemakaavanNumero,
  asemakaavanLainvoimaisuusPvm,
  agreementIdentifier,
  onSendToInvoicing,
  onReturnToDraft,
}) => {
  const metadataQuery = useLandUseMetadata();
  const [isCreateScheduleDialogOpen, setIsCreateScheduleDialogOpen] =
    useState(false);

  const partyOptions = useMemo(
    () => createPartyOptions(parties ?? []),
    [parties],
  );
  const contractOptions = useMemo(
    () =>
      createContractOptions(
        contracts ?? [],
        metadataQuery.data?.contract_types ?? [],
      ),
    [contracts, metadataQuery.data?.contract_types],
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

  const updateInstallments = (
    schedule: PaymentScheduleEntry,
    index: number,
    installments: PaymentScheduleInstallment[],
  ) => {
    const sopimusnumero =
      contractOptions.find((option) => option.value === schedule.contractIndex)
        ?.sopimusnumero ?? "";
    const recipientName = getOptionsDisplayValue(
      schedule.recipientPartyIndex,
      partyOptions,
    );
    const installmentTotal = String(installments.length);

    const updatedInstallments = installments.map(
      (installment, installmentIndex) => {
        if (installment.invoice) return installment;
        const installmentNumber = installmentIndex + 1;
        return {
          ...installment,
          installmentNumber: String(installmentNumber),
          installmentTotal,
          // Have to update the description for installment items based on the installment number and total
          items: installment.items?.map((item, itemIndex) =>
            itemIndex === 1 && getInterestKind(item.itemType)
              ? {
                  ...item,
                  description: buildSecondItemDescription(
                    agreementIdentifier,
                    sopimusnumero,
                    asemakaavanNumero,
                    installmentNumber,
                    installmentTotal,
                    recipientName,
                    item.itemType ===
                      PAYMENT_SCHEDULE_INSTALLMENT_ITEM_TYPES.KOROTUS,
                  ),
                }
              : item,
          ),
        };
      },
    );
    form.change(
      "paymentSchedules",
      form
        .getState()
        .values.paymentSchedules?.map((entry, scheduleIndex) =>
          scheduleIndex === index
            ? { ...entry, installments: updatedInstallments }
            : entry,
        ),
    );
  };

  const handleAddInstallment = (
    schedule: PaymentScheduleEntry,
    index: number,
  ) => {
    if (!isEditMode || !isPaymentScheduleEditable(schedule.status)) return;
    const installment = createInstallment(
      schedule.installments.length + 1,
      {
        installmentTotal: String(schedule.installments.length + 1),
        contractIndex: schedule.contractIndex,
        recipientPartyIndex: schedule.recipientPartyIndex,
        asemakaavanLainvoimaisuusPvm,
      },
      schedule.signedDate,
      agreementIdentifier,
      contractOptions.find((option) => option.value === schedule.contractIndex)
        ?.sopimusnumero ?? "",
      asemakaavanNumero,
      getOptionsDisplayValue(schedule.recipientPartyIndex, partyOptions),
    );
    updateInstallments(schedule, index, [
      ...schedule.installments,
      installment,
    ]);
  };

  const handleRemoveInstallment = (
    schedule: PaymentScheduleEntry,
    index: number,
    installmentIndex: number,
  ) => {
    if (
      !isEditMode ||
      !isPaymentScheduleEditable(schedule.status) ||
      schedule.installments[installmentIndex]?.invoice
    )
      return;
    updateInstallments(
      schedule,
      index,
      schedule.installments.filter(
        (_, currentIndex) => currentIndex !== installmentIndex,
      ),
    );
  };

  const handleCreatePaymentSchedule = (
    values: CreatePaymentScheduleDialogValues,
  ) => {
    const total = parseInt(values.installmentTotal, 10);
    if (
      !total ||
      total <= 0 ||
      values.contractIndex === undefined ||
      values.recipientPartyIndex === undefined
    ) {
      return;
    }

    const selectedContract = contracts.find(
      (contract) => contract.id === values.contractIndex,
    );
    const signedDate = selectedContract?.allekirjoituspvm ?? "";
    const sopimusnumero =
      contractOptions.find((option) => option.value === values.contractIndex)
        ?.sopimusnumero ?? "";
    const recipientName = values.recipientPartyIndex
      ? getOptionsDisplayValue(values.recipientPartyIndex, partyOptions)
      : "";

    const installments = Array.from({ length: total }, (_, index) =>
      createInstallment(
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
      clientKey: crypto.randomUUID(),
      recipientPartyIndex: values.recipientPartyIndex,
      contractIndex: values.contractIndex,
      status: PAYMENT_SCHEDULE_STATUSES.DRAFT,
      rejectedReason: null,
      signedDate,
      korotusProsentti: "",
      korkoPeruskorko: "",
      korkoMarginaali: "",
      daysInYear: INTEREST_CALCULATION_DAYS_IN_YEAR.DAYS_365,
      installments,
    } satisfies PaymentScheduleEntry);

    setIsCreateScheduleDialogOpen(false);
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
                    <div className="landuse-payment-schedule__actions">
                      <Button
                        type="button"
                        variant={ButtonVariant.Primary}
                        iconStart={<IconPlusCircle />}
                        onClick={() => setIsCreateScheduleDialogOpen(true)}
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
                  <FieldArray<PaymentScheduleEntry> name="paymentSchedules">
                    {({ fields }) => {
                      const groupedByParty = new Map<
                        string,
                        Array<{
                          fieldName: string;
                          index: number;
                          schedule: PaymentScheduleEntry;
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
                              canSubmitSchedules={canSubmitSchedules}
                              parties={parties}
                              contractOptions={contractOptions}
                              onRemoveSchedule={fields.remove}
                              onAddInstallment={handleAddInstallment}
                              onRemoveInstallment={handleRemoveInstallment}
                              onSendToInvoicing={onSendToInvoicing}
                              onReturnToDraft={onReturnToDraft}
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
      <CreatePaymentScheduleDialog
        isOpen={isCreateScheduleDialogOpen}
        onClose={() => setIsCreateScheduleDialogOpen(false)}
        onSubmit={handleCreatePaymentSchedule}
        partyOptions={partyOptions}
        contractOptions={contractOptions}
        asemakaavanLainvoimaisuusPvm={asemakaavanLainvoimaisuusPvm}
      />
    </>
  );
};
