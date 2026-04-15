import React from "react";
import {
  Accordion,
  Button,
  ButtonVariant,
  DateInput,
  Dialog,
  Fieldset,
  IconPlusCircleFill,
  IconTrash,
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
  landUseGuaranteeCategoryOptions,
  landUseGuaranteeTypeOptions,
  landUseSectionOptions,
} from "../../options";
import { normalizeSelectValue } from "../../fieldUtils";
import {
  formatLandUseNumericValue,
  parseLandUseNumericValue,
} from "../../utils/number";

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

interface GuaranteeSiteUsage {
  kohde: string;
  hallintamuoto: string;
  vakuuttaKaytettyEuro: string;
  vakuuttaKaytettyProsentti: string;
}

interface Guarantee {
  jarjestysnumero: string;
  tyyppi?: string;
  laji?: string;
  vakuusnumero: string;
  alkupvm: string;
  loppupvm: string;
  palautettuPvm: string;
  huomautus: string;
  panttikirjanNumero: string;
  vakuudenMaara: string;
  vakuuttaKaytetty: string;
  vakuuttaJaljella: string;
  siteUsages: GuaranteeSiteUsage[];
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
  jarjestysnumero: "",
  tyyppi: undefined,
  laji: undefined,
  vakuusnumero: "",
  alkupvm: "",
  loppupvm: "",
  palautettuPvm: "",
  huomautus: "",
  panttikirjanNumero: "",
  vakuudenMaara: "",
  vakuuttaKaytetty: "",
  vakuuttaJaljella: "",
  siteUsages: [],
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
  const [decisionIndexPendingDelete, setDecisionIndexPendingDelete] =
    React.useState<number | null>(null);
  const [agreementIndexPendingDelete, setAgreementIndexPendingDelete] =
    React.useState<number | null>(null);

  const closeDecisionDeleteDialog = () => {
    setDecisionIndexPendingDelete(null);
  };

  const confirmDecisionDelete = () => {
    if (decisionIndexPendingDelete === null) {
      return;
    }

    const currentDecisions = form.getState().values.decisions ?? [];
    form.change(
      "decisions",
      currentDecisions.filter(
        (_, decisionIndex) => decisionIndex !== decisionIndexPendingDelete,
      ),
    );
    closeDecisionDeleteDialog();
  };

  const closeAgreementDeleteDialog = () => {
    setAgreementIndexPendingDelete(null);
  };

