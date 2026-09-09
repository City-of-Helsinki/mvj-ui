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
  IconPlusCircleFill,
  NumberInput,
  Select,
  StepByStep,
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
  return invoice.status === LAND_USE_INVOICE_STATUSES.DRAFT;
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
        title="Luo maksuaikataulu"
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

interface InvoiceGroupEntry {
  fieldName: string;
  index: number;
  invoice: LandUseInvoice;
  isExistingInvoice: boolean;
}

const buildInstallmentStep = ({
  fieldName,
  index,
  isEditMode,
  invoice,
  korkoResults,
  onRemove,
}: {
  fieldName: string;
  index: number;
  isEditMode: boolean;
  invoice: LandUseInvoice;
  korkoResults: KorkoResult[];
  onRemove: (index: number) => void;
}) => {
  const canEdit = isEditMode && isInvoiceEditableBasedOnStatus(invoice);
  const installmentLabel =
    invoice.installmentNumber && invoice.installmentTotal
      ? `${invoice.installmentNumber}/${invoice.installmentTotal}`
      : `Erä ${index + 1}`;

  return {
    title: installmentLabel,
    key: `installment-${index}`,
    description: (
      <Fieldset heading="" className="full-width">
        <div className="landuse-grid landuse-grid__bottom-margin">
          <div className="landuse-grid__column-1">
            <Field name={`${fieldName}.installmentNumber`}>
              {({ input }) =>
                canEdit ? (
                  <NumberInput
                    id={`landuse-payment-schedule-installment-number-${index}`}
                    label="Laskutuserä"
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`landuse-payment-schedule-installment-number-${index}`}
                    label="Laskutuserä"
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          </div>

          <div className="landuse-grid__column-2">
            <Field name={`${fieldName}.installmentTotal`}>
              {({ input }) =>
                canEdit ? (
                  <NumberInput
                    id={`landuse-payment-schedule-installment-total-${index}`}
                    label="Laskutuseriä yhteensä"
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`landuse-payment-schedule-installment-total-${index}`}
                    label="Laskutuseriä yhteensä"
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          </div>

          <div className="landuse-grid__column-3">
            <Field name={`${fieldName}.dueDate`}>
              {({ input }) =>
                canEdit ? (
                  <DateInput
                    id={`landuse-payment-schedule-due-date-${index}`}
                    label="Eräpäivä"
                    value={input.value}
                    onChange={input.onChange}
                    placeholder="DD.MM.YYYY"
                    language="fi"
                  />
                ) : (
                  <TextInput
                    id={`landuse-payment-schedule-due-date-${index}`}
                    label="Eräpäivä"
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          </div>
        </div>

        <Fieldset heading="Laskurivit">
          <FieldArray<LandUseInvoiceItem> name={`${fieldName}.invoiceItems`}>
            {({ fields: itemFields }) => (
              <>
                {itemFields.length > 0 ? (
                  itemFields.map((itemFieldName, itemIndex) => (
                    <div
                      key={itemFieldName}
                      className="landuse-grid landuse-grid__bottom-margin"
                    >
                      <div className="landuse-grid__column-12">
                        <Field name={`${itemFieldName}.description`}>
                          {({ input: descriptionInput }) => (
                            <TextInput
                              id={`landuse-payment-schedule-invoice-row-description-${index}-${itemIndex}`}
                              label="Selite"
                              value={getFieldTextValue(
                                canEdit,
                                descriptionInput.value,
                              )}
                              onChange={descriptionInput.onChange}
                              readOnly={!canEdit}
                            />
                          )}
                        </Field>
                      </div>

                      <div className="landuse-grid__column-2">
                        <Field name={`${itemFieldName}.itemType`}>
                          {({ input: itemTypeInput }) =>
                            canEdit ? (
                              <Select
                                id={`landuse-payment-schedule-invoice-row-item-type-${index}-${itemIndex}`}
                                texts={{
                                  label: "Laskurivin tyyppi",
                                  placeholder: "Valitse",
                                }}
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
                                id={`landuse-payment-schedule-invoice-row-item-type-${index}-${itemIndex}`}
                                label="Laskurivin tyyppi"
                                value={readOnlyTextValue(itemTypeInput.value)}
                                readOnly
                              />
                            )
                          }
                        </Field>
                      </div>

                      <Field name={`${itemFieldName}.amountExcludingVat`}>
                        {({ input: amountInput }) => (
                          <>
                            <div className="landuse-grid__column-2">
                              <NumericDecimalInput
                                id={`landuse-payment-schedule-invoice-row-amount-${index}-${itemIndex}`}
                                label="Veroton summa (€)"
                                value={amountInput.value}
                                onChange={amountInput.onChange}
                                unit="€"
                                isEditMode={canEdit}
                              />
                            </div>
                            {canEdit && (
                              <div className="landuse-grid__column-2">
                                <Select
                                  id={`landuse-payment-schedule-invoice-row-korko-select-${index}-${itemIndex}`}
                                  options={korkoResults.map((r) => ({
                                    label: `${r.id}. ${formatLandUseEuroDisplayValue(r.korkoValue)}`,
                                    value: String(r.korkoValue),
                                  }))}
                                  onChange={(selected) => {
                                    if (selected.length > 0) {
                                      amountInput.onChange(
                                        Number(selected[0].value).toFixed(2),
                                      );
                                    }
                                  }}
                                  disabled={korkoResults.length === 0}
                                  texts={{
                                    label: "Täytä korkolaskimesta",
                                    placeholder:
                                      korkoResults.length > 0
                                        ? "Valitse"
                                        : "Ei tuloksia",
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </Field>

                      {canEdit && (
                        <div className="landuse-grid__column-2 landuse-compensations-table__detail-actions">
                          <Button
                            type="button"
                            size={ButtonSize.Small}
                            variant={ButtonVariant.Secondary}
                            onClick={() => itemFields.remove(itemIndex)}
                          >
                            Poista rivi
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Ei laskurivejä.</p>
                )}

                {canEdit && (
                  <div>
                    <Button
                      type="button"
                      variant={ButtonVariant.Supplementary}
                      size={ButtonSize.Small}
                      iconStart={<IconPlusCircleFill />}
                      onClick={() =>
                        itemFields.push(createEmptyInvoiceItemRow())
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
      </Fieldset>
    ),
  };
};

interface PartyGroupSectionProps {
  partyLabel: string;
  partyIndex: string;
  entries: InvoiceGroupEntry[];
  isEditMode: boolean;
  parties: PartyEntry[];
  partyOptions: SelectOption[];
  agreementOptions: AgreementOption[];
  asemakaavanNumero: string;
  korkoResults: KorkoResult[];
  onRemove: (index: number) => void;
  onAddInstallment: () => void;
}

const PartyGroupSection: React.FC<PartyGroupSectionProps> = ({
  partyLabel,
  partyIndex,
  entries,
  isEditMode,
  parties,
  partyOptions,
  agreementOptions,
  asemakaavanNumero,
  korkoResults,
  onRemove,
  onAddInstallment,
}) => {
  const firstEntry = entries[0];

  if (!firstEntry) {
    return (
      <div className="landuse-payment-schedule__party-group">
        <h2 className="landuse-payment-schedule__party-heading">
          {partyLabel}
        </h2>
        <p>Ei maksuaikatauluja.</p>
        {isEditMode && (
          <div className="landuse-invoicing__invoice-actions">
            <Button
              type="button"
              variant={ButtonVariant.Supplementary}
              iconStart={<IconPlusCircleFill />}
              onClick={onAddInstallment}
            >
              Lisää erä
            </Button>
          </div>
        )}
      </div>
    );
  }

  const firstInvoice = firstEntry.invoice;
  const firstFieldName = firstEntry.fieldName;
  const firstIndex = firstEntry.index;

  const canEditFirst =
    isEditMode && isInvoiceEditableBasedOnStatus(firstInvoice);
  const canEditContractFirst =
    isEditMode &&
    !firstEntry.isExistingInvoice &&
    isInvoiceEditableBasedOnStatus(firstInvoice);

  const contractNumberDisplayValue =
    agreementOptions.find(
      (option) => option.value === firstInvoice.contractIndex,
    )?.sopimusnumero ?? "-";

  const selectedPartyData = getSelectedPartyInvoiceData(
    firstInvoice.recipientPartyIndex,
    parties,
  );

  return (
    <div className="landuse-payment-schedule__party-group">
      <h2 className="landuse-payment-schedule__party-heading">{partyLabel}</h2>
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-street-address-${firstIndex}`}
            label="Katuosoite"
            value={readOnlyTextValue(selectedPartyData.streetAddress)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-city-${firstIndex}`}
            label="Postitoimipaikka"
            value={readOnlyTextValue(selectedPartyData.city)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-postal-code-${firstIndex}`}
            label="Postinumero"
            value={readOnlyTextValue(selectedPartyData.postalCode)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-ovt-code-${firstIndex}`}
            label="OVT-tunnus"
            value={readOnlyTextValue(selectedPartyData.ovtCode)}
            readOnly
          />
        </div>

        <div className="landuse-grid__column-3">
          <TextInput
            id={`landuse-payment-schedule-reference-${firstIndex}`}
            label="Asiakkaan viite"
            value={readOnlyTextValue(selectedPartyData.reference)}
            readOnly
          />
        </div>

        {selectedPartyData.isCompany && (
          <div className="landuse-grid__column-3">
            <TextInput
              id={`landuse-payment-schedule-business-id-${firstIndex}`}
              label="Y-tunnus"
              value={readOnlyTextValue(selectedPartyData.businessId)}
              readOnly
            />
          </div>
        )}
      </div>
      <h3>Sopimus: {contractNumberDisplayValue}</h3>
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-3 landuse-compensations-table__field--background-coat-of-arms-light">
          <Field name={`${firstFieldName}.status`}>
            {({ input: statusInput }) => {
              const statusAction = getScheduleStatusAction(statusInput.value);
              return (
                <>
                  <TextInput
                    id={`landuse-payment-schedule-status-${firstIndex}`}
                    label="Maksuaikataulun tila"
                    value={readOnlyTextValue(statusInput.value)}
                    readOnly
                  />
                  {isEditMode && statusAction && (
                    <div>
                      <Button
                        type="button"
                        variant={ButtonVariant.Primary}
                        size={ButtonSize.Small}
                        onClick={() =>
                          statusInput.onChange(statusAction.nextStatus)
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

        <div className="landuse-grid__column-3">
          <Field name={`${firstFieldName}.signedDate`}>
            {({ input }) =>
              canEditFirst ? (
                <DateInput
                  id={`landuse-payment-schedule-signed-date-${firstIndex}`}
                  label="Allekirjoituspäivämäärä"
                  value={input.value}
                  onChange={input.onChange}
                  placeholder="DD.MM.YYYY"
                  language="fi"
                />
              ) : (
                <TextInput
                  id={`landuse-payment-schedule-signed-date-${firstIndex}`}
                  label="Allekirjoituspäivämäärä"
                  value={readOnlyTextValue(input.value)}
                  readOnly
                />
              )
            }
          </Field>
        </div>
      </div>

      <StepByStep
        steps={entries.map(({ fieldName, index, invoice }) =>
          buildInstallmentStep({
            fieldName,
            index,
            isEditMode,
            invoice,
            korkoResults,
            onRemove,
          }),
        )}
      />
      {isEditMode && (
        <div className="landuse-invoicing__invoice-actions">
          <Button
            type="button"
            variant={ButtonVariant.Supplementary}
            iconStart={<IconPlusCircleFill />}
            onClick={onAddInstallment}
          >
            Lisää erä
          </Button>
        </div>
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
    if (!total || total <= 0) return;

    const selectedContract = contracts[Number(values.contractIndex)];
    const signedDate = selectedContract?.allekirjoituspvm ?? "";
    const sopimusnumero =
      agreementOptions.find((o) => o.value === values.contractIndex)
        ?.sopimusnumero ?? "";
    const recipientName =
      partyOptions.find((o) => o.value === values.recipientPartyIndex)?.label ??
      "";

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

          const handleAddInvoice = (push: (value: LandUseInvoice) => void) => {
            push(
              createEmptyInvoiceTableRow(
                partyOptions[0]?.value,
                agreementOptions[0]?.value,
              ),
            );
          };

          const handleRemoveInvoice = (
            remove: (index: number) => void,
            index: number,
          ) => {
            remove(index);
          };

          return (
            <div className="landuse-detail__content">
              <h1>Maksuaikataulu ja erät</h1>
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
                        Syötä maksuaikataulu
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
                  <FieldArray<LandUseInvoice> name="invoices">
                    {({ fields }) => {
                      const groupedByParty = new Map<
                        string,
                        InvoiceGroupEntry[]
                      >();
                      fields.forEach((fieldName, index) => {
                        const invoice = (fields.value?.[index] ??
                          {}) as LandUseInvoice;
                        const key =
                          invoice.recipientPartyIndex ?? "__ungrouped";
                        if (!groupedByParty.has(key)) {
                          groupedByParty.set(key, []);
                        }
                        groupedByParty.get(key)!.push({
                          fieldName,
                          index,
                          invoice,
                          isExistingInvoice: Boolean(existingInvoices[index]),
                        });
                      });

                      return (
                        <>
                          {partyOptions.map((partyOption) => (
                            <PartyGroupSection
                              key={partyOption.value}
                              partyLabel={partyOption.label}
                              partyIndex={partyOption.value}
                              entries={
                                groupedByParty.get(partyOption.value) ?? []
                              }
                              isEditMode={isEditMode}
                              parties={parties}
                              partyOptions={partyOptions}
                              agreementOptions={agreementOptions}
                              asemakaavanNumero={asemakaavanNumero}
                              korkoResults={korkoResults}
                              onRemove={(removeIndex) =>
                                handleRemoveInvoice(fields.remove, removeIndex)
                              }
                              onAddInstallment={() =>
                                fields.push(
                                  createEmptyInvoiceTableRow(
                                    partyOption.value,
                                    agreementOptions[0]?.value,
                                  ),
                                )
                              }
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
