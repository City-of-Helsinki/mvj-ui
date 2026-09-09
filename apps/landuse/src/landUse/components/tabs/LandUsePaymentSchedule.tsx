import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  DateInput,
  Dialog,
  Fieldset,
  IconPlusCircle,
  NumberInput,
  Select,
  StepByStep,
  TextInput,
} from "hds-react";
import React, { useState } from "react";
import { Field, Form, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  AsemakaavaListItem,
  LAND_USE_INVOICE_ITEM_TYPES,
  LAND_USE_INVOICE_TYPES,
  landUseInvoiceItemTypeSelectOptions,
} from "../../options";
import {
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "../../utils/fieldUtils";
import { calculateInvoicingPeriodDays } from "../../utils/date";
import { formatLandUseEuroDisplayValue } from "../../utils/number";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import {
  KorkoCalculator,
  type KorkoResult,
} from "../invoicing/KorkoCalculator";
import {
  LAND_USE_INVOICE_STATUSES,
  type LandUseInvoice,
  type LandUseInvoiceItem,
  type LandUseInvoiceStatus,
} from "../../options";
import type { LandUseContractsFormValues } from "./LandUseContracts";
import type { PartyEntry } from "./LandUseParties";

type ContractItem = NonNullable<
  LandUseContractsFormValues["contracts"]
>[number];

interface AgreementOption extends SelectOption {
  sopimusnumero: string;
}

export interface LandUsePaymentScheduleFormValues {
  paymentSchedules?: LandUsePaymentScheduleEntry[];
}

export interface LandUsePaymentScheduleEntry {
  id: string;
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  status: LandUseInvoiceStatus | undefined;
  signedDate: string;
  korotusPeruskorko: string;
  korotusMarginaali: string;
  korkoPeruskorko: string;
  korkoMarginaali: string;
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
  korkoResults: KorkoResult[];
  setKorkoResults: React.Dispatch<React.SetStateAction<KorkoResult[]>>;
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

const createInvoiceContractOptions = (
  contracts: ContractItem[],
): AgreementOption[] =>
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

/** Interest formula: amount × (rate/100) × days / daysInYear (English annual interest) */
const calculateInterestAmount = (
  amountStr: string,
  peruskorkoStr: string,
  marginaaliStr: string,
  alkupvmStr: string,
  loppupvmStr: string,
  daysInYearStr: string,
): number | null => {
  const amount = parseFloat(amountStr);
  const peruskorko = parseFloat(peruskorkoStr);
  const marginaali = parseFloat(marginaaliStr);
  const daysInYear = parseFloat(daysInYearStr) || 365;
  if (
    isNaN(amount) ||
    isNaN(peruskorko) ||
    isNaN(marginaali) ||
    !alkupvmStr.trim() ||
    !loppupvmStr.trim()
  )
    return null;
  const parseFinnish = (s: string): Date | null => {
    const p = s.split(".");
    if (p.length !== 3) return null;
    const d = new Date(
      `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}T00:00:00`,
    );
    return isNaN(d.getTime()) ? null : d;
  };
  const start = parseFinnish(alkupvmStr);
  const end = parseFinnish(loppupvmStr);
  if (!start || !end) return null;
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
  if (days <= 0) return null;
  const rate = peruskorko + marginaali;
  return (amount * (rate / 100) * days) / daysInYear;
};

interface InvoiceItemRowProps {
  itemFieldName: string;
  installmentFieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  itemIndex: number;
  canEdit: boolean;
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  itemFieldName,
  installmentFieldName,
  scheduleFieldName,
  scheduleIndex,
  installmentIndex,
  itemIndex,
  canEdit,
}) => {
  const { input: itemTypeInput } = useField(`${itemFieldName}.itemType`);
  const { input: amountInput } = useField(
    `${itemFieldName}.amountExcludingVat`,
  );
  const { input: alkupvmInput } = useField(
    `${installmentFieldName}.korotuksenAlkupvm`,
  );
  const { input: loppupvmInput } = useField(
    `${installmentFieldName}.korotuksenLoppupvm`,
  );
  // Base amount for interest is always the Maankäyttökorvaus row (index 0)
  const { input: baseAmountInput } = useField(
    `${installmentFieldName}.invoiceItems[0].amountExcludingVat`,
  );
  const { input: daysInYearInput } = useField(
    `${installmentFieldName}.daysInYear`,
  );

  const itemType = itemTypeInput.value;
  const isKorotus = itemType === LAND_USE_INVOICE_ITEM_TYPES.KOROTUS;
  const isKorko = itemType === LAND_USE_INVOICE_ITEM_TYPES.KORKO;
  const needsCalc = canEdit && (isKorotus || isKorko);
  const peruskorkoFieldName = isKorotus
    ? `${scheduleFieldName}.korotusPeruskorko`
    : `${scheduleFieldName}.korkoPeruskorko`;
  const marginaaliFieldName = isKorotus
    ? `${scheduleFieldName}.korotusMarginaali`
    : `${scheduleFieldName}.korkoMarginaali`;
  const { input: peruskorkoInput } = useField(peruskorkoFieldName);
  const { input: marginaaliInput } = useField(marginaaliFieldName);

  const calculated = needsCalc
    ? calculateInterestAmount(
        baseAmountInput.value,
        peruskorkoInput.value,
        marginaaliInput.value,
        alkupvmInput.value,
        loppupvmInput.value,
        daysInYearInput.value,
      )
    : null;
  const periodDays = needsCalc
    ? calculateInvoicingPeriodDays(alkupvmInput.value, loppupvmInput.value) ||
      null
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
          label="Veroton summa (€)"
          value={amountInput.value}
          onChange={amountInput.onChange}
          unit="€"
          isEditMode={canEdit}
        />
      </div>

      {needsCalc && (
        <>
          <div className="landuse-grid__column-4">
            <TextInput
              id={`landuse-payment-schedule-invoice-row-calc-${scheduleIndex}-${installmentIndex}-${itemIndex}`}
              label={`Laskettu ${isKorotus ? "korotus" : "korko"} (${peruskorkoInput.value || "-"}% + ${marginaaliInput.value || "-"}%) * ${periodDays !== null ? `${periodDays}` : "-"} pv`}
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

const createEmptyInvoiceItemRow = (): LandUseInvoiceItem => ({
  itemType: "",
  description: "",
  amountExcludingVat: "",
});

const getScheduleStatusAction = (
  status: LandUseInvoiceStatus | undefined,
): { buttonLabel: string; nextStatus: LandUseInvoiceStatus } | null => {
  if (status === LAND_USE_INVOICE_STATUSES.DRAFT) {
    return {
      buttonLabel: "Siirrä laskutukseen",
      nextStatus: LAND_USE_INVOICE_STATUSES.READY,
    };
  }
  return null;
};

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
  korotuksenAlkupvm: "",
  korotuksenLoppupvm: "",
  daysInYear: "365",
  invoiceNumber: "",
  type: LAND_USE_INVOICE_TYPES.MAANKAYTTOKORVAUS,
  status: "Luonnos",
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
  agreementOptions: AgreementOption[];
  asemakaavanLainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
}

const BulkCreateInvoicesDialog: React.FC<BulkCreateInvoicesDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partyOptions,
  agreementOptions,
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
              options={agreementOptions}
              value={normalizeSelectValue(contractIndex)}
              onChange={(selected) =>
                handleSelectChange(selected, setContractIndex)
              }
              disabled={agreementOptions.length === 0}
              texts={{
                label: "Sopimus",
                placeholder:
                  agreementOptions.length > 0 ? "Valitse" : "Ei sopimuksia",
              }}
            />
          </div>
          <div className="landuse-grid__column-12">
            <NumberInput
              id="bulk-create-installment-total-schedule"
              label="Laskutuseriä yhteensä"
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
          Luo laskut
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
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
  korkoResults,
  onRemove,
}: {
  fieldName: string;
  scheduleFieldName: string;
  scheduleIndex: number;
  installmentIndex: number;
  isEditMode: boolean;
  scheduleStatus: LandUseInvoiceStatus | undefined;
  invoice: LandUseInvoice;
  korkoResults: KorkoResult[];
  onRemove: () => void;
}) => {
  const canEdit =
    isEditMode && scheduleStatus === LAND_USE_INVOICE_STATUSES.DRAFT;
  const installmentLabel =
    invoice.installmentNumber && invoice.installmentTotal
      ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
      : `x/x`;

  return {
    title: `Erä ${installmentLabel}`,
    key: `payment-schedule-${scheduleIndex}-installment-${installmentIndex}`,
    description: (
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
              const isKorko =
                secondItemTypeInput.value === LAND_USE_INVOICE_ITEM_TYPES.KORKO;
              const alkuLabel = isKorko
                ? "Koron alkupäivä"
                : "Korotuksen alkupäivä";
              const loppuLabel = isKorko
                ? "Koron loppupäivä"
                : "Korotuksen loppupäivä";
              return (
                <>
                  <div className="landuse-grid__column-3">
                    <Field name={`${fieldName}.korotuksenAlkupvm`}>
                      {({ input }) =>
                        canEdit ? (
                          <DateInput
                            id={`landuse-payment-schedule-korotuksen-alkupvm-${scheduleIndex}-${installmentIndex}`}
                            label={alkuLabel}
                            value={input.value}
                            onChange={input.onChange}
                            placeholder="DD.MM.YYYY"
                            language="fi"
                            disableConfirmation
                          />
                        ) : (
                          <TextInput
                            id={`landuse-payment-schedule-korotuksen-alkupvm-${scheduleIndex}-${installmentIndex}`}
                            label={alkuLabel}
                            value={readOnlyTextValue(input.value)}
                            readOnly
                          />
                        )
                      }
                    </Field>
                  </div>
                  <div className="landuse-grid__column-3">
                    <Field name={`${fieldName}.korotuksenLoppupvm`}>
                      {({ input }) =>
                        canEdit ? (
                          <DateInput
                            id={`landuse-payment-schedule-korotuksen-loppupvm-${scheduleIndex}-${installmentIndex}`}
                            label={loppuLabel}
                            value={input.value}
                            onChange={input.onChange}
                            placeholder="DD.MM.YYYY"
                            language="fi"
                            disableConfirmation
                          />
                        ) : (
                          <TextInput
                            id={`landuse-payment-schedule-korotuksen-loppupvm-${scheduleIndex}-${installmentIndex}`}
                            label={loppuLabel}
                            value={readOnlyTextValue(input.value)}
                            readOnly
                          />
                        )
                      }
                    </Field>
                  </div>
                </>
              );
            }}
          </Field>
          <div className="landuse-grid__column-2">
            <Field name={`${fieldName}.daysInYear`}>
              {({ input }) =>
                canEdit ? (
                  <Select
                    id={`landuse-payment-schedule-days-in-year-${scheduleIndex}-${installmentIndex}`}
                    options={[
                      { label: "365", value: "365" },
                      { label: "366", value: "366" },
                    ]}
                    value={input.value || "365"}
                    onChange={(selected) => {
                      if (selected.length > 0) {
                        input.onChange(selected[0].value);
                      }
                    }}
                    texts={{
                      label: "Päiviä vuodessa",
                      placeholder: "Valitse",
                    }}
                  />
                ) : (
                  <TextInput
                    id={`landuse-payment-schedule-days-in-year-${scheduleIndex}-${installmentIndex}`}
                    label="Päiviä vuodessa"
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          </div>
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
                    />
                  ))
                ) : (
                  <p>Ei laskurivejä.</p>
                )}
              </>
            )}
          </FieldArray>
        </section>
      </Fieldset>
    ),
  };
};

