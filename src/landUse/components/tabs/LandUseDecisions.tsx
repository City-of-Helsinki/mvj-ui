import React from "react";
import {
  Accordion,
  Button,
  ButtonVariant,
  Checkbox,
  DateInput,
  Fieldset,
  IconPlusCircleFill,
  Select,
  Table,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";

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

const paattajaOptions = [
  { label: "Ville Virkailija", value: "Ville Virkailija" },
  {
    label: "Asuntotontit tiimipäällikkö",
    value: "Asuntotontit tiimipäällikkö",
  },
];

const pykalaOptions = [
  { label: "60 §", value: "60 §" },
  { label: "61 §", value: "61 §" },
  { label: "62 §", value: "62 §" },
];

const paatoksenTyyppiOptions = [
  {
    label: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    value: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
  },
  {
    label: "Maankäyttösopimuksen hyväksyntä",
    value: "Maankäyttösopimuksen hyväksyntä",
  },
];

const ehtoTyyppiOptions = [
  {
    label: "Rasite - ja/tai rasitteenluont.ehto",
    value: "Rasite - ja/tai rasitteenluont.ehto",
  },
  { label: "Muu ehto", value: "Muu ehto" },
];

const sopimuksenTyyppiOptions = [
  { label: "Maankäyttösopimus", value: "Maankäyttösopimus" },
  { label: "Esisopimus", value: "Esisopimus" },
];

const vakuudenTyyppiOptions = [
  { label: "Muu vakuus", value: "Muu vakuus" },
  { label: "Pankkitakaus", value: "Pankkitakaus" },
];

const vakuudenLajiOptions = [
  { label: "-", value: "-" },
  { label: "Rahavakuus", value: "Rahavakuus" },
];

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

const createNewAgreement = (): AgreementItem => ({
  title: "Uusi maankäyttösopimus",
  sopimuksenTyyppi: undefined,
  sopimusnumero: "",
  allekirjoituspvm: "",
  huomautus: "",
  allekirjoitettavaMennessa: "",
  ensimmainenKutsuLahetetty: "",
  toinenKutsuLahetetty: "",
  kolmasKutsuLahetetty: "",
  paatos: undefined,
  muutokset: [createNewAgreementChange()],
  vakuuslaskuri: false,
  vakuudet: [createNewGuarantee()],
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

const defaultDecisions: DecisionItem[] = [
  {
    title:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    paattaja: "Ville Virkailija",
    paatospvm: "11.2025",
    pykala: "60 §",
    paatoksenTyyppi: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    diaarinumero: "HEL2025-0123456",
    huomautus: "Ville Virkailija",
    ehdot: [
      {
        conditionType: "Rasite - ja/tai rasitteenluont.ehto",
        valvontapvm: "1.1.2025",
        valvottuPvm: "1.1.2025",
        note: "Placeholder",
      },
    ],
  },
  {
    title:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    paattaja: "Ville Virkailija",
    paatospvm: "11.2025",
    pykala: "60 §",
    paatoksenTyyppi: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    diaarinumero: "HEL2025-0123457",
    huomautus: "",
    ehdot: [],
  },
  {
    title:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    paattaja: "Ville Virkailija",
    paatospvm: "11.2025",
    pykala: "60 §",
    paatoksenTyyppi: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    diaarinumero: "HEL2025-0123458",
    huomautus: "",
    ehdot: [],
  },
  {
    title:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    paattaja: "Ville Virkailija",
    paatospvm: "11.2025",
    pykala: "60 §",
    paatoksenTyyppi: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    diaarinumero: "HEL2025-0123459",
    huomautus: "",
    ehdot: [],
  },
  {
    title:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    paattaja: "Ville Virkailija",
    paatospvm: "11.2025",
    pykala: "60 §",
    paatoksenTyyppi: "Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    diaarinumero: "HEL2025-0123460",
    huomautus: "",
    ehdot: [],
  },
];

const defaultAgreements: AgreementItem[] = [
  {
    title: "Maankäyttösopimus ED4509",
    sopimuksenTyyppi: "Maankäyttösopimus",
    sopimusnumero: "ED4509",
    allekirjoituspvm: "1.1.2025",
    huomautus: "Placeholder",
    allekirjoitettavaMennessa: "-",
    ensimmainenKutsuLahetetty: "-",
    toinenKutsuLahetetty: "-",
    kolmasKutsuLahetetty: "-",
    paatos:
      "Asuntotontit tiimipäällikkö 11.2025 60 § Rasite- ja/tai rasitteenluont.ehdon lis. (1 ehto)",
    muutokset: [
      {
        allekirjoituspvm: "1.1.2025",
        allekirjoitettavaMennessa: "-",
        ensimmainenKutsuLahetetty: "-",
        toinenKutsuLahetetty: "-",
        kolmasKutsuLahetetty: "-",
        paatos: "",
        huomautus: "Placeholder",
      },
    ],
    vakuuslaskuri: true,
    vakuudet: [
      {
        jarjestysnumero: "1/2",
        tyyppi: "Muu vakuus",
        laji: "-",
        vakuusnumero: "12345",
        alkupvm: "1.1.2025",
        loppupvm: "1.1.2025",
        palautettuPvm: "1.1.2025",
        huomautus: "Placeholder",
        panttikirjanNumero: "Muu vakuus",
        vakuudenMaara: "100 000 €",
        vakuuttaKaytetty: "70%",
        vakuuttaJaljella: "30 000 €",
        siteUsages: [
          {
            kohde: "91-38-52-1",
            hallintamuoto: "Vapaarahoitteinen omistusasuminen",
            vakuuttaKaytettyEuro: "20 000 €",
            vakuuttaKaytettyProsentti: "20 %",
          },
          {
            kohde: "91-38-52-2",
            hallintamuoto: "ARA-Vuokra",
            vakuuttaKaytettyEuro: "20 000 €",
            vakuuttaKaytettyProsentti: "20 %",
          },
          {
            kohde: "91-38-52-3",
            hallintamuoto: "ARA-Vuokra",
            vakuuttaKaytettyEuro: "20 000 €",
            vakuuttaKaytettyProsentti: "20 %",
          },
          {
            kohde: "91-38-52-4",
            hallintamuoto: "Vapaarahoitteinen omistusasuminen",
            vakuuttaKaytettyEuro: "10 000 €",
            vakuuttaKaytettyProsentti: "10 %",
          },
        ],
      },
      {
        jarjestysnumero: "2/2",
        tyyppi: "Muu vakuus",
        laji: "-",
        vakuusnumero: "123456",
        alkupvm: "1.1.2025",
        loppupvm: "1.1.2025",
        palautettuPvm: "1.1.2025",
        huomautus: "Placeholder",
        panttikirjanNumero: "Muu vakuus",
        vakuudenMaara: "30 000 €",
        vakuuttaKaytetty: "100%",
        vakuuttaJaljella: "0 €",
        siteUsages: [
          {
            kohde: "91-38-52-5",
            hallintamuoto: "ASO",
            vakuuttaKaytettyEuro: "30 000 €",
            vakuuttaKaytettyProsentti: "100 %",
          },
        ],
      },
    ],
  },
];

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
  return (
    <Form<LandUseDecisionsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const decisions = values.decisions?.length
          ? values.decisions
          : defaultDecisions;
        const agreements = values.agreements?.length
          ? values.agreements
          : defaultAgreements;

        const ensureDecisionsInitialized = () => {
          if (!values.decisions?.length) {
            form.change("decisions", defaultDecisions);
          }
        };

        const ensureAgreementsInitialized = () => {
          if (!values.agreements?.length) {
            form.change("agreements", defaultAgreements);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h2 className="landuse-detail__section-title">PÄÄTÖKSET</h2>

              {decisions.map((decision, decisionIndex) => {
                const decisionName = `decisions.${decisionIndex}`;
                const conditions = decision.ehdot?.length
                  ? decision.ehdot
                  : [
                      {
                        conditionType: "Rasite - ja/tai rasitteenluont.ehto",
                        valvontapvm: "1.1.2025",
                        valvottuPvm: "1.1.2025",
                        note: "Placeholder",
                      },
                    ];

                return (
                  <Accordion
                    key={`${decision.title}-${decisionIndex}`}
                    heading={getDecisionAccordionHeading(decision)}
                    initiallyOpen={decisionIndex === 0}
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
                                options={paattajaOptions}
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
                                options={pykalaOptions}
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
                                options={paatoksenTyyppiOptions}
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
                                    options={ehtoTyyppiOptions}
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
                            ensureDecisionsInitialized();
                            form.mutators.push(
                              `decisions.${decisionIndex}.ehdot`,
                              createNewDecisionCondition(),
                            );
                          }}
                        >
                          Lisää ehto
                        </Button>
                      </div>
                    </Fieldset>
                  </Accordion>
                );
              })}

              <h2 className="landuse-detail__section-title landuse-detail__decisions-section-break">
                SOPIMUKSET
              </h2>

              {agreements.map((agreement, agreementIndex) => {
                const agreementName = `agreements.${agreementIndex}`;

                return (
                  <Accordion
                    key={`${agreement.title}-${agreementIndex}`}
                    heading={getAgreementAccordionHeading(agreement)}
                    initiallyOpen={agreementIndex === 0}
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
                                options={sopimuksenTyyppiOptions}
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
                                options={paatoksenTyyppiOptions}
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

                      <div className="landuse-detail__decisions-add-row">
                        <Button
                          type="button"
                          variant={ButtonVariant.Supplementary}
                          iconStart={<IconPlusCircleFill />}
                          disabled={!isEditMode}
                          onClick={() => {
                            ensureAgreementsInitialized();
                            form.mutators.push(
                              "agreements",
                              createNewAgreement(),
                            );
                          }}
                        >
                          Lisää sopimus
                        </Button>
                      </div>

                      <h3 className="landuse-detail__subsection-title">
                        Sopimuksen muutokset
                      </h3>

                      {(agreement.muutokset?.length
                        ? agreement.muutokset
                        : [
                            {
                              allekirjoituspvm: "1.1.2025",
                              allekirjoitettavaMennessa: "-",
                              ensimmainenKutsuLahetetty: "-",
                              toinenKutsuLahetetty: "-",
                              kolmasKutsuLahetetty: "-",
                              paatos: "",
                              huomautus: "Placeholder",
                            },
                          ]
                      ).map((_, changeIndex) => {
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
                            ensureAgreementsInitialized();
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

                      {agreement.vakuudet.map((_, vakuusIndex) => {
                        const vakuusName = `${agreementName}.vakuudet.${vakuusIndex}`;
                        const usageRows = agreement.vakuudet[
                          vakuusIndex
                        ].siteUsages.map((row, rowIndex) => ({
                          id: `${agreementIndex}-${vakuusIndex}-${rowIndex}`,
                          kohde: row.kohde,
                          hallintamuoto: row.hallintamuoto,
                          vakuuttaKaytettyEuro: row.vakuuttaKaytettyEuro,
                          vakuuttaKaytettyProsentti:
                            row.vakuuttaKaytettyProsentti,
                        }));

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
                                      options={vakuudenTyyppiOptions}
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
                                      options={vakuudenLajiOptions}
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
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-vakuuden-maara-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuuden määrä"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .vakuudenMaara
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuuttaKaytetty`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-vakuutta-kaytetty-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuutta käytetty"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .vakuuttaKaytetty
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="landuse-detail__column">
                                <Field name={`${vakuusName}.vakuuttaJaljella`}>
                                  {({ input }) => (
                                    <TextInput
                                      id={`vakuus-vakuutta-jaljella-${agreementIndex}-${vakuusIndex}`}
                                      label="Vakuutta jäljellä"
                                      value={
                                        input.value ??
                                        agreement.vakuudet[vakuusIndex]
                                          .vakuuttaJaljella
                                      }
                                      onChange={input.onChange}
                                      disabled={!isEditMode}
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>

                            <div className="landuse-detail__sites-table-wrapper">
                              <Table
                                className="landuse-detail__sites-table landuse-detail__monitoring-table"
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
                            ensureAgreementsInitialized();
                            form.mutators.push(
                              `agreements.${agreementIndex}.vakuudet`,
                              createNewGuarantee(),
                            );
                          }}
                        >
                          Lisää vakuus
                        </Button>
                      </div>
                    </Fieldset>
                  </Accordion>
                );
              })}
            </div>
          </form>
        );
      }}
    />
  );
};
