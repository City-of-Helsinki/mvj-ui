import React, { useState } from "react";
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
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { FormApi } from "final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
  type SelectOption,
} from "../../utils/fieldUtils";
import {
  landUseInvoicingSelectOptions,
  LAND_USE_INVOICE_TYPES,
  type LandUseInvoiceType,
  AsemakaavaListItem,
} from "../../options";
import { formatLandUseEuroDisplayValue } from "../../utils/number";
import type { PartyEntry } from "./LandUseParties";
import type { LandUseDecisionsFormValues } from "./LandUseDecisions";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { KorotusCalculator } from "../invoicing/KorotusCalculator";
import { KorkoCalculator } from "../invoicing/KorkoCalculator";

type AgreementItem = NonNullable<
  LandUseDecisionsFormValues["agreements"]
>[number];

interface AgreementOption extends SelectOption {
  sopimusnumero: string;
}

export interface LandUseInvoiceItemRow {
  description: string;
  amountExcludingVat: string;
}

export interface LandUseInvoiceRow {
  recipientPartyIndex: string | undefined;
  contractIndex: string | undefined;
  installmentNumber: string;
  installmentTotal: string;
  signedDate: string;
  lainvoimaisuusPvm: AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"];
  dueDate: string;
  invoiceNumber: string;
  type: LandUseInvoiceType | undefined;
  status: string | undefined;
  sent_at?: string;
  billedAmount: string;
  remainingAmount: string;
  invoiceRows?: LandUseInvoiceItemRow[];
}

export interface LandUseInvoicingFormValues {
  invoices?: LandUseInvoiceRow[];
}

