import { formValueSelector } from "redux-form";
import _ from "lodash";
import { FormNames } from "@/enums";
import { ApplicantInfoCheckExternalTypes, ApplicantInfoCheckTypes, ApplicantTypes, TargetIdentifierTypes } from "@/application/enums";
import { getContentUser } from "@/users/helpers";
import createUrl from "@/api/createUrl";
import { APPLICANT_MAIN_IDENTIFIERS, APPLICANT_SECTION_IDENTIFIER, TARGET_SECTION_IDENTIFIER } from "@/application/constants";
import { store } from "@/index";
import { displayUIMessage } from "@/util/helpers";
import type { PlotSearch } from "@/plotSearch/types";
import type { RootState } from "@/root/types";
import type { ApplicationFormSection, Form, FormSection, PlotApplicationFormValue, SavedApplicationFormSection, UploadedFileMeta } from "@/application/types";
export const transformTargetSectionTitle = (plotSearch: PlotSearch): (...args: Array<any>) => any => (title: string, section: FormSection, answer: SavedApplicationFormSection): string => {
  if (section.identifier === TARGET_SECTION_IDENTIFIER && answer?.metadata?.identifier) {
    const target = plotSearch?.plot_search_targets.find(target => target.id === answer.metadata?.identifier);

    if (target) {
      return getTargetTitle(target);
    }
  }

  return title;
};
export const transformApplicantSectionTitle = (title: string, section: FormSection, answer: SavedApplicationFormSection): string => {
  if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
    if (answer?.metadata?.identifier) {
      if (answer?.metadata?.applicantType) {
        const identifiers = APPLICANT_MAIN_IDENTIFIERS[String(answer?.metadata?.applicantType)];
        const sectionsWithIdentifier = answer.sections[identifiers?.DATA_SECTION];
        const sectionWithIdentifier = sectionsWithIdentifier instanceof Array ? sectionsWithIdentifier[0] : sectionsWithIdentifier;
        const typeText = identifiers?.LABEL || 'Hakija';
        const nameText = identifiers?.NAME_FIELDS?.map(field => {
          return sectionWithIdentifier.fields[field]?.value || '';
        }).join(' ') || '-';
        return `${title} (${nameText}, ${typeText})`;
      }
    }
  }

  return title;
};
export const getApplicantInfoCheckFormName = (infoCheckId: number): string => `${FormNames.APPLICANT_INFO_CHECK}--${infoCheckId}`;
const APPLICATION_INFO_CHECK_DEFINITIONS = [{
  type: ApplicantInfoCheckTypes.TRADE_REGISTER,
  label: 'Kaupparekisteriote',
  useIfCompany: true,
  useIfPerson: false,
  external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY
}, {
  type: ApplicantInfoCheckTypes.CREDITWORTHINESS,
  label: 'Luottokelpoisuustodistus / luottotiedot',
  useIfCompany: true,
  useIfPerson: true,
  external: ApplicantInfoCheckExternalTypes.CREDIT_INQUIRY
}, {
  type: ApplicantInfoCheckTypes.PENSION_CONTRIBUTIONS,
  label: 'Selvitys työeläkemaksujen maksamisesta',
  useIfCompany: true,
  useIfPerson: true,
  external: null
}, {
  type: ApplicantInfoCheckTypes.VAT_REGISTER,
  label: 'Todistus arvonlisärekisteriin lisäämisestä',
  useIfCompany: true,
  useIfPerson: false,
  external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY
}, {
  type: ApplicantInfoCheckTypes.ADVANCE_PAYMENT,
  label: 'Todistus ennakkoperintärekisteriin lisäämisestä',
  useIfCompany: true,
  useIfPerson: false,
  external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY
}, {
  type: ApplicantInfoCheckTypes.TAX_DEBT,
  label: 'Verovelkatodistus',
  useIfCompany: true,
  useIfPerson: false,
  external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY
}, {
  type: ApplicantInfoCheckTypes.EMPLOYER_REGISTER,
  label: 'Todistus työnantajarekisteriin lisäämisestä',
  useIfCompany: true,
  useIfPerson: false,
  external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY
}];
export const getApplicantInfoCheckItems = (existingData: Array<Record<string, any>>): Array<Record<string, any>> => {
  return APPLICATION_INFO_CHECK_DEFINITIONS.map(item => {
    const existingItem = existingData.find(existingItem => existingItem.name === item.type);

    if (!existingItem) {
      return null;
    }

    return {
      kind: { ...item
      },
      data: { ...existingItem,
        preparer: getContentUser(existingItem.preparer)
      }
    };
  }).filter(item => !!item);
};
export const prepareApplicantInfoCheckForSubmission = (infoCheck: Record<string, any>): Record<string, any> => {
  return {
    id: infoCheck.id,
    preparer: infoCheck.preparer?.id,
    comment: infoCheck.comment,
    state: infoCheck.state,
    mark_all: infoCheck.mark_all
  };
};
export const valueToApplicantType = (value: PlotApplicationFormValue): string | null => {
  if (value === '1') {
    return ApplicantTypes.COMPANY;
  }

  if (value === '2') {
    return ApplicantTypes.PERSON;
  }

  return ApplicantTypes.UNKNOWN;
};
export const getSectionApplicantType = (state: RootState, formName: string, section: FormSection, reduxFormPath: string): string => {
  if (section.identifier !== APPLICANT_SECTION_IDENTIFIER) {
    return ApplicantTypes.NOT_APPLICABLE;
  }

  return formValueSelector(formName)(state, `${reduxFormPath}.metadata.applicantType`) || ApplicantTypes.UNSELECTED;
};
export const getTargetType = (target: Record<string, any>): string | null => {
  if (target.plan_unit) {
    return TargetIdentifierTypes.PLAN_UNIT;
  }

  if (target.custom_detailed_plan) {
    return TargetIdentifierTypes.CUSTOM_DETAILED_PLAN;
  }

  return null;
};
export const getTargetIdentifier = (target: Record<string, any>): string => {
  const targetType = getTargetType(target);

  if (targetType === TargetIdentifierTypes.PLAN_UNIT) {
    return target.lease_identifier;
  } else if (targetType === TargetIdentifierTypes.CUSTOM_DETAILED_PLAN) {
    return target.custom_detailed_plan?.identifier || '';
  } else {
    return '';
  }
};
export const getTargetTitle = (target: Record<string, any>): string => {
  const targetType = getTargetType(target);
  const targetIdentifier = getTargetIdentifier(target);

  if (targetType === TargetIdentifierTypes.PLAN_UNIT) {
    return `${target.lease_address?.address || '-'} (${targetIdentifier})`;
  } else if (targetType === TargetIdentifierTypes.CUSTOM_DETAILED_PLAN) {
    return `${target.custom_detailed_plan?.address || '-'} (${targetIdentifier})`;
  } else {
    return '?';
  }
};
export const getInitialApplicationForm = (fieldTypes: Record<number, string>, form?: Form, existingValues?: Record<string, any> | null): Record<string, any> | null => {
  if (!form) {
    return null;
  }

  const root = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: [],
    attachments: []
  };

  const buildSectionItem = (section, parent, sectionAnswer?: any) => {
    const workingItem: ApplicationFormSection = {
      sections: {},
      fields: {},
      sectionRestrictions: {}
    };

    if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
      workingItem.metadata = {
        applicantType: null
      };
      section.subsections.forEach(subsection => {
        workingItem.sectionRestrictions[subsection.identifier] = subsection.applicant_type;
      });
    }

    section.subsections.forEach(subsection => buildSection(subsection, workingItem.sections, sectionAnswer?.sections?.[subsection.identifier]));
    section.fields.forEach(field => buildField(field, workingItem.fields, sectionAnswer?.fields?.[field.identifier]));

    if (sectionAnswer?.metadata) {
      workingItem.metadata = { ...(workingItem.metadata || {}),
        ...sectionAnswer.metadata
      };
    }

    return workingItem;
  };

  const buildSection = (section, parent, sectionAnswers): void => {
    if (!section.visible) {
      return;
    }

    if (section.add_new_allowed && !root.sectionTemplates[section.identifier]) {
      root.sectionTemplates[section.identifier] = buildSectionItem(section, parent);
    }

    if (sectionAnswers) {
      if (section.add_new_allowed) {
        if (!(sectionAnswers instanceof Array)) {
          console.error('type mismatch', section, sectionAnswers);
        }

        parent[section.identifier] = sectionAnswers.map(sectionAnswer => buildSectionItem(section, parent, sectionAnswer));
      } else {
        parent[section.identifier] = buildSectionItem(section, parent, sectionAnswers);
      }
    } else {
      const defaultItem = buildSectionItem(section, parent);

      if (section.add_new_allowed && section.identifier === TARGET_SECTION_IDENTIFIER) {
        parent[section.identifier] = [];
      } else if (section.add_new_allowed) {
        parent[section.identifier] = [defaultItem];
      } else {
        parent[section.identifier] = defaultItem;
      }
    }
  };

  const buildField = (field, parent, answer): void => {
    if (!field.enabled) {
      return;
    }

    let reformattedAnswer;

    if (answer) {
      reformattedAnswer = {
        value: answer.value,
        extraValue: answer.extra_value
      };
    }

    let initialValue;

    switch (fieldTypes[field.type]) {
      case 'uploadfiles':
        if (!root.fileFieldIds.includes(field.id)) {
          root.fileFieldIds.push(field.id);
        }

        if (reformattedAnswer) {
          root.attachments.push(...reformattedAnswer.value.map(file => file.id));
        }

        initialValue = {
          value: reformattedAnswer?.value?.map(file => file.id) || ([] as Array<UploadedFileMeta>),
          extraValue: ''
        };
        break;

      case 'dropdown':
      case 'radiobutton':
      case 'radiobuttoninline':
        initialValue = reformattedAnswer || {
          value: '',
          extraValue: ''
        };
        break;

      case 'checkbox':
        if (reformattedAnswer) {
          initialValue = reformattedAnswer;
        } else if (field.choices?.length > 1) {
          initialValue = {
            value: ([] as Array<string>),
            extraValue: ''
          };
        } else {
          initialValue = {
            value: false,
            extraValue: ''
          };
        }

        break;

      case 'hidden':
        initialValue = {
          value: field.default_value,
          extraValue: ''
        };
        break;

      case 'textbox':
      case 'textarea':
      default:
        initialValue = reformattedAnswer || {
          value: '',
          extraValue: ''
        };
        break;
    }

    if (initialValue) {
      parent[field.identifier] = initialValue;
    }
  };

  form.sections.forEach(section => buildSection(section, root.sections, existingValues?.sections?.[section.identifier]));
  return root;
};
export const getApplicationAttachmentDownloadLink = (id: number): string => createUrl(`attachment/${id}/download`);
export const getAreaSearchApplicationAttachmentDownloadLink = (id: number): string => createUrl(`area_search_attachment/${id}/download`);
export const getSectionTemplate = (formName: string, formPath: string, identifier: string): Record<string, any> => {
  const state = store.getState();
  const templates = formValueSelector(formName)(state, (formPath ? `${formPath}.` : '') + 'sectionTemplates');
  return templates[identifier] || {};
};
export const getFieldFileIds = (state: RootState, formName: string, fieldPath: string): Array<number> => {
  const fieldValue = formValueSelector(formName)(state, fieldPath);
  return fieldValue?.value || [];
};
export const prepareApplicationForSubmission = (sections: Record<string, any>): Record<string, any> | null => {
  try {
    const attachMeta = rootLevelSections => {
      Object.keys(rootLevelSections).forEach(sectionName => {
        const section = rootLevelSections[sectionName];

        switch (sectionName) {
          case APPLICANT_SECTION_IDENTIFIER:
            section.forEach(applicant => {
              const applicantType = applicant.metadata.applicantType;
              applicant.sections = _.pickBy(_.cloneDeep(applicant.sections), (subsection, sectionIdentifier: string) => [ApplicantTypes.BOTH, applicant.metadata.applicantType].includes(applicant.sectionRestrictions[sectionIdentifier]));

              try {
                const identifiers = APPLICANT_MAIN_IDENTIFIERS[applicantType];
                const sectionWithIdentifier = applicant.sections[identifiers?.DATA_SECTION];
                const identifier = sectionWithIdentifier?.fields[identifiers?.IDENTIFIER_FIELD] || sectionWithIdentifier[0]?.fields[identifiers?.IDENTIFIER_FIELD];

                if (!identifier?.value) {
                  // noinspection ExceptionCaughtLocallyJS
                  throw new Error(`no identifier of type ${applicant.metadata?.applicantType || 'unknown'} found for applicant section`);
                }

                applicant.metadata.identifier = identifier.value;
              } catch (e) {
                // sectionWithIdentifier or the value itself was not found, or something else went unexpectedly wrong
                displayUIMessage({
                  title: '',
                  body: 'Hakijan henkilö- tai Y-tunnuksen käsittely epäonnistui!'
                }, {
                  type: 'error'
                });
                throw e;
              }
            });
            break;

          case TARGET_SECTION_IDENTIFIER:
            section.forEach(target => {
              target.metadata = {
                identifier: target.metadata.identifier
              };
            });
            break;
        }
      });
      return rootLevelSections;
    };

    const purgeUIFields = node => {
      _.each(node, section => {
        if (section instanceof Array) {
          section.forEach(item => {
            delete item.sectionRestrictions;
            purgeUIFields(item.sections);
          });
        } else {
          delete section.sectionRestrictions;
          purgeUIFields(section.sections);
        }
      });

      return node;
    };

    return purgeUIFields(attachMeta(_.cloneDeep(sections)));
  } catch (e) {
    console.log(e);
    return null;
  }
};