  const confirmAgreementDelete = () => {
    if (agreementIndexPendingDelete === null) {
      return;
    }

    const currentAgreements = form.getState().values.agreements ?? [];
    form.change(
      "agreements",
      currentAgreements.filter(
        (_, agreementIndex) => agreementIndex !== agreementIndexPendingDelete,
      ),
    );
    closeAgreementDeleteDialog();
  };

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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                value={
                                  isEditMode ? input.value : input.value || "-"
                                }
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
                                value={
                                  isEditMode ? input.value : input.value || "-"
                                }
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                    value={
                                      isEditMode
                                        ? input.value
                                        : input.value || "-"
                                    }
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
                          <Button
                            type="button"
                            variant={ButtonVariant.Danger}
                            iconStart={<IconTrash />}
                            onClick={() => {
                              setDecisionIndexPendingDelete(decisionIndex);
                            }}
                          >
                            Poista päätös
                          </Button>
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
                                  value={input.value || "-"}
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
                                value={
                                  isEditMode ? input.value : input.value || "-"
                                }
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
                                  value={input.value || "-"}
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
                                value={
                                  isEditMode ? input.value : input.value || "-"
                                }
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                  value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                      value={input.value || "-"}
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
                                    value={
                                      isEditMode
                                        ? input.value
                                        : input.value || "-"
                                    }
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
                                    value={
                                      isEditMode
                                        ? input.value
                                        : input.value || "-"
                                    }
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
                                <Field name={`${vakuusName}.jarjestysnumero`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <TextInput
                                        id={`vakuus-jarjestysnumero-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden järjestysnumero"
                                        value={
                                          input.value ?? vakuus.jarjestysnumero
                                        }
                                        onChange={input.onChange}
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-jarjestysnumero-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden järjestysnumero"
                                        value={
                                          (input.value ??
                                            vakuus.jarjestysnumero) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.tyyppi`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <Select
                                        id={`vakuus-tyyppi-${agreementIndex}-${vakuusIndex}`}
                                        texts={{
                                          label: "Vakuuden tyyppi",
                                          placeholder: "Valitse",
                                        }}
                                        options={landUseGuaranteeTypeOptions}
                                        value={
                                          input.value
                                            ? [
                                                {
                                                  label: input.value,
                                                  value: input.value,
                                                },
                                              ]
                                            : vakuus.tyyppi
                                              ? [
                                                  {
                                                    label: vakuus.tyyppi ?? "",
                                                    value: vakuus.tyyppi ?? "",
                                                  },
                                                ]
                                              : []
                                        }
                                        onChange={(selected) =>
                                          handleSelectChange(
                                            selected,
                                            input.onChange,
                                          )
                                        }
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-tyyppi-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden tyyppi"
                                        value={
                                          (input.value ?? vakuus.tyyppi) || "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.laji`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <Select
                                        id={`vakuus-laji-${agreementIndex}-${vakuusIndex}`}
                                        texts={{
                                          label: "Vakuuden laji",
                                          placeholder: "Valitse",
                                        }}
                                        options={
                                          landUseGuaranteeCategoryOptions
                                        }
                                        value={
                                          input.value
                                            ? [
                                                {
                                                  label: input.value,
                                                  value: input.value,
                                                },
                                              ]
                                            : vakuus.laji
                                              ? [
                                                  {
                                                    label: vakuus.laji ?? "",
                                                    value: vakuus.laji ?? "",
                                                  },
                                                ]
                                              : []
                                        }
                                        onChange={(selected) =>
                                          handleSelectChange(
                                            selected,
                                            input.onChange,
                                          )
                                        }
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-laji-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden laji"
                                        value={
                                          (input.value ?? vakuus.laji) || "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuusnumero`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <TextInput
                                        id={`vakuus-vakuusnumero-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuusnumero"
                                        value={
                                          input.value ?? vakuus.vakuusnumero
                                        }
                                        onChange={input.onChange}
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-vakuusnumero-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuusnumero"
                                        value={
                                          (input.value ??
                                            vakuus.vakuusnumero) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.alkupvm`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <DateInput
                                        id={`vakuus-alkupvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden alkupvm"
                                        value={input.value ?? vakuus.alkupvm}
                                        onChange={input.onChange}
                                        placeholder="DD.MM.YYYY"
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-alkupvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden alkupvm"
                                        value={
                                          (input.value ?? vakuus.alkupvm) || "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.loppupvm`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <DateInput
                                        id={`vakuus-loppupvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden loppupvm"
                                        value={input.value ?? vakuus.loppupvm}
                                        onChange={input.onChange}
                                        placeholder="DD.MM.YYYY"
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-loppupvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden loppupvm"
                                        value={
                                          (input.value ?? vakuus.loppupvm) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.palautettuPvm`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <DateInput
                                        id={`vakuus-palautettu-pvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Palautettu pvm"
                                        value={
                                          input.value ?? vakuus.palautettuPvm
                                        }
                                        onChange={input.onChange}
                                        placeholder="DD.MM.YYYY"
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-palautettu-pvm-${agreementIndex}-${vakuusIndex}`}
                                        label="Palautettu pvm"
                                        value={
                                          (input.value ??
                                            vakuus.palautettuPvm) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.huomautus`}>
                                  {({ input }) =>
                                    isEditMode ? (
                                      <TextInput
                                        id={`vakuus-huomautus-${agreementIndex}-${vakuusIndex}`}
                                        label="Huomautus"
                                        value={input.value ?? vakuus.huomautus}
                                        onChange={input.onChange}
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-huomautus-${agreementIndex}-${vakuusIndex}`}
                                        label="Huomautus"
                                        value={
                                          (input.value ?? vakuus.huomautus) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field
                                  name={`${vakuusName}.panttikirjanNumero`}
                                >
                                  {({ input }) =>
                                    isEditMode ? (
                                      <TextInput
                                        id={`vakuus-panttikirjan-numero-${agreementIndex}-${vakuusIndex}`}
                                        label="Panttikirjan numero"
                                        value={
                                          input.value ??
                                          vakuus.panttikirjanNumero
                                        }
                                        onChange={input.onChange}
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-panttikirjan-numero-${agreementIndex}-${vakuusIndex}`}
                                        label="Panttikirjan numero"
                                        value={
                                          (input.value ??
                                            vakuus.panttikirjanNumero) ||
                                          "-"
                                        }
                                        readOnly
                                      />
                                    )
                                  }
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuudenMaara`}>
                                  {({ input }) => {
                                    const currentValue =
                                      input.value ?? vakuus.vakuudenMaara;

                                    return isEditMode ? (
                                      <TextInput
                                        id={`vakuus-vakuuden-maara-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden määrä"
                                        value={currentValue}
                                        onChange={input.onChange}
                                        onBlur={() => {
                                          const parsedValue =
                                            parseLandUseNumericValue(
                                              currentValue,
                                            );
                                          if (parsedValue !== null) {
                                            input.onChange(
                                              formatLandUseNumericValue(
                                                parsedValue,
                                              ),
                                            );
                                          }
                                          input.onBlur();
                                        }}
                                      />
                                    ) : (
                                      <TextInput
                                        id={`vakuus-vakuuden-maara-${agreementIndex}-${vakuusIndex}`}
                                        label="Vakuuden määrä"
                                        value={currentValue || "-"}
                                        readOnly
                                      />
                                    );
                                  }}
                                </Field>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="landuse-detail__decisions-add-row">
                        <Button
                          type="button"
                          variant={ButtonVariant.Supplementary}
                          iconStart={<IconPlusCircleFill />}
                          disabled={!isEditMode}
                          onClick={() => {
                            form.mutators.push(
                              `agreements.${agreementIndex}.vakuudet`,
                              createNewGuarantee(),
                            );
                          }}
                        >
                          Lisää vakuus
                        </Button>
                      </div>

                      <div className="landuse-detail__decisions-add-row">
                        <Button
                          type="button"
                          variant={ButtonVariant.Danger}
                          iconStart={<IconTrash />}
                          disabled={!isEditMode}
                          onClick={() => {
                            setAgreementIndexPendingDelete(agreementIndex);
                          }}
                        >
                          Poista sopimus
                        </Button>
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

              <Dialog
                id="landuse-decisions-delete-dialog"
                isOpen={decisionIndexPendingDelete !== null}
                aria-labelledby="landuse-decisions-delete-dialog-title"
                closeButtonLabelText="Sulje"
                close={closeDecisionDeleteDialog}
              >
                <Dialog.Header
                  id="landuse-decisions-delete-dialog-title"
                  title="Poista päätös"
                />
                <Dialog.Content>
                  Haluatko varmasti poistaa tämän päätöksen?
                </Dialog.Content>
                <Dialog.ActionButtons>
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    onClick={closeDecisionDeleteDialog}
                  >
                    Peruuta
                  </Button>
                  <Button
                    type="button"
                    variant={ButtonVariant.Danger}
                    onClick={confirmDecisionDelete}
                  >
                    Poista
                  </Button>
                </Dialog.ActionButtons>
              </Dialog>

              <Dialog
                id="landuse-agreements-delete-dialog"
                isOpen={agreementIndexPendingDelete !== null}
                aria-labelledby="landuse-agreements-delete-dialog-title"
                closeButtonLabelText="Sulje"
                close={closeAgreementDeleteDialog}
              >
                <Dialog.Header
                  id="landuse-agreements-delete-dialog-title"
                  title="Poista sopimus"
                />
                <Dialog.Content>
                  Haluatko varmasti poistaa tämän sopimuksen?
                </Dialog.Content>
                <Dialog.ActionButtons>
                  <Button
                    type="button"
                    variant={ButtonVariant.Secondary}
                    onClick={closeAgreementDeleteDialog}
                  >
                    Peruuta
                  </Button>
                  <Button
                    type="button"
                    variant={ButtonVariant.Danger}
                    onClick={confirmAgreementDelete}
                  >
                    Poista
                  </Button>
                </Dialog.ActionButtons>
              </Dialog>
            </div>
          </form>
        );
      }}
    />
  );
};