interface LandUseInvoicingProps {
  form: FormApi<LandUseInvoicingFormValues>;
  isEditMode: boolean;
  parties: PartyEntry[];
  agreements: AgreementItem[];
  asemakaavanNumero: string;
  agreementIdentifier: string;
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

const invoiceTypeOptions = landUseInvoicingSelectOptions.type.map((value) => ({
  label: value,
  value,
}));

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

const createInvoiceAgreementOptions = (
  agreements: AgreementItem[],
): AgreementOption[] =>
  agreements.map((agreement, index) => {
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

const createEmptyInvoiceRow = (
  recipientPartyIndex: string | undefined,
  contractIndex: string | undefined,
): LandUseInvoiceRow => ({
  recipientPartyIndex,
  contractIndex,
  installmentNumber: "",
  installmentTotal: "",
  signedDate: "",
  lainvoimaisuusPvm: "",
  dueDate: "",
  invoiceNumber: "",
  type: undefined,
  status: "Luonnos",
  sent_at: "",
  billedAmount: "",
  remainingAmount: "",
  invoiceRows: [],
});

const createEmptyInvoiceItemRow = (): LandUseInvoiceItemRow => ({
  description: "",
  amountExcludingVat: "",
});

const getInvoiceStatusAction = (
  status: string | undefined,
): { buttonLabel: string; nextStatus: string } | null => {
  if (status === "Luonnos") {
    return {
      buttonLabel: "Merkitse valmiiksi",
      nextStatus: "Odottaa hyväksyntää",
    };
  }

  if (status === "Odottaa hyväksyntää") {
    return {
      buttonLabel: "Hyväksy ja lähetä",
      nextStatus: "Avoin",
    };
  }

  return null;
};

interface InvoiceRowProps {
  fieldName: string;
  index: number;
  isEditMode: boolean;
  isExistingInvoice: boolean;
  isOpen: boolean;
  parties: PartyEntry[];
  partyOptions: SelectOption[];
  agreementOptions: AgreementOption[];
  asemakaavanNumero: string;
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
  lainvoimaisuusPvm: string;
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
  agreementType: string,
  sopimusnumero: string,
  asemakaavanNumero: string,
  recipientName: string,
): LandUseInvoiceRow => ({
  recipientPartyIndex: values.recipientPartyIndex,
  contractIndex: values.contractIndex,
  installmentNumber: String(installmentNumber),
  installmentTotal: values.installmentTotal,
  signedDate,
  lainvoimaisuusPvm: values.lainvoimaisuusPvm,
  dueDate: "",
  invoiceNumber: "",
  type: LAND_USE_INVOICE_TYPES.MAANKAYTOKORVAUS,
  status: "Luonnos",
  sent_at: "",
  billedAmount: "",
  remainingAmount: "",
  invoiceRows: [
    {
      description: "Maksutuotot maankäyttösopimuksista",
      amountExcludingVat: "",
    },
    {
      description: buildSecondRowSelite(
        agreementType,
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
}

const BulkCreateInvoicesDialog: React.FC<BulkCreateInvoicesDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partyOptions,
  agreementOptions,
}) => {
  const [installmentTotal, setInstallmentTotal] = useState<number | "">("");
  const [contractIndex, setContractIndex] = useState<string | undefined>(
    undefined,
  );
  const [recipientPartyIndex, setRecipientPartyIndex] = useState<
    string | undefined
  >(undefined);
  const [lainvoimaisuusPvm, setLainvoimaisuusPvm] =
    useState<AsemakaavaListItem["asemakaavanLainvoimaisuusPvm"]>("");

  const reset = () => {
    setInstallmentTotal("");
    setContractIndex(undefined);
    setRecipientPartyIndex(undefined);
    setLainvoimaisuusPvm("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({
      installmentTotal: String(installmentTotal),
      contractIndex,
      recipientPartyIndex,
      lainvoimaisuusPvm,
    });
    reset();
  };

  const isSubmitDisabled = installmentTotal === "" || installmentTotal <= 0;

  return (
    <Dialog
      id="landuse-bulk-create-invoices"
      isOpen={isOpen}
      aria-labelledby="landuse-bulk-create-invoices-title"
      closeButtonLabelText="Sulje"
      close={handleClose}
    >
      <Dialog.Header
        id="landuse-bulk-create-invoices-title"
        title="Luo maankäyttökorvaus laskuja"
      />
      <Dialog.Content>
        <div className="landuse-grid">
          <div className="landuse-grid__column-12">
            <NumberInput
              id="bulk-create-installment-total"
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
              id="bulk-create-contract"
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
              id="bulk-create-recipient"
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
              id="bulk-create-valid-date"
              label="Lainvoimaisuus"
              value={lainvoimaisuusPvm}
              onChange={setLainvoimaisuusPvm}
              placeholder="DD.MM.YYYY"
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
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Luo laskut
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  fieldName,
  index,
  isEditMode,
  isExistingInvoice,
  isOpen,
  parties,
  partyOptions,
  agreementOptions,
  asemakaavanNumero,
  onRemove,
  onToggle,
}) => {
  const canEditContract = isEditMode && !isExistingInvoice;

  return (
    <Field name={fieldName} subscription={{ value: true }}>
      {({ input }) => {
        const rowValue = (input.value ?? {}) as LandUseInvoiceRow;
        const contractNumberDisplayValue =
          agreementOptions.find(
            (option) => option.value === rowValue.contractIndex,
          )?.sopimusnumero ?? "-";
        const installmentDisplayValue =
          rowValue.installmentNumber && rowValue.installmentTotal
            ? `${rowValue.installmentNumber}/${rowValue.installmentTotal}`
            : "-";
        const selectedPartyData = getSelectedPartyInvoiceData(
          rowValue.recipientPartyIndex,
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
                {getRecipientDisplayValue(
                  rowValue.recipientPartyIndex,
                  partyOptions,
                )}
              </td>
              <td>{readOnlyTextValue(contractNumberDisplayValue)}</td>
              <td>{readOnlyTextValue(installmentDisplayValue)}</td>
              <td>{readOnlyTextValue(rowValue.dueDate)}</td>
              <td>{readOnlyTextValue(rowValue.invoiceNumber)}</td>
              <td>{readOnlyTextValue(rowValue.type)}</td>
              <td>{readOnlyTextValue(rowValue.status)}</td>
              <td>{formatLandUseEuroDisplayValue(rowValue.billedAmount)}</td>
              <td>{formatLandUseEuroDisplayValue(rowValue.remainingAmount)}</td>
            </tr>
            {isOpen && (
              <tr className="landuse-compensations-table__detail-row">
                <td colSpan={10}>
                  <div
                    className="landuse-compensations-table__detail-content landuse-compensations-table__detail-content--overflow-visible"
                    aria-label={`Laskun ${rowValue.invoiceNumber || index + 1} tiedot`}
                  >
                    <div className="landuse-grid landuse-grid__bottom-margin">
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
                                  label: "Laskun tyyppi",
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
                        <Field name={`${fieldName}.contractIndex`}>
                          {({ input: contractInput }) =>
                            canEditContract ? (
                              <Select
                                id={`landuse-invoicing-contract-${index}`}
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
                                id={`landuse-invoicing-contract-${index}`}
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
                                    id={`landuse-invoicing-status-${index}`}
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
                                              : (rowValue.sent_at ?? "");

                                          input.onChange({
                                            ...rowValue,
                                            status: statusAction.nextStatus,
                                            sent_at: nextSentAtValue,
                                          });
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
                          id={`landuse-invoicing-contract-number-${index}`}
                          label="Sopimusnumero"
                          value={contractNumberDisplayValue}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-asemakaavanumero-${index}`}
                          label="Kaavanumero"
                          value={readOnlyTextValue(asemakaavanNumero)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-street-address-${index}`}
                          label="Katuosoite"
                          value={readOnlyTextValue(
                            selectedPartyData.streetAddress,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-city-${index}`}
                          label="Postitoimipaikka"
                          value={readOnlyTextValue(selectedPartyData.city)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-postal-code-${index}`}
                          label="Postinumero"
                          value={readOnlyTextValue(
                            selectedPartyData.postalCode,
                          )}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-ovt-code-${index}`}
                          label="OVT-tunnus"
                          value={readOnlyTextValue(selectedPartyData.ovtCode)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3">
                        <TextInput
                          id={`landuse-invoicing-reference-${index}`}
                          label="Asiakkaan viite"
                          value={readOnlyTextValue(selectedPartyData.reference)}
                          readOnly
                        />
                      </div>

                      {selectedPartyData.isCompany && (
                        <div className="landuse-grid__column-3">
                          <TextInput
                            id={`landuse-invoicing-business-id-${index}`}
                            label="Y-tunnus"
                            value={readOnlyTextValue(
                              selectedPartyData.businessId,
                            )}
                            readOnly
                          />
                        </div>
                      )}

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.installmentNumber`}>
                          {({ input: installmentNumberInput }) =>
                            isEditMode ? (
                              <NumberInput
                                id={`landuse-invoicing-installment-number-${index}`}
                                label="Laskutuserä"
                                value={installmentNumberInput.value}
                                onChange={installmentNumberInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-installment-number-${index}`}
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

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.installmentTotal`}>
                          {({ input: installmentTotalInput }) =>
                            isEditMode ? (
                              <NumberInput
                                id={`landuse-invoicing-installment-total-${index}`}
                                label="Laskutuseriä yhteensä"
                                value={installmentTotalInput.value}
                                onChange={installmentTotalInput.onChange}
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-installment-total-${index}`}
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
                            isEditMode ? (
                              <DateInput
                                id={`landuse-invoicing-signed-date-${index}`}
                                label="Allekirjoituspäivämäärä"
                                value={signedDateInput.value}
                                onChange={signedDateInput.onChange}
                                placeholder="DD.MM.YYYY"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-signed-date-${index}`}
                                label="Allekirjoituspäivämäärä"
                                value={readOnlyTextValue(signedDateInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <div className="landuse-grid__column-3">
                        <Field name={`${fieldName}.lainvoimaisuusPvm`}>
                          {({ input: lainvoimaisuusPvmInput }) =>
                            isEditMode ? (
                              <DateInput
                                id={`landuse-invoicing-valid-date-${index}`}
                                label="Lainvoimaisuuspäivämäärä"
                                value={lainvoimaisuusPvmInput.value}
                                onChange={lainvoimaisuusPvmInput.onChange}
                                placeholder="DD.MM.YYYY"
                              />
                            ) : (
                              <TextInput
                                id={`landuse-invoicing-valid-date-${index}`}
                                label="Lainvoimaisuuspäivämäärä"
                                value={readOnlyTextValue(
                                  lainvoimaisuusPvmInput.value,
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
                    </div>
                    <div className="landuse-grid landuse-grid__bottom-margin">
                      <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
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

                      <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
                        <TextInput
                          id={`landuse-invoicing-sent-at-${index}`}
                          label="Lähetetty laskutukseen"
                          value={readOnlyTextValue(rowValue.sent_at)}
                          readOnly
                        />
                      </div>

                      <div className="landuse-grid__column-3 landuse-compensations-table__field--grey">
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
                    <div className="landuse-grid landuse-grid__bottom-margin">
                      <div className="landuse-grid__column-12">
                        <Fieldset heading="Laskurivit">
                          <FieldArray<LandUseInvoiceItemRow>
                            name={`${fieldName}.invoiceRows`}
                          >
                            {({ fields: invoiceRowFields }) => (
                              <>
                                {invoiceRowFields.length > 0 ? (
                                  invoiceRowFields.map(
                                    (invoiceRowFieldName, invoiceRowIndex) => (
                                      <div
                                        key={invoiceRowFieldName}
                                        className="landuse-grid"
                                      >
                                        <div className="landuse-grid__column-6">
                                          <Field
                                            name={`${invoiceRowFieldName}.description`}
                                          >
                                            {({ input: descriptionInput }) => (
                                              <TextInput
                                                id={`landuse-invoicing-invoice-row-description-${index}-${invoiceRowIndex}`}
                                                label="Selite"
                                                value={getFieldTextValue(
                                                  isEditMode,
                                                  descriptionInput.value,
                                                )}
                                                onChange={
                                                  descriptionInput.onChange
                                                }
                                                readOnly={!isEditMode}
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        <div className="landuse-grid__column-3">
                                          <Field
                                            name={`${invoiceRowFieldName}.amountExcludingVat`}
                                          >
                                            {({ input: amountInput }) => (
                                              <TextInput
                                                id={`landuse-invoicing-invoice-row-amount-${index}-${invoiceRowIndex}`}
                                                label="Veroton summa (€)"
                                                value={getFieldTextValue(
                                                  isEditMode,
                                                  amountInput.value,
                                                )}
                                                onChange={amountInput.onChange}
                                                readOnly={!isEditMode}
                                              />
                                            )}
                                          </Field>
                                        </div>

                                        {isEditMode && (
                                          <div className="landuse-grid__column-3 landuse-compensations-table__detail-actions">
                                            <Button
                                              type="button"
                                              size={ButtonSize.Small}
                                              variant={ButtonVariant.Secondary}
                                              onClick={() =>
                                                invoiceRowFields.remove(
                                                  invoiceRowIndex,
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

                                {isEditMode && (
                                  <div>
                                    <Button
                                      type="button"
                                      variant={ButtonVariant.Supplementary}
                                      size={ButtonSize.Small}
                                      iconStart={<IconPlusCircleFill />}
                                      onClick={() =>
                                        invoiceRowFields.push(
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
  agreements,
  asemakaavanNumero,
  agreementIdentifier,
}) => {
  const [openInvoiceIndex, setOpenInvoiceIndex] = useState<number | null>(null);
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);

  const partyOptions = React.useMemo(
    () => createInvoiceRecipientOptions(parties ?? []),
    [parties],
  );
  const agreementOptions = React.useMemo(
    () => createInvoiceAgreementOptions(agreements ?? []),
    [agreements],
  );

  const handleBulkCreate = (values: BulkCreateFormValues) => {
    const total = parseInt(values.installmentTotal, 10);
    if (!total || total <= 0) return;

    const selectedAgreement = agreements[Number(values.contractIndex)];
    const signedDate = selectedAgreement?.allekirjoituspvm ?? "";
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
      <Form<LandUseInvoicingFormValues>
        form={form}
        onSubmit={() => {}}
        render={({ handleSubmit }) => {
          const existingInvoices =
            (
              form.getState().initialValues as
                | LandUseInvoicingFormValues
                | undefined
            )?.invoices ?? [];

          const handleAddInvoice = (
            push: (value: LandUseInvoiceRow) => void,
            currentLength: number,
          ) => {
            push(
              createEmptyInvoiceRow(
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
              <h1>Laskutus</h1>
              <form onSubmit={handleSubmit}>
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
                                  <InvoiceRow
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
              <h2>Korotuslaskin</h2>
              <KorotusCalculator />

              <h2>Korkolaskin</h2>
              <KorkoCalculator />
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
      />
    </>
  );
};
