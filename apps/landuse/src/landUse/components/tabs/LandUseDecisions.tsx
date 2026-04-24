import React from "react";
import {
  Accordion,
  Button,
  ButtonVariant,
  DateInput,
  Fieldset,
  IconPlusCircleFill,
  Select,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import {
  landUseAgreementTypeOptions,
  landUseConditionTypeOptions,
  landUseDecisionMakerOptions,
  landUseDecisionTypeOptions,
  landUseGuaranteeTypeOptions,
  landUseSectionOptions,
  type LandUseGuaranteeType,
} from "../../options";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { CollateralFormByType, type Guarantee } from "../collateralForms";

interface DecisionCondition {
  conditionType?: string;
  valvontapvm: string;
  valvottuPvm: string;
  note: string;
}

interface DecisionItem {
  title: string;
  paattaja?: string;
  paatospvm: string;
  pykala?: string;
  paatoksenTyyppi?: string;
  diaarinumero: string;
  huomautus: string;
  ehdot: DecisionCondition[];
}

interface AgreementChange {
  allekirjoituspvm: string;
  allekirjoitettavaMennessa: string;
  ensimmainenKutsuLahetetty: string;
  toinenKutsuLahetetty: string;
  kolmasKutsuLahetetty: string;
  paatos?: string;
  huomautus: string;
}

interface AgreementItem {
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
  muutokset: AgreementChange[];
  vakuuslaskuri: boolean;
  vakuudet: Guarantee[];
}

export interface LandUseDecisionsFormValues {
  decisions?: DecisionItem[];
  agreements?: AgreementItem[];
}

interface LandUseDecisionsProps {
  form: FormApi<LandUseDecisionsFormValues>;
  isEditMode: boolean;
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

const createNewDecisionCondition = (): DecisionCondition => ({
  conditionType: undefined,
  valvontapvm: "",
  valvottuPvm: "",
  note: "",
});

const createNewAgreementChange = (): AgreementChange => ({
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

const createNewDecision = (): DecisionItem => ({
  title: "",
  paattaja: undefined,
  paatospvm: "",
  pykala: undefined,
  paatoksenTyyppi: undefined,
  diaarinumero: "",
  huomautus: "",
  ehdot: [],
});

const createNewAgreement = (): AgreementItem => ({
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

const getDecisionAccordionHeading = (decision: DecisionItem): string => {
  const parts = [
    decision.paattaja,
    decision.paatospvm,
    decision.pykala,
    decision.paatoksenTyyppi,
  ]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.join(" ") || "Päätös";
};

const getAgreementAccordionHeading = (agreement: AgreementItem): string => {
  const parts = [agreement.sopimuksenTyyppi, agreement.sopimusnumero]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.join(" ") || "Sopimus";
};

export const LandUseDecisions: React.FC<LandUseDecisionsProps> = ({
  form,
  isEditMode,
}) => {
  const [newDecisionIndexToOpen, setNewDecisionIndexToOpen] = React.useState<
    number | null
  >(null);
  const [newAgreementIndexToOpen, setNewAgreementIndexToOpen] = React.useState<
    number | null
  >(null);
  const [pendingGuaranteeTypeByAgreement, setPendingGuaranteeTypeByAgreement] =
    React.useState<Record<number, LandUseGuaranteeType | undefined>>({});

  const setPendingGuaranteeType = (
    agreementIndex: number,
    value: LandUseGuaranteeType | undefined,
  ) =>
    setPendingGuaranteeTypeByAgreement((prev) => ({
      ...prev,
      [agreementIndex]: value,
    }));

  return (
    <Form<LandUseDecisionsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const decisions = values.decisions ?? [];
        const agreements = values.agreements ?? [];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">PÄÄTÖKSET</h2>

              {decisions.map((decision, decisionIndex) => {
                const decisionName = `decisions.${decisionIndex}`;
                const conditions = decision.ehdot ?? [];

                return (
                  <Accordion
                    key={`decision-${decisionIndex}`}
                    heading={getDecisionAccordionHeading(decision)}
                    initiallyOpen={decisionIndex === newDecisionIndexToOpen}
                  >
                    <Fieldset
                      heading=""
                      className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                    >
                      <div className="landuse-detail__grid landuse-detail__decisions-grid">
                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.paattaja`}>
                            {({ input }) =>
                              isEditMode ? (
                                <Select
                                  id={`decision-paattaja-${decisionIndex}`}
                                  texts={{
                                    label: "Päättäjä",
                                    placeholder: "Valitse",
                                  }}
                                  options={landUseDecisionMakerOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selected) =>
                                    handleSelectChange(selected, input.onChange)
                                  }
                                />
                              ) : (
                                <TextInput
                                  id={`decision-paattaja-${decisionIndex}`}
                                  label="Päättäjä"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.paatospvm`}>
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`decision-paatospvm-${decisionIndex}`}
                                  label="Päätöspvm"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`decision-paatospvm-${decisionIndex}`}
                                  label="Päätöspvm"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.pykala`}>
                            {({ input }) =>
                              isEditMode ? (
                                <Select
                                  id={`decision-pykala-${decisionIndex}`}
                                  texts={{
                                    label: "Pykälä",
                                    placeholder: "Valitse",
                                  }}
                                  options={landUseSectionOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selected) =>
                                    handleSelectChange(selected, input.onChange)
                                  }
                                />
                              ) : (
                                <TextInput
                                  id={`decision-pykala-${decisionIndex}`}
                                  label="Pykälä"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.paatoksenTyyppi`}>
                            {({ input }) =>
                              isEditMode ? (
                                <Select
                                  id={`decision-paatoksen-tyyppi-${decisionIndex}`}
                                  texts={{
                                    label: "Päätöksen tyyppi",
                                    placeholder: "Valitse",
                                  }}
                                  options={landUseDecisionTypeOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selected) =>
                                    handleSelectChange(selected, input.onChange)
                                  }
                                />
                              ) : (
                                <TextInput
                                  id={`decision-paatoksen-tyyppi-${decisionIndex}`}
                                  label="Päätöksen tyyppi"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column landuse-detail__decisions-link-column">
                          <Field name={`${decisionName}.diaarinumero`}>
                            {({ input }) => (
                              <TextInput
                                id={`decision-diaarinumero-${decisionIndex}`}
                                label="Diaarinumero"
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

                        <div className="landuse-detail__column landuse-detail__decisions-note-column">
                          <Field name={`${decisionName}.huomautus`}>
                            {({ input }) => (
                              <TextInput
                                id={`decision-huomautus-${decisionIndex}`}
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

                      <h3 className="landuse-detail__subsection-title">
                        Ehdot
                      </h3>

                      {conditions.map((_, conditionIndex) => {
                        const conditionName = `${decisionName}.ehdot.${conditionIndex}`;

                        return (
                          <div
                            className="landuse-detail__grid landuse-detail__decisions-grid"
                            key={`${conditionName}-${conditionIndex}`}
                          >
                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.conditionType`}>
                                {({ input }) =>
                                  isEditMode ? (
                                    <Select
                                      id={`decision-ehto-tyyppi-${decisionIndex}-${conditionIndex}`}
                                      texts={{
                                        label: "Ehtotyyppi",
                                        placeholder: "Valitse",
                                      }}
                                      options={landUseConditionTypeOptions}
                                      value={normalizeSelectValue(input.value)}
                                      onChange={(selected) =>
                                        handleSelectChange(
                                          selected,
                                          input.onChange,
                                        )
                                      }
                                    />
                                  ) : (
                                    <TextInput
                                      id={`decision-ehto-tyyppi-${decisionIndex}-${conditionIndex}`}
                                      label="Ehtotyyppi"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.valvontapvm`}>
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`decision-ehto-valvontapvm-${decisionIndex}-${conditionIndex}`}
                                      label="Valvontapvm"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`decision-ehto-valvontapvm-${decisionIndex}-${conditionIndex}`}
                                      label="Valvontapvm"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.valvottuPvm`}>
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`decision-ehto-valvottu-pvm-${decisionIndex}-${conditionIndex}`}
                                      label="Valvottu pvm"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`decision-ehto-valvottu-pvm-${decisionIndex}-${conditionIndex}`}
                                      label="Valvottu pvm"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.note`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`decision-ehto-huomautus-${decisionIndex}-${conditionIndex}`}
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
                      })}

                      {isEditMode && (
                        <div className="landuse-detail__decisions-add-row">
                          <Button
                            type="button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() => {
                              form.mutators.push(
                                `decisions.${decisionIndex}.ehdot`,
                                createNewDecisionCondition(),
                              );
                            }}
                          >
                            Lisää ehto
                          </Button>
                        </div>
                      )}

                      {isEditMode && (
                        <div className="landuse-detail__decisions-add-row">
                          <ConfirmDeleteButton
                            id={`decision-delete-${decisionIndex}`}
                            buttonLabel="Poista päätös"
                            onConfirm={() => {
                              const currentDecisions =
                                form.getState().values.decisions ?? [];
                              form.change(
                                "decisions",
                                currentDecisions.filter(
                                  (_, currentDecisionIndex) =>
                                    currentDecisionIndex !== decisionIndex,
                                ),
                              );
                            }}
                            dialogTitle="Poista päätös"
                            dialogContent={`Haluatko varmasti poistaa päätöksen ${getDecisionAccordionHeading(decision)}?`}
                          />
                        </div>
                      )}
                    </Fieldset>
                  </Accordion>
                );
              })}

              {isEditMode && (
                <div className="landuse-detail__decisions-add-row">
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => {
                      const newDecisionIndex = decisions.length;
                      form.mutators.push("decisions", createNewDecision());
                      setNewDecisionIndexToOpen(newDecisionIndex);
                    }}
                  >
                    Lisää päätös
                  </Button>
                </div>
              )}

              <h2 className="landuse-detail__section-title landuse-detail__decisions-section-break">
                SOPIMUKSET
              </h2>

              {agreements.map((agreement, agreementIndex) => {
                const agreementName = `agreements.${agreementIndex}`;

                return (
                  <Accordion
                    key={`agreement-${agreementIndex}`}
                    heading={getAgreementAccordionHeading(agreement)}
                    initiallyOpen={agreementIndex === newAgreementIndexToOpen}
                  >
                    <Fieldset
                      heading=""
                      className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
                    >
                      <div className="landuse-detail__grid landuse-detail__decisions-grid">
                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.sopimuksenTyyppi`}>
                            {({ input }) =>
                              isEditMode ? (
                                <Select
                                  id={`agreement-tyyppi-${agreementIndex}`}
                                  texts={{
                                    label: "Sopimuksen tyyppi",
                                    placeholder: "Valitse",
                                  }}
                                  options={landUseAgreementTypeOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selected) =>
                                    handleSelectChange(selected, input.onChange)
                                  }
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-tyyppi-${agreementIndex}`}
                                  label="Sopimuksen tyyppi"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.sopimusnumero`}>
                            {({ input }) => (
                              <TextInput
                                id={`agreement-sopimusnumero-${agreementIndex}`}
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

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.allekirjoituspvm`}>
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`agreement-allekirjoituspvm-${agreementIndex}`}
                                  label="Allekirjoituspvm"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-allekirjoituspvm-${agreementIndex}`}
                                  label="Allekirjoituspvm"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.huomautus`}>
                            {({ input }) => (
                              <TextInput
                                id={`agreement-huomautus-${agreementIndex}`}
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

                        <div className="landuse-detail__column">
                          <Field
                            name={`${agreementName}.allekirjoitettavaMennessa`}
                          >
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`agreement-allekirjoitettava-mennessa-${agreementIndex}`}
                                  label="Allekirjoitettava mennessä"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-allekirjoitettava-mennessa-${agreementIndex}`}
                                  label="Allekirjoitettava mennessä"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field
                            name={`${agreementName}.ensimmainenKutsuLahetetty`}
                          >
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`agreement-1-kutsu-${agreementIndex}`}
                                  label="1. kutsu lähetetty"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-1-kutsu-${agreementIndex}`}
                                  label="1. kutsu lähetetty"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.toinenKutsuLahetetty`}>
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`agreement-2-kutsu-${agreementIndex}`}
                                  label="2. kutsu lähetetty"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-2-kutsu-${agreementIndex}`}
                                  label="2. kutsu lähetetty"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.kolmasKutsuLahetetty`}>
                            {({ input }) =>
                              isEditMode ? (
                                <DateInput
                                  id={`agreement-3-kutsu-${agreementIndex}`}
                                  label="3. kutsu lähetetty"
                                  value={input.value}
                                  onChange={input.onChange}
                                  placeholder="DD.MM.YYYY"
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-3-kutsu-${agreementIndex}`}
                                  label="3. kutsu lähetetty"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>

                        <div className="landuse-detail__column landuse-detail__decisions-paatos-column">
                          <Field name={`${agreementName}.paatos`}>
                            {({ input }) =>
                              isEditMode ? (
                                <Select
                                  id={`agreement-paatos-${agreementIndex}`}
                                  texts={{
                                    label: "Päätös",
                                    placeholder: "Valitse",
                                  }}
                                  options={landUseDecisionTypeOptions}
                                  value={normalizeSelectValue(input.value)}
                                  onChange={(selected) =>
                                    handleSelectChange(selected, input.onChange)
                                  }
                                />
                              ) : (
                                <TextInput
                                  id={`agreement-paatos-${agreementIndex}`}
                                  label="Päätös"
                                  value={readOnlyTextValue(input.value)}
                                  readOnly
                                />
                              )
                            }
                          </Field>
                        </div>
                      </div>

                      <h3 className="landuse-detail__subsection-title">
                        Sopimuksen muutokset
                      </h3>

                      {(agreement.muutokset ?? []).map((_, changeIndex) => {
                        const changeName = `${agreementName}.muutokset.${changeIndex}`;

                        return (
                          <div
                            className="landuse-detail__grid landuse-detail__decisions-grid"
                            key={`${changeName}-${changeIndex}`}
                          >
                            <div className="landuse-detail__column">
                              <Field name={`${changeName}.allekirjoituspvm`}>
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`agreement-muutos-allekirjoituspvm-${agreementIndex}-${changeIndex}`}
                                      label="Allekirjoituspvm"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`agreement-muutos-allekirjoituspvm-${agreementIndex}-${changeIndex}`}
                                      label="Allekirjoituspvm"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.allekirjoitettavaMennessa`}
                              >
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`agreement-muutos-allekirjoitettava-mennessa-${agreementIndex}-${changeIndex}`}
                                      label="Allekirjoitettava mennessä"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`agreement-muutos-allekirjoitettava-mennessa-${agreementIndex}-${changeIndex}`}
                                      label="Allekirjoitettava mennessä"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.ensimmainenKutsuLahetetty`}
                              >
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`agreement-muutos-1-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="1. kutsu lähetetty"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`agreement-muutos-1-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="1. kutsu lähetetty"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.toinenKutsuLahetetty`}
                              >
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`agreement-muutos-2-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="2. kutsu lähetetty"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`agreement-muutos-2-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="2. kutsu lähetetty"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.kolmasKutsuLahetetty`}
                              >
                                {({ input }) =>
                                  isEditMode ? (
                                    <DateInput
                                      id={`agreement-muutos-3-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="3. kutsu lähetetty"
                                      value={input.value}
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                    />
                                  ) : (
                                    <TextInput
                                      id={`agreement-muutos-3-kutsu-${agreementIndex}-${changeIndex}`}
                                      label="3. kutsu lähetetty"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )
                                }
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${changeName}.paatos`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`agreement-muutos-paatos-${agreementIndex}-${changeIndex}`}
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

                            <div className="landuse-detail__column">
                              <Field name={`${changeName}.huomautus`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`agreement-muutos-huomautus-${agreementIndex}-${changeIndex}`}
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
                      })}

                      {isEditMode && (
                        <div className="landuse-detail__decisions-add-row">
                          <Button
                            type="button"
                            variant={ButtonVariant.Supplementary}
                            iconStart={<IconPlusCircleFill />}
                            onClick={() => {
                              form.mutators.push(
                                `agreements.${agreementIndex}.muutokset`,
                                createNewAgreementChange(),
                              );
                            }}
                          >
                            Lisää sopimuksen muutos
                          </Button>
                        </div>
                      )}

                      <h3 className="landuse-detail__subsection-title">
                        Vakuudet
                      </h3>

                      {(agreement.vakuudet ?? []).map((vakuus, vakuusIndex) => {
                        const vakuusName = `${agreementName}.vakuudet.${vakuusIndex}`;
                        return (
                          <div
                            className="landuse-detail__decisions-vakuus-block"
                            key={`${vakuusName}-${vakuusIndex}`}
                          >
                            <div className="landuse-detail__grid landuse-detail__decisions-grid">
                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.tyyppi`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-tyyppi-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuuden tyyppi"
                                      value={readOnlyTextValue(input.value)}
                                      readOnly
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>

                            <CollateralFormByType
                              type={
                                vakuus.tyyppi as
                                  | LandUseGuaranteeType
                                  | undefined
                              }
                              namePrefix={vakuusName}
                              isEditMode={isEditMode}
                            />

                            {isEditMode && (
                              <div className="landuse-detail__decisions-add-row">
                                <ConfirmDeleteButton
                                  id={`vakuus-delete-${agreementIndex}-${vakuusIndex}`}
                                  buttonLabel="Poista vakuus"
                                  onConfirm={() => {
                                    form.mutators.remove(
                                      `agreements.${agreementIndex}.vakuudet`,
                                      vakuusIndex,
                                    );
                                  }}
                                  dialogTitle="Poista vakuus"
                                  dialogContent="Haluatko varmasti poistaa vakuuden?"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {isEditMode && (
                        <Fieldset
                          heading="Lisää uusi vakuus"
                          className="landuse-detail__fieldset--with-margin"
                        >
                          <div className="landuse-detail__decisions-add-vakuus-row">
                            <div className="landuse-detail__decisions-add-vakuus-select">
                              <Select
                                id={`vakuus-new-tyyppi-${agreementIndex}`}
                                texts={{
                                  label: "Vakuuden tyyppi",
                                  placeholder: "Valitse",
                                }}
                                options={landUseGuaranteeTypeOptions}
                                value={
                                  pendingGuaranteeTypeByAgreement[
                                    agreementIndex
                                  ]
                                }
                                onChange={(selected) => {
                                  if (selected.length > 0) {
                                    setPendingGuaranteeType(
                                      agreementIndex,
                                      selected[0].value as LandUseGuaranteeType,
                                    );
                                  } else {
                                    setPendingGuaranteeType(
                                      agreementIndex,
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
                                !pendingGuaranteeTypeByAgreement[agreementIndex]
                              }
                              onClick={() => {
                                const pendingType =
                                  pendingGuaranteeTypeByAgreement[
                                    agreementIndex
                                  ];
                                if (!pendingType) return;
                                form.mutators.push(
                                  `agreements.${agreementIndex}.vakuudet`,
                                  {
                                    ...createNewGuarantee(),
                                    tyyppi: pendingType,
                                  },
                                );
                                setPendingGuaranteeType(
                                  agreementIndex,
                                  undefined,
                                );
                              }}
                            >
                              Lisää vakuus
                            </Button>
                          </div>
                        </Fieldset>
                      )}

                      <div className="landuse-detail__decisions-add-row">
                        <ConfirmDeleteButton
                          id={`agreement-delete-${agreementIndex}`}
                          buttonLabel="Poista sopimus"
                          disabled={!isEditMode}
                          onConfirm={() => {
                            const currentAgreements =
                              form.getState().values.agreements ?? [];
                            form.change(
                              "agreements",
                              currentAgreements.filter(
                                (_, currentAgreementIndex) =>
                                  currentAgreementIndex !== agreementIndex,
                              ),
                            );
                          }}
                          dialogTitle="Poista sopimus"
                          dialogContent={`Haluatko varmasti poistaa sopimuksen ${getAgreementAccordionHeading(agreement)}?`}
                        />
                      </div>
                    </Fieldset>
                  </Accordion>
                );
              })}

              {isEditMode && (
                <div className="landuse-detail__decisions-add-row">
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => {
                      const newAgreementIndex = agreements.length;
                      form.mutators.push("agreements", createNewAgreement());
                      setNewAgreementIndexToOpen(newAgreementIndex);
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
