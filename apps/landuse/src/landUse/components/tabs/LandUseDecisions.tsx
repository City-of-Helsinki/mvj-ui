import React from "react";
import {
  Accordion,
  Button,
  ButtonVariant,
  Checkbox,
  DateInput,
  Dialog,
  Fieldset,
  IconPlusCircleFill,
  IconTrash,
  Select,
  Table,
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
import {
  formatLandUseEuroValue,
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

const vakuudetTableCols = [
  { key: "kohde", headerName: "Kohteet joihin vakuutta käytetty" },
  { key: "hallintamuoto", headerName: "Hallintamuoto" },
  { key: "vakuuttaKaytettyEuro", headerName: "Vakuutta käytetty €" },
  {
    key: "vakuuttaKaytettyProsentti",
    headerName: "Vakuutta käytetty %",
  },
];

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
                            {({ input }) => (
                              <Select
                                id={`decision-paattaja-${decisionIndex}`}
                                texts={{
                                  label: "Päättäjä",
                                  placeholder: "Valitse",
                                }}
                                options={landUseDecisionMakerOptions}
                                value={
                                  input.value
                                    ? [
                                        {
                                          label: input.value,
                                          value: input.value,
                                        },
                                      ]
                                    : decision.paattaja
                                      ? [
                                          {
                                            label: decision.paattaja,
                                            value: decision.paattaja,
                                          },
                                        ]
                                      : []
                                }
                                onChange={(selected) =>
                                  handleSelectChange(selected, input.onChange)
                                }
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.paatospvm`}>
                            {({ input }) => (
                              <DateInput
                                id={`decision-paatospvm-${decisionIndex}`}
                                label="Päätöspvm"
                                value={input.value ?? decision.paatospvm}
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.pykala`}>
                            {({ input }) => (
                              <Select
                                id={`decision-pykala-${decisionIndex}`}
                                texts={{
                                  label: "Pykälä",
                                  placeholder: "Valitse",
                                }}
                                options={landUseSectionOptions}
                                value={
                                  input.value
                                    ? [
                                        {
                                          label: input.value,
                                          value: input.value,
                                        },
                                      ]
                                    : decision.pykala
                                      ? [
                                          {
                                            label: decision.pykala,
                                            value: decision.pykala,
                                          },
                                        ]
                                      : []
                                }
                                onChange={(selected) =>
                                  handleSelectChange(selected, input.onChange)
                                }
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${decisionName}.paatoksenTyyppi`}>
                            {({ input }) => (
                              <Select
                                id={`decision-paatoksen-tyyppi-${decisionIndex}`}
                                texts={{
                                  label: "Päätöksen tyyppi",
                                  placeholder: "Valitse",
                                }}
                                options={landUseDecisionTypeOptions}
                                value={
                                  input.value
                                    ? [
                                        {
                                          label: input.value,
                                          value: input.value,
                                        },
                                      ]
                                    : decision.paatoksenTyyppi
                                      ? [
                                          {
                                            label: decision.paatoksenTyyppi,
                                            value: decision.paatoksenTyyppi,
                                          },
                                        ]
                                      : []
                                }
                                onChange={(selected) =>
                                  handleSelectChange(selected, input.onChange)
                                }
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column landuse-detail__decisions-link-column">
                          <Field name={`${decisionName}.diaarinumero`}>
                            {({ input }) => (
                              <TextInput
                                id={`decision-diaarinumero-${decisionIndex}`}
                                label="Diaarinumero"
                                value={input.value ?? decision.diaarinumero}
                                onChange={input.onChange}
                                disabled={!isEditMode}
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
                                value={input.value ?? decision.huomautus}
                                onChange={input.onChange}
                                disabled={!isEditMode}
                                placeholder="Placeholder"
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
                                {({ input }) => (
                                  <Select
                                    id={`decision-ehto-tyyppi-${decisionIndex}-${conditionIndex}`}
                                    texts={{
                                      label: "Ehtotyyppi",
                                      placeholder: "Valitse",
                                    }}
                                    options={landUseConditionTypeOptions}
                                    value={
                                      input.value
                                        ? [
                                            {
                                              label: input.value,
                                              value: input.value,
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
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.valvontapvm`}>
                                {({ input }) => (
                                  <DateInput
                                    id={`decision-ehto-valvontapvm-${decisionIndex}-${conditionIndex}`}
                                    label="Valvontapvm"
                                    value={
                                      input.value ??
                                      conditions[conditionIndex].valvontapvm
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.valvottuPvm`}>
                                {({ input }) => (
                                  <DateInput
                                    id={`decision-ehto-valvottu-pvm-${decisionIndex}-${conditionIndex}`}
                                    label="Valvottu pvm"
                                    value={
                                      input.value ??
                                      conditions[conditionIndex].valvottuPvm
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${conditionName}.note`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`decision-ehto-huomautus-${decisionIndex}-${conditionIndex}`}
                                    label="Huomautus"
                                    value={
                                      input.value ??
                                      conditions[conditionIndex].note
                                    }
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                    placeholder="Placeholder"
                                  />
                                )}
                              </Field>
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
                              `decisions.${decisionIndex}.ehdot`,
                              createNewDecisionCondition(),
                            );
                          }}
                        >
                          Lisää ehto
                        </Button>
                      </div>

                      <div className="landuse-detail__decisions-add-row">
                        <Button
                          type="button"
                          variant={ButtonVariant.Danger}
                          iconStart={<IconTrash />}
                          disabled={!isEditMode}
                          onClick={() => {
                            setDecisionIndexPendingDelete(decisionIndex);
                          }}
                        >
                          Poista päätös
                        </Button>
                      </div>
                    </Fieldset>
                  </Accordion>
                );
              })}

              <div className="landuse-detail__decisions-add-row">
                <Button
                  type="button"
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconPlusCircleFill />}
                  disabled={!isEditMode}
                  onClick={() => {
                    const newDecisionIndex = decisions.length;
                    form.mutators.push("decisions", createNewDecision());
                    setNewDecisionIndexToOpen(newDecisionIndex);
                  }}
                >
                  Lisää päätös
                </Button>
              </div>

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
                            {({ input }) => (
                              <Select
                                id={`agreement-tyyppi-${agreementIndex}`}
                                texts={{
                                  label: "Sopimuksen tyyppi",
                                  placeholder: "Valitse",
                                }}
                                options={landUseAgreementTypeOptions}
                                value={
                                  input.value
                                    ? [
                                        {
                                          label: input.value,
                                          value: input.value,
                                        },
                                      ]
                                    : agreement.sopimuksenTyyppi
                                      ? [
                                          {
                                            label: agreement.sopimuksenTyyppi,
                                            value: agreement.sopimuksenTyyppi,
                                          },
                                        ]
                                      : []
                                }
                                onChange={(selected) =>
                                  handleSelectChange(selected, input.onChange)
                                }
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.sopimusnumero`}>
                            {({ input }) => (
                              <TextInput
                                id={`agreement-sopimusnumero-${agreementIndex}`}
                                label="Sopimusnumero"
                                value={input.value ?? agreement.sopimusnumero}
                                onChange={input.onChange}
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.allekirjoituspvm`}>
                            {({ input }) => (
                              <DateInput
                                id={`agreement-allekirjoituspvm-${agreementIndex}`}
                                label="Allekirjoituspvm"
                                value={
                                  input.value ?? agreement.allekirjoituspvm
                                }
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.huomautus`}>
                            {({ input }) => (
                              <TextInput
                                id={`agreement-huomautus-${agreementIndex}`}
                                label="Huomautus"
                                value={input.value ?? agreement.huomautus}
                                onChange={input.onChange}
                                disabled={!isEditMode}
                                placeholder="Placeholder"
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field
                            name={`${agreementName}.allekirjoitettavaMennessa`}
                          >
                            {({ input }) => (
                              <DateInput
                                id={`agreement-allekirjoitettava-mennessa-${agreementIndex}`}
                                label="Allekirjoitettava mennessä"
                                value={
                                  input.value ??
                                  agreement.allekirjoitettavaMennessa
                                }
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field
                            name={`${agreementName}.ensimmainenKutsuLahetetty`}
                          >
                            {({ input }) => (
                              <DateInput
                                id={`agreement-1-kutsu-${agreementIndex}`}
                                label="1. kutsu lähetetty"
                                value={
                                  input.value ??
                                  agreement.ensimmainenKutsuLahetetty
                                }
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.toinenKutsuLahetetty`}>
                            {({ input }) => (
                              <DateInput
                                id={`agreement-2-kutsu-${agreementIndex}`}
                                label="2. kutsu lähetetty"
                                value={
                                  input.value ?? agreement.toinenKutsuLahetetty
                                }
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column">
                          <Field name={`${agreementName}.kolmasKutsuLahetetty`}>
                            {({ input }) => (
                              <DateInput
                                id={`agreement-3-kutsu-${agreementIndex}`}
                                label="3. kutsu lähetetty"
                                value={
                                  input.value ?? agreement.kolmasKutsuLahetetty
                                }
                                onChange={input.onChange}
                                placeholder="DD.MM.YYYY"
                                disabled={!isEditMode}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="landuse-detail__column landuse-detail__decisions-paatos-column">
                          <Field name={`${agreementName}.paatos`}>
                            {({ input }) => (
                              <Select
                                id={`agreement-paatos-${agreementIndex}`}
                                texts={{
                                  label: "Päätös",
                                  placeholder: "Valitse",
                                }}
                                options={landUseDecisionTypeOptions}
                                value={
                                  input.value
                                    ? [
                                        {
                                          label: input.value,
                                          value: input.value,
                                        },
                                      ]
                                    : agreement.paatos
                                      ? [
                                          {
                                            label: agreement.paatos,
                                            value: agreement.paatos,
                                          },
                                        ]
                                      : []
                                }
                                onChange={(selected) =>
                                  handleSelectChange(selected, input.onChange)
                                }
                                disabled={!isEditMode}
                              />
                            )}
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
                                {({ input }) => (
                                  <DateInput
                                    id={`agreement-muutos-allekirjoituspvm-${agreementIndex}-${changeIndex}`}
                                    label="Allekirjoituspvm"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.allekirjoituspvm ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.allekirjoitettavaMennessa`}
                              >
                                {({ input }) => (
                                  <DateInput
                                    id={`agreement-muutos-allekirjoitettava-mennessa-${agreementIndex}-${changeIndex}`}
                                    label="Allekirjoitettava mennessä"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.allekirjoitettavaMennessa ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.ensimmainenKutsuLahetetty`}
                              >
                                {({ input }) => (
                                  <DateInput
                                    id={`agreement-muutos-1-kutsu-${agreementIndex}-${changeIndex}`}
                                    label="1. kutsu lähetetty"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.ensimmainenKutsuLahetetty ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.toinenKutsuLahetetty`}
                              >
                                {({ input }) => (
                                  <DateInput
                                    id={`agreement-muutos-2-kutsu-${agreementIndex}-${changeIndex}`}
                                    label="2. kutsu lähetetty"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.toinenKutsuLahetetty ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field
                                name={`${changeName}.kolmasKutsuLahetetty`}
                              >
                                {({ input }) => (
                                  <DateInput
                                    id={`agreement-muutos-3-kutsu-${agreementIndex}-${changeIndex}`}
                                    label="3. kutsu lähetetty"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.kolmasKutsuLahetetty ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    placeholder="DD.MM.YYYY"
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="landuse-detail__column">
                              <Field name={`${changeName}.paatos`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`agreement-muutos-paatos-${agreementIndex}-${changeIndex}`}
                                    label="Päätös"
                                    value={
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.paatos ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                    placeholder="Placeholder"
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
                                      input.value ??
                                      agreement.muutokset[changeIndex]
                                        ?.huomautus ??
                                      ""
                                    }
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                    placeholder="Placeholder"
                                  />
                                )}
                              </Field>
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
                              `agreements.${agreementIndex}.muutokset`,
                              createNewAgreementChange(),
                            );
                          }}
                        >
                          Lisää sopimuksen muutos
                        </Button>
                      </div>

                      <h3 className="landuse-detail__subsection-title">
                        Vakuudet
                      </h3>

                      <div className="landuse-detail__decisions-vakuuslaskuri">
                        <Field name={`${agreementName}.vakuuslaskuri`}>
                          {({ input }) => (
                            <Checkbox
                              id={`agreement-vakuuslaskuri-${agreementIndex}`}
                              label="Vakuuslaskuri"
                              checked={
                                typeof input.value === "boolean"
                                  ? input.value
                                  : agreement.vakuuslaskuri
                              }
                              onChange={(event) =>
                                input.onChange(event.target.checked)
                              }
                              disabled={!isEditMode}
                            />
                          )}
                        </Field>
                      </div>

                      {(agreement.vakuudet ?? []).map((_, vakuusIndex) => {
                        const vakuusName = `${agreementName}.vakuudet.${vakuusIndex}`;
                        const usageRows = (
                          agreement.vakuudet[vakuusIndex].siteUsages ?? []
                        ).map((row, rowIndex) => {
                          const kaytettyEuroValue = parseLandUseNumericValue(
                            row.vakuuttaKaytettyEuro,
                          );

                          return {
                            id: `${agreementIndex}-${vakuusIndex}-${rowIndex}`,
                            kohde: row.kohde,
                            hallintamuoto: row.hallintamuoto,
                            vakuuttaKaytettyEuro:
                              kaytettyEuroValue !== null
                                ? formatLandUseEuroValue(kaytettyEuroValue)
                                : row.vakuuttaKaytettyEuro,
                            vakuuttaKaytettyProsentti:
                              row.vakuuttaKaytettyProsentti,
                          };
                        });

                        return (
                          <div
                            className="landuse-detail__decisions-vakuus-block"
                            key={`${vakuusName}-${vakuusIndex}`}
                          >
                            <div className="landuse-detail__grid landuse-detail__decisions-grid">
                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.jarjestysnumero`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-jarjestysnumero-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuuden järjestysnumero"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .jarjestysnumero
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.tyyppi`}>
                                  {({ input }) => (
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
                                          : agreement.vakuudet[vakuusIndex]
                                                .tyyppi
                                            ? [
                                                {
                                                  label:
                                                    agreement.vakuudet[
                                                      vakuusIndex
                                                    ].tyyppi ?? "",
                                                  value:
                                                    agreement.vakuudet[
                                                      vakuusIndex
                                                    ].tyyppi ?? "",
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
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.laji`}>
                                  {({ input }) => (
                                    <Select
                                      id={`vakuus-laji-${agreementIndex}-${vakuusIndex}`}
                                      texts={{
                                        label: "Vakuuden laji",
                                        placeholder: "Valitse",
                                      }}
                                      options={landUseGuaranteeCategoryOptions}
                                      value={
                                        input.value
                                          ? [
                                              {
                                                label: input.value,
                                                value: input.value,
                                              },
                                            ]
                                          : agreement.vakuudet[vakuusIndex].laji
                                            ? [
                                                {
                                                  label:
                                                    agreement.vakuudet[
                                                      vakuusIndex
                                                    ].laji ?? "",
                                                  value:
                                                    agreement.vakuudet[
                                                      vakuusIndex
                                                    ].laji ?? "",
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
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuusnumero`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-vakuusnumero-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuusnumero"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .vakuusnumero
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.alkupvm`}>
                                  {({ input }) => (
                                    <DateInput
                                      id={`vakuus-alkupvm-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuuden alkupvm"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex].alkupvm
                                      }
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.loppupvm`}>
                                  {({ input }) => (
                                    <DateInput
                                      id={`vakuus-loppupvm-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuuden loppupvm"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex].loppupvm
                                      }
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.palautettuPvm`}>
                                  {({ input }) => (
                                    <DateInput
                                      id={`vakuus-palautettu-pvm-${agreementIndex}-${vakuusIndex}`}
                                      label="Palautettu pvm"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .palautettuPvm
                                      }
                                      onChange={input.onChange}
                                      placeholder="DD.MM.YYYY"
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.huomautus`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-huomautus-${agreementIndex}-${vakuusIndex}`}
                                      label="Huomautus"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .huomautus
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                      placeholder="Placeholder"
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field
                                  name={`${vakuusName}.panttikirjanNumero`}
                                >
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-panttikirjan-numero-${agreementIndex}-${vakuusIndex}`}
                                      label="Panttikirjan numero"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .panttikirjanNumero
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuudenMaara`}>
                                  {({ input }) => {
                                    const currentValue =
                                      input.value ??
                                      agreement.vakuudet[vakuusIndex]
                                        .vakuudenMaara;

                                    return (
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
                                        disabled={!isEditMode}
                                      />
                                    );
                                  }}
                                </Field>
                              </div>
                            </div>

                            <div className="landuse-detail__table-wrapper">
                              TODO poista taulukko, tai toteuta
                              &quot;käänteisenä&quot; vakuudet-välilehden
                              taulukkoon nähden
                              <Table
                                className="landuse-detail__table landuse-detail__monitoring-table table-td-dense-padding"
                                cols={vakuudetTableCols}
                                indexKey="id"
                                renderIndexCol={false}
                                rows={usageRows}
                                variant="light"
                              />
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

              <div className="landuse-detail__decisions-add-row">
                <Button
                  type="button"
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconPlusCircleFill />}
                  disabled={!isEditMode}
                  onClick={() => {
                    const newAgreementIndex = agreements.length;
                    form.mutators.push("agreements", createNewAgreement());
                    setNewAgreementIndexToOpen(newAgreementIndex);
                  }}
                >
                  Lisää sopimus
                </Button>
              </div>

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
