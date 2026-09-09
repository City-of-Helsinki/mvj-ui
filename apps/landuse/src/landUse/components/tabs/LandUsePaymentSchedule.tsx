import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";
import { FormApi } from "final-form";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  DateInput,
  Dialog,
  Fieldset,
  IconAngleDown,
  IconAngleUp,
  IconPlusCircle,
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
  AsemakaavaListItem,
  LAND_USE_INVOICE_ITEM_TYPES,
  LAND_USE_INVOICE_TYPES,
  landUseInvoiceItemTypeSelectOptions,
  landUseInvoiceTypeSelectOptions,
} from "../../options";
import {
  getFieldTextValue,
  getOptionsDisplayValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "../../utils/fieldUtils";
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
  invoices?: LandUseInvoice[];
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

function isInvoiceEditableBasedOnStatus(invoice: LandUseInvoice): boolean {
  if (!invoice || !invoice.status) return true;
  const editableStatuses: LandUseInvoiceStatus[] = [
    LAND_USE_INVOICE_STATUSES.DRAFT,
    LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL,
  ];

  return editableStatuses.includes(invoice.status);
}

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

const createEmptyInvoiceTableRow = (
  recipientPartyIndex: string | undefined,
  contractIndex: string | undefined,
): LandUseInvoice => ({
  recipientPartyIndex,
  contractIndex,
  installmentNumber: "",
  installmentTotal: "",
  signedDate: "",
  asemakaavanLainvoimaisuusPvm: "",
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
  parties: PartyEntry[];
  partyOptions: SelectOption[];
  agreementOptions: AgreementOption[];
  asemakaavanNumero: string;
  korkoResults: KorkoResult[];
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

  const isSubmitDisabled = installmentTotal === "" || installmentTotal <= 0;

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
        title="Luo maankäyttökorvaus laskuja"
      />
      <Dialog.Content>
        <div className="landuse-grid">
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
            <Select
              id="bulk-create-recipient-schedule"
              options={partyOptions}
              value={normalizeSelectValue(recipientPartyIndex)}
              onChange={(selected) =>
                handleSelectChange(selected, setRecipientPartyIndex)
              }
              disabled={partyOptions.length === 0}
              texts={{
                label: "Laskunsaaja",
                placeholder:
                  partyOptions.length > 0 ? "Valitse" : "Ei osapuolia",
              }}
            />
          </div>
          <div className="landuse-grid__column-12">
            <DateInput
              id="bulk-create-valid-date-schedule"
              label="Lainvoimaisuus"
              value={asemakaavanLainvoimaisuusPvmValue}
              onChange={setAsemakaavanLainvoimaisuusPvmValue}
              placeholder="DD.MM.YYYY"
              language="fi"
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

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({
  fieldName,
  index,
  isEditMode,
  isExistingInvoice,
  isOpen,
  parties,
  partyOptions,
  agreementOptions,
  asemakaavanNumero,
  korkoResults,
  isInvoiceTableRowEditable,
  onRemove,
  onToggle,
}) => {
  const canEditContract =
    isEditMode && !isExistingInvoice && isInvoiceTableRowEditable;

  return (
    <Field name={fieldName} subscription={{ value: true }}>
      {({ input }) => {
        const invoice = (input.value ?? {}) as LandUseInvoice;
        const contractNumberDisplayValue =
          agreementOptions.find(
            (option) => option.value === invoice.contractIndex,
          )?.sopimusnumero ?? "-";
        const installmentDisplayValue =
          invoice.installmentNumber && invoice.installmentTotal
            ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
            : "-";
        const selectedPartyData = getSelectedPartyInvoiceData(
          invoice.recipientPartyIndex,
          parties,
        );

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
              <td>{readOnlyTextValue(contractNumberDisplayValue)}</td>
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
                <td colSpan={10}>
                  <div
                    className="landuse-compensations-table__detail-content"
                    aria-label={`Laskun ${invoice.invoiceNumber || index + 1} tiedot`}
                  >
                    <div className="landuse-grid landuse-grid__bottom-margin">
                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.type`}>
                          {({ input: typeInput }) =>
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <Select
                                id={`landuse-payment-schedule-type-${index}`}
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
                                id={`landuse-payment-schedule-type-${index}`}
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
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <Select
                                id={`landuse-payment-schedule-recipient-${index}`}
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
                                id={`landuse-payment-schedule-recipient-${index}`}
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
                        <Field name={`${fieldName}.contractIndex`}>
                          {({ input: contractInput }) =>
                            canEditContract ? (
                              <Select
                                id={`landuse-payment-schedule-contract-${index}`}
                                options={agreementOptions}
                                value={normalizeSelectValue(
                                  contractInput.value,
                                )}
                                onChange={(selectedOptions) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    contractInput.onChange,
                                  )
                                }
                                disabled={agreementOptions.length === 0}
                                texts={{
                                  label: "Sopimus",
                                  placeholder:
                                    agreementOptions.length > 0
                                      ? "Valitse"
                                      : "Ei sopimuksia",
                                }}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-contract-${index}`}
                                label="Sopimus"
                                value={
                                  agreementOptions.find(
                                    (option) =>
                                      option.value === contractInput.value,
                                  )?.label ?? "-"
                                }
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
                                    id={`landuse-payment-schedule-status-${index}`}
                                    label="Laskun tila"
                                    value={readOnlyTextValue(statusInput.value)}
                                    readOnly
                                  />
                                  {isEditMode &&
                                    isInvoiceEditableBasedOnStatus(invoice) &&
                                    statusAction && (
                                      <div>
                                        <Button
                                          type="button"
                                          variant={ButtonVariant.Primary}
                                          size={ButtonSize.Small}
                                          onClick={() => {
                                            const nextSentAtValue =
                                              statusAction.nextStatus ===
                                              "Avoin"
                                                ? getSentAtTimestamp()
                                                : (invoice.sentAt ?? "");
                                            if (
                                              statusAction.nextStatus ===
                                              "Avoin"
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

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-contract-number-${index}`}
                          label="Sopimusnumero"
                          value={contractNumberDisplayValue}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-asemakaavanumero-${index}`}
                          label="Kaavanumero"
                          value={readOnlyTextValue(asemakaavanNumero)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-street-address-${index}`}
                          label="Katuosoite"
                          value={readOnlyTextValue(
                            selectedPartyData.streetAddress,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-city-${index}`}
                          label="Postitoimipaikka"
                          value={readOnlyTextValue(selectedPartyData.city)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-postal-code-${index}`}
                          label="Postinumero"
                          value={readOnlyTextValue(
                            selectedPartyData.postalCode,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-ovt-code-${index}`}
                          label="OVT-tunnus"
                          value={readOnlyTextValue(selectedPartyData.ovtCode)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-payment-schedule-reference-${index}`}
                          label="Asiakkaan viite"
                          value={readOnlyTextValue(selectedPartyData.reference)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        {selectedPartyData.isCompany && (
                          <TextInput
                            id={`landuse-payment-schedule-business-id-${index}`}
                            label="Y-tunnus"
                            value={readOnlyTextValue(
                              selectedPartyData.businessId,
                            )}
                            readOnly
                          />
                        )}
                      </div>

                      <div className="landuse-grid__column-1">
                        <Field name={`${fieldName}.installmentNumber`}>
                          {({ input: installmentNumberInput }) =>
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <NumberInput
                                id={`landuse-payment-schedule-installment-number-${index}`}
                                label="Laskutuserä"
                                value={installmentNumberInput.value}
                                onChange={installmentNumberInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-installment-number-${index}`}
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
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <NumberInput
                                id={`landuse-payment-schedule-installment-total-${index}`}
                                label="Laskutuseriä yhteensä"
                                value={installmentTotalInput.value}
                                onChange={installmentTotalInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-installment-total-${index}`}
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

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.signedDate`}>
                          {({ input: signedDateInput }) =>
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <DateInput
                                id={`landuse-payment-schedule-signed-date-${index}`}
                                label="Allekirjoituspäivämäärä"
                                value={signedDateInput.value}
                                onChange={signedDateInput.onChange}
                                placeholder="DD.MM.YYYY"
                                language="fi"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-signed-date-${index}`}
                                label="Allekirjoituspäivämäärä"
                                value={readOnlyTextValue(signedDateInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field
                          name={`${fieldName}.asemakaavanLainvoimaisuusPvm`}
                        >
                          {({ input: asemakaavanLainvoimaisuusPvmInput }) =>
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <DateInput
                                id={`landuse-payment-schedule-valid-date-${index}`}
                                label="Lainvoimaisuuspäivämäärä"
                                value={asemakaavanLainvoimaisuusPvmInput.value}
                                onChange={
                                  asemakaavanLainvoimaisuusPvmInput.onChange
                                }
                                placeholder="DD.MM.YYYY"
                                language="fi"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-valid-date-${index}`}
                                label="Lainvoimaisuuspäivämäärä"
                                value={readOnlyTextValue(
                                  asemakaavanLainvoimaisuusPvmInput.value,
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
                            isEditMode &&
                            isInvoiceEditableBasedOnStatus(invoice) ? (
                              <DateInput
                                id={`landuse-payment-schedule-due-date-${index}`}
                                label="Eräpäivä"
                                value={dueDateInput.value}
                                onChange={dueDateInput.onChange}
                                placeholder="DD.MM.YYYY"
                                language="fi"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-payment-schedule-due-date-${index}`}
                                label="Eräpäivä"
                                value={readOnlyTextValue(dueDateInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>
                    </div>
                    <div className="landuse-grid landuse-grid__bottom-margin">
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
                                      <div
                                        key={invoiceItemFieldName}
                                        className="landuse-grid landuse-grid__bottom-margin"
                                      >
                                        <div
                                          className={"landuse-grid__column-12"}
                                        >
                                          <Field
                                            name={`${invoiceItemFieldName}.description`}
                                          >
                                            {({ input: descriptionInput }) => (
                                              <TextInput
                                                id={`landuse-payment-schedule-invoice-row-description-${index}-${invoiceItemIndex}`}
                                                label="Selite"
                                                value={getFieldTextValue(
                                                  isEditMode &&
                                                    isInvoiceEditableBasedOnStatus(
                                                      invoice,
                                                    ),
                                                  descriptionInput.value,
                                                )}
                                                onChange={
                                                  descriptionInput.onChange
                                                }
                                                readOnly={
                                                  !isEditMode ||
                                                  !isInvoiceEditableBasedOnStatus(
                                                    invoice,
                                                  )
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
                                              isEditMode &&
                                              isInvoiceEditableBasedOnStatus(
                                                invoice,
                                              ) ? (
                                                <Select
                                                  id={`landuse-payment-schedule-invoice-row-item-type-${index}-${invoiceItemIndex}`}
                                                  texts={{
                                                    label: "Laskurivin tyyppi",
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
                                                  id={`landuse-payment-schedule-invoice-row-item-type-${index}-${invoiceItemIndex}`}
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
                                            <>
                                              <div className="landuse-grid__column-2">
                                                <NumericDecimalInput
                                                  id={`landuse-payment-schedule-invoice-row-amount-${index}-${invoiceItemIndex}`}
                                                  label="Veroton summa (€)"
                                                  value={amountInput.value}
                                                  onChange={
                                                    amountInput.onChange
                                                  }
                                                  unit="€"
                                                  isEditMode={
                                                    isEditMode &&
                                                    isInvoiceEditableBasedOnStatus(
                                                      invoice,
                                                    )
                                                  }
                                                />
                                              </div>

                                              {isEditMode &&
                                                isInvoiceEditableBasedOnStatus(
                                                  invoice,
                                                ) && (
                                                  <div className="landuse-grid__column-2">
                                                    <Select
                                                      id={`landuse-payment-schedule-invoice-row-korko-select-${index}-${invoiceItemIndex}`}
                                                      options={korkoResults.map(
                                                        (r) => ({
                                                          label: `${r.id}. ${formatLandUseEuroDisplayValue(r.korkoValue)}`,
                                                          value: String(
                                                            r.korkoValue,
                                                          ),
                                                        }),
                                                      )}
                                                      onChange={(selected) => {
                                                        if (
                                                          selected.length > 0
                                                        ) {
                                                          amountInput.onChange(
                                                            Number(
                                                              selected[0].value,
                                                            ).toFixed(2),
                                                          );
                                                        }
                                                      }}
                                                      disabled={
                                                        korkoResults.length ===
                                                        0
                                                      }
                                                      texts={{
                                                        label:
                                                          "Täytä korkolaskimesta",
                                                        placeholder:
                                                          korkoResults.length >
                                                          0
                                                            ? "Valitse"
                                                            : "Ei tuloksia",
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                            </>
                                          )}
                                        </Field>

                                        {isEditMode &&
                                          isInvoiceEditableBasedOnStatus(
                                            invoice,
                                          ) && (
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
                                    ),
                                  )
                                ) : (
                                  <p>Ei laskurivejä.</p>
                                )}

                                {isEditMode &&
                                  isInvoiceEditableBasedOnStatus(invoice) && (
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
                    {isEditMode && (
                      <div className="landuse-compensations-table__detail-actions">
                        <ConfirmDeleteButton
                          id={`payment-schedule-delete-${index}`}
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
  const [openInvoiceIndex, setOpenInvoiceIndex] = useState<number | null>(null);
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
    if (!total || total <= 0) return;

    const selectedContract = contracts[Number(values.contractIndex)];
    const signedDate = selectedContract?.allekirjoituspvm ?? "";
    const sopimusnumero =
      agreementOptions.find((o) => o.value === values.contractIndex)
        ?.sopimusnumero ?? "";
    const recipientName =
      partyOptions.find((o) => o.value === values.recipientPartyIndex)?.label ??
      "";

    const currentLength = form.getState().values.invoices?.length ?? 0;

    for (let i = 0; i < total; i++) {
      form.mutators.push(
        "invoices",
        createBulkInvoice(
          i + 1,
          values,
          signedDate,
          agreementIdentifier,
          sopimusnumero,
          asemakaavanNumero,
          recipientName,
        ),
      );
    }

    setOpenInvoiceIndex(currentLength);
    setIsBulkCreateOpen(false);
  };

  return (
    <>
      <Form<LandUsePaymentScheduleFormValues>
        form={form}
        onSubmit={() => {}}
        render={({ handleSubmit }) => {
          const existingInvoices =
            (
              form.getState().initialValues as
                LandUsePaymentScheduleFormValues | undefined
            )?.invoices ?? [];

          const handleAddInvoice = (
            push: (value: LandUseInvoice) => void,
            currentLength: number,
          ) => {
            push(
              createEmptyInvoiceTableRow(
                partyOptions[0]?.value,
                agreementOptions[0]?.value,
              ),
            );
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
              <h1>Maksuaikataulu ja erät</h1>
              <form onSubmit={handleSubmit}>
                <Fieldset
                  heading=""
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__sites-table-wrapper">
                    <FieldArray<LandUseInvoice> name="invoices">
                      {({ fields }) => (
                        <>
                          <table className="landuse-compensations-table">
                            <thead>
                              <tr>
                                <th className="landuse-compensations-table__toggle-cell" />
                                <th>Laskunsaaja</th>
                                <th>Sopimusnumero</th>
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
                                    agreementOptions={agreementOptions}
                                    asemakaavanNumero={asemakaavanNumero}
                                    korkoResults={korkoResults}
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
                                  <td colSpan={10}>Ei laskuja.</td>
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
                              <Button
                                type="button"
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconPlusCircle />}
                                onClick={() => setIsBulkCreateOpen(true)}
                              >
                                Lisää useita maankäyttökorvauslaskuja
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </FieldArray>
                  </div>
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