interface PartyGroupSectionProps {
  partyLabel: string;
  schedules: Array<{
    fieldName: string;
    index: number;
    schedule: LandUsePaymentScheduleEntry;
  }>;
  isEditMode: boolean;
  parties: PartyEntry[];
  agreementOptions: AgreementOption[];
  korkoResults: KorkoResult[];
  onRemoveSchedule: (index: number) => void;
}

const PartyGroupSection: React.FC<PartyGroupSectionProps> = ({
  partyLabel,
  schedules,
  isEditMode,
  parties,
  agreementOptions,
  korkoResults,
  onRemoveSchedule,
}) => {
  if (schedules.length === 0) {
    return (
      <div className="landuse-payment-schedule__party-group">
        <h2 className="landuse-payment-schedule__party-heading">
          {partyLabel}
        </h2>
        <p>Ei maksusuunnitelmia.</p>
      </div>
    );
  }

  const selectedPartyData = getSelectedPartyInvoiceData(
    schedules[0].schedule.recipientPartyIndex,
    parties,
  );

  return (
    <div className="landuse-payment-schedule__party-group">
      <h2 className="landuse-payment-schedule__party-heading">{partyLabel}</h2>
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-street-address-${schedules[0].index}`}
            label="Katuosoite"
            value={readOnlyTextValue(selectedPartyData.streetAddress)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-city-${schedules[0].index}`}
            label="Postitoimipaikka"
            value={readOnlyTextValue(selectedPartyData.city)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-postal-code-${schedules[0].index}`}
            label="Postinumero"
            value={readOnlyTextValue(selectedPartyData.postalCode)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-ovt-code-${schedules[0].index}`}
            label="OVT-tunnus"
            value={readOnlyTextValue(selectedPartyData.ovtCode)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-reference-${schedules[0].index}`}
            label="Asiakkaan viite"
            value={readOnlyTextValue(selectedPartyData.reference)}
            readOnly
          />
        </div>

        {selectedPartyData.isCompany && (
          <div className="landuse-grid__column-3">
            <TextInput
              id={`landuse-payment-schedule-business-id-${schedules[0].index}`}
              label="Y-tunnus"
              value={readOnlyTextValue(selectedPartyData.businessId)}
              readOnly
            />
          </div>
        )}
      </div>
      <h3>Maksusuunnitelmat</h3>
      {schedules.map(({ fieldName, index, schedule }, scheduleListIndex) => {
        const contractNumber =
          agreementOptions.find(
            (option) => option.value === schedule.contractIndex,
          )?.sopimusnumero ?? "-";

        return (
          <section key={schedule.id}>
            <FieldArray<LandUseInvoice> name={`${fieldName}.installments`}>
              {({ fields: installmentFields }) => (
                <>
                  <div className="landuse-detail__heading-with-delete">
                    <h4>Maksusuunnitelma {scheduleListIndex + 1}</h4>
                    {isEditMode &&
                      schedule.status === LAND_USE_INVOICE_STATUSES.DRAFT && (
                        <ConfirmDeleteButton
                          id={`payment-schedule-${index}-delete`}
                          buttonLabel="Poista maksusuunnitelma"
                          onConfirm={() => onRemoveSchedule(index)}
                          dialogTitle="Poista maksusuunnitelma"
                          dialogContent={`Haluatko varmasti poistaa maksusuunnitelman ${scheduleListIndex + 1}?`}
                        />
                      )}
                  </div>
                  <StepByStep
                    steps={[
                      {
                        title: `Maksusuunnitelman perustiedot`,
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
                                  value={readOnlyTextValue(schedule.signedDate)}
                                  readOnly
                                />
                              </div>
                              <div className="landuse-grid__column-3 landuse-compensations-table__field--background-coat-of-arms-light">
                                <Field name={`${fieldName}.status`}>
                                  {({ input: statusInput }) => {
                                    const statusAction =
                                      getScheduleStatusAction(
                                        statusInput.value,
                                      );
                                    return (
                                      <>
                                        <TextInput
                                          id={`landuse-payment-schedule-status-${index}`}
                                          label="Maksusuunnitelman tila"
                                          value={readOnlyTextValue(
                                            statusInput.value,
                                          )}
                                          readOnly
                                        />
                                        {isEditMode && statusAction && (
                                          <div>
                                            <Button
                                              type="button"
                                              variant={ButtonVariant.Primary}
                                              size={ButtonSize.Small}
                                              onClick={() =>
                                                statusInput.onChange(
                                                  statusAction.nextStatus,
                                                )
                                              }
                                            >
                                              {statusAction.buttonLabel}
                                            </Button>
                                          </div>
                                        )}
                                      </>
                                    );
                                  }}
                                </Field>
                              </div>
                            </div>
                            <div className="landuse-grid landuse-grid__bottom-margin">
                              <div className="landuse-grid__column-12">
                                <strong>Korotus</strong>
                              </div>
                              <div className="landuse-grid__column-3">
                                <Field name={`${fieldName}.korotusPeruskorko`}>
                                  {({ input }) => (
                                    <NumericDecimalInput
                                      id={`landuse-payment-schedule-korotus-peruskorko-${index}`}
                                      label="Peruskorko %"
                                      value={input.value}
                                      onChange={input.onChange}
                                      unit="%"
                                      isEditMode={
                                        isEditMode &&
                                        schedule.status ===
                                          LAND_USE_INVOICE_STATUSES.DRAFT
                                      }
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="landuse-grid__column-3">
                                <Field name={`${fieldName}.korotusMarginaali`}>
                                  {({ input }) => (
                                    <NumericDecimalInput
                                      id={`landuse-payment-schedule-korotus-marginaali-${index}`}
                                      label="Marginaali %"
                                      value={input.value}
                                      onChange={input.onChange}
                                      unit="%"
                                      isEditMode={
                                        isEditMode &&
                                        schedule.status ===
                                          LAND_USE_INVOICE_STATUSES.DRAFT
                                      }
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                            <div className="landuse-grid landuse-grid__bottom-margin">
                              <div className="landuse-grid__column-12">
                                <strong>Korko</strong>
                              </div>
                              <div className="landuse-grid__column-3">
                                <Field name={`${fieldName}.korkoPeruskorko`}>
                                  {({ input }) => (
                                    <NumericDecimalInput
                                      id={`landuse-payment-schedule-korko-peruskorko-${index}`}
                                      label="Peruskorko %"
                                      value={input.value}
                                      onChange={input.onChange}
                                      unit="%"
                                      isEditMode={
                                        isEditMode &&
                                        schedule.status ===
                                          LAND_USE_INVOICE_STATUSES.DRAFT
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
                                      label="Marginaali %"
                                      value={input.value}
                                      onChange={input.onChange}
                                      unit="%"
                                      isEditMode={
                                        isEditMode &&
                                        schedule.status ===
                                          LAND_USE_INVOICE_STATUSES.DRAFT
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
                            invoice: installmentFields.value[installmentIndex],
                            korkoResults,
                            onRemove: () =>
                              installmentFields.remove(installmentIndex),
                          }),
                      ),
                    ]}
                  />
                </>
              )}
            </FieldArray>
          </section>
        );
      })}
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
  korkoResults,
  setKorkoResults,
}) => {
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);

  const partyOptions = React.useMemo(
    () => createInvoiceRecipientOptions(parties ?? []),
    [parties],
  );
  const agreementOptions = React.useMemo(
    () => createInvoiceContractOptions(contracts ?? []),
    [contracts],
  );

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
      agreementOptions.find((o) => o.value === values.contractIndex)
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
      status: LAND_USE_INVOICE_STATUSES.DRAFT,
      signedDate,
      korotusPeruskorko: "",
      korotusMarginaali: "",
      korkoPeruskorko: "",
      korkoMarginaali: "",
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
                <div className="landuse-grid__column-12">
                  {isEditMode && (
                    <div className="landuse-invoicing__invoice-actions">
                      <Button
                        type="button"
                        variant={ButtonVariant.Supplementary}
                        iconStart={<IconPlusCircle />}
                        onClick={() => setIsBulkCreateOpen(true)}
                      >
                        Syötä maksusuunnitelma
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="landuse-grid landuse-grid__bottom-margin">
                <div className="landuse-grid__column-3">
                  <TextInput
                    id="landuse-payment-schedule-asemakaavanumero"
                    label="Kaavanumero"
                    value={readOnlyTextValue(asemakaavanNumero)}
                    readOnly
                  />
                </div>
                <div className="landuse-grid__column-3">
                  <Field name="asemakaavanLainvoimaisuusPvm">
                    {({ input }) => (
                      <TextInput
                        id={`landuse-payment-schedule-valid-date`}
                        label="Lainvoimaisuuspäivämäärä"
                        value={readOnlyTextValue(input.value)}
                        readOnly
                      />
                    )}
                  </Field>
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
                              partyLabel={partyOption.label}
                              schedules={
                                groupedByParty.get(partyOption.value) ?? []
                              }
                              isEditMode={isEditMode}
                              parties={parties}
                              agreementOptions={agreementOptions}
                              korkoResults={korkoResults}
                              onRemoveSchedule={fields.remove}
                            />
                          ))}
                        </>
                      );
                    }}
                  </FieldArray>
                </Fieldset>
              </form>
              <h2>Korkolaskin</h2>
              <KorkoCalculator
                korkoResults={korkoResults}
                setKorkoResults={setKorkoResults}
              />
            </div>
          );
        }}
      />
      <BulkCreateInvoicesDialog
        isOpen={isBulkCreateOpen}
        onClose={() => setIsBulkCreateOpen(false)}
        onSubmit={handleBulkCreate}
        partyOptions={partyOptions}
        agreementOptions={agreementOptions}
        asemakaavanLainvoimaisuusPvm={asemakaavanLainvoimaisuusPvm}
      />
    </>
  );
};
