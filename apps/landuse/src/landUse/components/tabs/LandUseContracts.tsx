import React from "react";
import {
  Button,
  ButtonVariant,
  DateInput,
  Fieldset,
  IconPlusCircleFill,
  Select,
  StepByStep,
  TextArea,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import {
  landUseAgreementTypeOptions,
  landUseDecisionTypeOptions,
  landUseGuaranteeTypeOptions,
  type LandUseGuaranteeType,
} from "../../options";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { CollateralFormByType, type Guarantee } from "../collateralForms";
import type { PartyEntry } from "./LandUseParties";

interface ContractChange {
  allekirjoituspvm: string;
  allekirjoitettavaMennessa: string;
  ensimmainenKutsuLahetetty: string;
  toinenKutsuLahetetty: string;
  kolmasKutsuLahetetty: string;
  paatos?: string;
  huomautus: string;
}

interface ContractItem {
  title: string;
  sopimuksenTyyppi?: string;
  sopimusnumero: string;
  allekirjoituspvm: string;
  huomautus: string;
  allekirjoitettavaMennessa: string;
  ensimmainenKutsuLahetetty: string;
  toinenKutsuLahetetty: string;
  kolmasKutsuLahetetty: string;
  paatos?: string;
  muutokset: ContractChange[];
  vakuuslaskuri: boolean;
  vakuudet: Guarantee[];
}

export interface LandUseContractsFormValues {
  contracts?: ContractItem[];
}

interface LandUseContractsProps {
  form: FormApi<LandUseContractsFormValues>;
  isEditMode: boolean;
  parties: PartyEntry[];
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

const createNewContractChange = (): ContractChange => ({
  allekirjoituspvm: "",
  allekirjoitettavaMennessa: "",
  ensimmainenKutsuLahetetty: "",
  toinenKutsuLahetetty: "",
  kolmasKutsuLahetetty: "",
  paatos: "",
  huomautus: "",
});

const createNewGuarantee = (): Guarantee => ({
  tyyppi: undefined,
});

const createNewContract = (): ContractItem => ({
  title: "",
  sopimuksenTyyppi: undefined,
  sopimusnumero: "",
  allekirjoituspvm: "",
  huomautus: "",
  allekirjoitettavaMennessa: "",
  ensimmainenKutsuLahetetty: "",
  toinenKutsuLahetetty: "",
  kolmasKutsuLahetetty: "",
  paatos: undefined,
  muutokset: [],
  vakuuslaskuri: false,
  vakuudet: [],
});

const getContractHeadingText = (contract: ContractItem): string => {
  const parts = [contract.sopimuksenTyyppi, contract.sopimusnumero]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.join(" ") || "Sopimus";
};

export const LandUseContracts: React.FC<LandUseContractsProps> = ({
  form,
  isEditMode,
  parties,
}) => {
  const partyOptions = parties.map((entry) => ({
    label: entry.party.details.name,
    value: entry.party.details.name,
  }));
  const [pendingGuaranteeTypeByContract, setPendingGuaranteeTypeByContract] =
    React.useState<Record<number, LandUseGuaranteeType | undefined>>({});

  const setPendingGuaranteeType = (
    contractIndex: number,
    value: LandUseGuaranteeType | undefined,
  ) =>
    setPendingGuaranteeTypeByContract((prev) => ({
      ...prev,
      [contractIndex]: value,
    }));

  return (
    <Form<LandUseContractsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const contracts = values.contracts ?? [];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Sopimukset ja vakuudet</h1>

              {contracts.map((contract, contractIndex) => {
                const contractName = `contracts.${contractIndex}`;
                return (
                  <div
                    className="landuse-detail__party-entry"
                    key={`contract-${contractIndex}`}
                  >
                    <div className="landuse-detail__heading-with-delete">
                      <h3>{getContractHeadingText(contract)}</h3>
                      {isEditMode && (
                        <ConfirmDeleteButton
                          id={`contract-delete-${contractIndex}`}
                          buttonLabel="Poista sopimus"
                          disabled={!isEditMode}
                          onConfirm={() => {
                            const currentContracts =
                              form.getState().values.contracts ?? [];
                            form.change(
                              "contracts",
                              currentContracts.filter(
                                (_, currentContractIndex) =>
                                  currentContractIndex !== contractIndex,
                              ),
                            );
                          }}
                          dialogTitle="Poista sopimus"
                          dialogContent={`Haluatko varmasti poistaa sopimuksen ${getContractHeadingText(contract)}?`}
                        />
                      )}
                    </div>

                    <StepByStep
                      numberedList
                      steps={[
                        {
                          title: "Sopimuksen tiedot",
                          key: "contract-details",
                          description: (
                            <Fieldset heading="" className="full-width">
                              <div className="landuse-grid landuse-grid__bottom-margin">
                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.sopimuksenTyyppi`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <Select
                                          id={`contract-tyyppi-${contractIndex}`}
                                          texts={{
                                            label: "Sopimuksen tyyppi",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseAgreementTypeOptions}
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
                                          id={`contract-tyyppi-${contractIndex}`}
                                          label="Sopimuksen tyyppi"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${contractName}.sopimusnumero`}>
                                    {({ input }) => (
                                      <TextInput
                                        id={`contract-sopimusnumero-${contractIndex}`}
                                        label="Sopimusnumero"
                                        value={getFieldTextValue(
                                          isEditMode,
                                          input.value,
                                        )}
                                        onChange={input.onChange}
                                        readOnly={!isEditMode}
                                      />
                                    )}
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.allekirjoituspvm`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`contract-allekirjoituspvm-${contractIndex}`}
                                          label="Allekirjoituspvm"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`contract-allekirjoituspvm-${contractIndex}`}
                                          label="Allekirjoituspvm"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.allekirjoitettavaMennessa`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`contract-allekirjoitettava-mennessa-${contractIndex}`}
                                          label="Allekirjoitettava mennessä"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`contract-allekirjoitettava-mennessa-${contractIndex}`}
                                          label="Allekirjoitettava mennessä"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.ensimmainenKutsuLahetetty`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`contract-1-kutsu-${contractIndex}`}
                                          label="1. kutsu lähetetty"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`contract-1-kutsu-${contractIndex}`}
                                          label="1. kutsu lähetetty"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.toinenKutsuLahetetty`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`contract-2-kutsu-${contractIndex}`}
                                          label="2. kutsu lähetetty"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`contract-2-kutsu-${contractIndex}`}
                                          label="2. kutsu lähetetty"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${contractName}.kolmasKutsuLahetetty`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`contract-3-kutsu-${contractIndex}`}
                                          label="3. kutsu lähetetty"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`contract-3-kutsu-${contractIndex}`}
                                          label="3. kutsu lähetetty"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${contractName}.paatos`}>
                                    {({ input }) =>
                                      isEditMode ? (
                                        <Select
                                          id={`contract-paatos-${contractIndex}`}
                                          texts={{
                                            label: "Päätös",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseDecisionTypeOptions}
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
                                          id={`contract-paatos-${contractIndex}`}
                                          label="Päätös"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${contractName}.huomautus`}>
                                    {({ input }) => (
                                      <TextArea
                                        id={`contract-huomautus-${contractIndex}`}
                                        label="Huomautus"
                                        value={getFieldTextValue(
                                          isEditMode,
                                          input.value,
                                        )}
                                        onChange={input.onChange}
                                        readOnly={!isEditMode}
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>
                            </Fieldset>
                          ),
                        },
                        {
                          title: "Sopimuksen muutokset",
                          key: "contract-changes",
                          description: (
                            <Fieldset heading="" className="full-width">
                              {(contract.muutokset ?? []).map(
                                (_, changeIndex) => {
                                  const changeName = `${contractName}.muutokset.${changeIndex}`;
                                  return (
                                    <div
                                      className="landuse-grid landuse-grid__bottom-separator"
                                      key={`${changeName}-${changeIndex}`}
                                    >
                                      <div className="landuse-grid__column-6">
                                        <Field
                                          name={`${changeName}.allekirjoituspvm`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <DateInput
                                                id={`contract-muutos-allekirjoituspvm-${contractIndex}-${changeIndex}`}
                                                label="Allekirjoituspvm"
                                                value={input.value}
                                                onChange={input.onChange}
                                                placeholder="DD.MM.YYYY"
                                                language="fi"
                                              />
                                            ) : (
                                              <TextInput
                                                id={`contract-muutos-allekirjoituspvm-${contractIndex}-${changeIndex}`}
                                                label="Allekirjoituspvm"
                                                value={readOnlyTextValue(
                                                  input.value,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field
                                          name={`${changeName}.allekirjoitettavaMennessa`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <DateInput
                                                id={`contract-muutos-allekirjoitettava-mennessa-${contractIndex}-${changeIndex}`}
                                                label="Allekirjoitettava mennessä"
                                                value={input.value}
                                                onChange={input.onChange}
                                                placeholder="DD.MM.YYYY"
                                                language="fi"
                                              />
                                            ) : (
                                              <TextInput
                                                id={`contract-muutos-allekirjoitettava-mennessa-${contractIndex}-${changeIndex}`}
                                                label="Allekirjoitettava mennessä"
                                                value={readOnlyTextValue(
                                                  input.value,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field
                                          name={`${changeName}.ensimmainenKutsuLahetetty`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <DateInput
                                                id={`contract-muutos-1-kutsu-${contractIndex}-${changeIndex}`}
                                                label="1. kutsu lähetetty"
                                                value={input.value}
                                                onChange={input.onChange}
                                                placeholder="DD.MM.YYYY"
                                                language="fi"
                                              />
                                            ) : (
                                              <TextInput
                                                id={`contract-muutos-1-kutsu-${contractIndex}-${changeIndex}`}
                                                label="1. kutsu lähetetty"
                                                value={readOnlyTextValue(
                                                  input.value,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field
                                          name={`${changeName}.toinenKutsuLahetetty`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <DateInput
                                                id={`contract-muutos-2-kutsu-${contractIndex}-${changeIndex}`}
                                                label="2. kutsu lähetetty"
                                                value={input.value}
                                                onChange={input.onChange}
                                                placeholder="DD.MM.YYYY"
                                                language="fi"
                                              />
                                            ) : (
                                              <TextInput
                                                id={`contract-muutos-2-kutsu-${contractIndex}-${changeIndex}`}
                                                label="2. kutsu lähetetty"
                                                value={readOnlyTextValue(
                                                  input.value,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field
                                          name={`${changeName}.kolmasKutsuLahetetty`}
                                        >
                                          {({ input }) =>
                                            isEditMode ? (
                                              <DateInput
                                                id={`contract-muutos-3-kutsu-${contractIndex}-${changeIndex}`}
                                                label="3. kutsu lähetetty"
                                                value={input.value}
                                                onChange={input.onChange}
                                                placeholder="DD.MM.YYYY"
                                                language="fi"
                                              />
                                            ) : (
                                              <TextInput
                                                id={`contract-muutos-3-kutsu-${contractIndex}-${changeIndex}`}
                                                label="3. kutsu lähetetty"
                                                value={readOnlyTextValue(
                                                  input.value,
                                                )}
                                                readOnly
                                              />
                                            )
                                          }
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field name={`${changeName}.paatos`}>
                                          {({ input }) => (
                                            <TextInput
                                              id={`contract-muutos-paatos-${contractIndex}-${changeIndex}`}
                                              label="Päätös"
                                              value={getFieldTextValue(
                                                isEditMode,
                                                input.value,
                                              )}
                                              onChange={input.onChange}
                                              readOnly={!isEditMode}
                                            />
                                          )}
                                        </Field>
                                      </div>

                                      <div className="landuse-grid__column-6">
                                        <Field name={`${changeName}.huomautus`}>
                                          {({ input }) => (
                                            <TextArea
                                              id={`contract-muutos-huomautus-${contractIndex}-${changeIndex}`}
                                              label="Huomautus"
                                              value={getFieldTextValue(
                                                isEditMode,
                                                input.value,
                                              )}
                                              onChange={input.onChange}
                                              readOnly={!isEditMode}
                                            />
                                          )}
                                        </Field>
                                      </div>
                                    </div>
                                  );
                                },
                              )}

                              {isEditMode && (
                                <div className="landuse-detail__decisions-add-row">
                                  <Button
                                    type="button"
                                    variant={ButtonVariant.Supplementary}
                                    iconStart={<IconPlusCircleFill />}
                                    onClick={() => {
                                      form.mutators.push(
                                        `contracts.${contractIndex}.muutokset`,
                                        createNewContractChange(),
                                      );
                                    }}
                                  >
                                    Lisää sopimuksen muutos
                                  </Button>
                                </div>
                              )}
                            </Fieldset>
                          ),
                        },
                        {
                          title: "Vakuudet",
                          key: "contract-guarantees",
                          description: (
                            <Fieldset heading="" className="full-width">
                              {(contract.vakuudet ?? []).length > 0 && (
                                <StepByStep
                                  numberedList
                                  steps={(contract.vakuudet ?? []).map(
                                    (vakuus, vakuusIndex) => {
                                      const vakuusName = `${contractName}.vakuudet.${vakuusIndex}`;
                                      const savedVakuus = (form.getState()
                                        .initialValues?.contracts?.[
                                        contractIndex
                                      ]?.vakuudet ?? [])[vakuusIndex];
                                      const isVakuusLocked = Boolean(
                                        savedVakuus?.palautettuPvm,
                                      );
                                      return {
                                        title: `Vakuus: ${vakuus.tyyppi ?? ""}${
                                          isVakuusLocked
                                            ? ` (palautettu ${savedVakuus?.palautettuPvm})`
                                            : ""
                                        }`,
                                        key: `vakuus-${vakuusIndex}`,
                                        description: (
                                          <div className="landuse-detail__decisions-vakuus-block">
                                            {/* NOTE! Hidden field for vakuuden tyyppi for form data. */}
                                            <Field
                                              name={`${vakuusName}.tyyppi`}
                                            >
                                              {({ input }) => (
                                                <TextInput
                                                  id={`vakuus-tyyppi-${contractIndex}-${vakuusIndex}`}
                                                  label=""
                                                  value={readOnlyTextValue(
                                                    input.value,
                                                  )}
                                                  readOnly
                                                  hidden
                                                />
                                              )}
                                            </Field>

                                            <CollateralFormByType
                                              type={
                                                vakuus.tyyppi as
                                                  | LandUseGuaranteeType
                                                  | undefined
                                              }
                                              namePrefix={vakuusName}
                                              isEditMode={
                                                isEditMode && !isVakuusLocked
                                              }
                                              partyOptions={partyOptions}
                                            />

                                            {isEditMode && !isVakuusLocked && (
                                              <div className="landuse-detail__delete-button-row">
                                                <ConfirmDeleteButton
                                                  id={`vakuus-delete-${contractIndex}-${vakuusIndex}`}
                                                  buttonLabel="Poista vakuus"
                                                  onConfirm={() => {
                                                    form.mutators.remove(
                                                      `contracts.${contractIndex}.vakuudet`,
                                                      vakuusIndex,
                                                    );
                                                  }}
                                                  dialogTitle="Poista vakuus"
                                                  dialogContent="Haluatko varmasti poistaa vakuuden?"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        ),
                                      };
                                    },
                                  )}
                                />
                              )}

                              {isEditMode && (
                                <>
                                  <h3>Lisää vakuus</h3>
                                  <Fieldset
                                    heading=""
                                    className="landuse-detail__fieldset--with-margin"
                                  >
                                    <div className="landuse-detail__decisions-add-vakuus-row">
                                      <div className="landuse-detail__decisions-add-vakuus-select">
                                        <Select
                                          id={`vakuus-new-tyyppi-${contractIndex}`}
                                          texts={{
                                            label: "Vakuuden tyyppi",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseGuaranteeTypeOptions}
                                          value={normalizeSelectValue(
                                            pendingGuaranteeTypeByContract[
                                              contractIndex
                                            ],
                                          )}
                                          onChange={(selected) => {
                                            if (selected.length > 0) {
                                              setPendingGuaranteeType(
                                                contractIndex,
                                                selected[0]
                                                  .value as LandUseGuaranteeType,
                                              );
                                            } else {
                                              setPendingGuaranteeType(
                                                contractIndex,
                                                undefined,
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant={ButtonVariant.Supplementary}
                                        iconStart={<IconPlusCircleFill />}
                                        disabled={
                                          !pendingGuaranteeTypeByContract[
                                            contractIndex
                                          ]
                                        }
                                        onClick={() => {
                                          const pendingType =
                                            pendingGuaranteeTypeByContract[
                                              contractIndex
                                            ];
                                          if (!pendingType) return;
                                          form.mutators.push(
                                            `contracts.${contractIndex}.vakuudet`,
                                            {
                                              ...createNewGuarantee(),
                                              tyyppi: pendingType,
                                            },
                                          );
                                          setPendingGuaranteeType(
                                            contractIndex,
                                            undefined,
                                          );
                                        }}
                                      >
                                        Lisää vakuus
                                      </Button>
                                    </div>
                                  </Fieldset>
                                </>
                              )}
                            </Fieldset>
                          ),
                        },
                      ]}
                    />
                  </div>
                );
              })}

              {isEditMode && (
                <div className="landuse-detail__decisions-add-row">
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => {
                      form.mutators.push("contracts", createNewContract());
                    }}
                  >
                    Lisää sopimus
                  </Button>
                </div>
              )}
            </div>
          </form>
        );
      }}
    />
  );
};
