// @flow

import get from 'lodash/get';
import _ from 'lodash';
import {formValueSelector} from 'redux-form';
import {getFieldAttributes, displayUIMessage, getApiResponseResults} from '$util/helpers';

import createUrl from '$src/api/createUrl';
import {store} from '$src/root/startApp';
import {FormNames} from '$src/enums';
import {
  getApplicationApplicantInfoCheckData, getApplicationRelatedPlotSearch, getApplicationTargetInfoCheckData,
  getCurrentEditorTargets,
} from '$src/plotApplications/selectors';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
} from '$src/plotApplications/constants';
import type {LeafletFeature, LeafletGeoJson, Attributes} from '$src/types';
import {ApplicantInfoCheckTypes, ApplicantTypes, PlotApplicationApplicantInfoCheckExternalTypes} from '$src/plotApplications/enums';
import type {RootState} from '$src/root/types';
import type {PlotApplicationFormValue, ApplicationFormSection, ApplicationFormState, UploadedFileMeta} from '$src/plotApplications/types';
import type {Form, FormSection} from '$src/plotSearch/types';

/**
 * Get plotApplication list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotApplication) => getContentApplicationListItem(plotApplication));

/**
 * Get plotApplication list item
 * @param {Object} plotApplication
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Object): Object => {
  return {
    id: plotApplication.id,
    plot_search: plotApplication.plot_search,
    applicants: plotApplication.applicants,
    plot_search_type: plotApplication.plot_search_type,
    plot_search_subtype: plotApplication.plot_search_subtype,
    target_identifier: plotApplication.targets.map(target => target.identifier),
    target_address: plotApplication.targets.map(target => target.address.address),
    target_reserved: plotApplication.targets.map(target => target.reserved),
  };
};

/**
 * Get application target features for geojson data
 * @param {Object[]} applications
 * @returns {Object[]}
 */
export const getApplicationTargetFeatures = (applications: Array<Object>): Array<LeafletFeature> => {
  const features = [];

  applications.forEach((application) => {
    const targets = get(application, 'targets', []);

    targets.forEach((target) => {
      const coords = get(target, 'geometry.coordinates', []);

      if (!coords.length) {
        return;
      }

      features.push({
        type: 'Feature',
        geometry: {
          ...target.geometry,
        },
        properties: {
          id: application.id,
          feature_type: 'plotApplication',
          target: target,
          state: get(application, 'state.id') || application.state,
        },
      });
    });
  });

  return features;
};

/**
 * Get application target geojson data
 * @param {Object[]} applications
 * @returns {Object}
 */
export const getApplicationTargetGeoJson = (applications: Array<Object>): LeafletGeoJson => {
  const features = getApplicationTargetFeatures(applications);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

export const reshapeSavedApplicationObject = (
  application: Object,
  form: Form,
  formAttributes: Attributes,
  attachments: Array<Object>
): Object => {
  const getEmptySection = (): Object => ({
    sections: {},
    fields: {},
  });

  const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

  const result = getEmptySection();

  const reshapeSingleSectionData = (section, answersNode, sectionPath) => {
    const data = getEmptySection();

    if (answersNode.metadata) {
      data.metadata = {...answersNode.metadata};
    }

    section.subsections.forEach((subsection) => {
      reshapeArrayOrSingleSection(subsection, data, answersNode, `${sectionPath}.${subsection.identifier}`);
    });

    section.fields.forEach((field) => {
      let {value, extra_value} = answersNode.fields[field.identifier] || {};

      switch (fieldTypes?.find((fieldType) => fieldType.value === field.type)?.display_name) {
        case 'radiobutton':
        case 'radiobuttoninline':
          value = value !== null && value !== undefined ? value.toString() : null;
          break;
        case 'checkbox':
        case 'dropdown':
          if (!field.choices) {
            value = value !== null && value !== undefined ? value : null;
          }
          break;
        case 'uploadfiles':
          // auto added attachment path goes only up to the section as field is already in its own field
          value = attachments.filter((attachment) =>
            attachment.field === field.identifier && attachment.path === sectionPath);
          extra_value = '';
          break;
      }

      data.fields[field.identifier] = {
        value,
        extra_value,
      };
    });

    return data;
  };

  const reshapeArrayOrSingleSection = (section, parentResultNode, answersNode, sectionPath) => {
    if (section.add_new_allowed) {
      parentResultNode.sections[section.identifier] = [];

      const sectionAnswers = _.transform(answersNode, (acc, item, key) => {
        const match = new RegExp(`^${_.escapeRegExp(section.identifier)}\\[(\\d+)]$`).exec(key);

        if (!match) {
          return acc;
        }

        acc[Number(match[1])] = item;
        return acc;
      }, []).filter((item) => item !== undefined);

      sectionAnswers.forEach((answer, i) => {
        parentResultNode.sections[section.identifier].push(reshapeSingleSectionData(section, answer, `${sectionPath}[${i}]`));
      });


    } else {
      const sectionAnswers = answersNode[section.identifier];

      if (sectionAnswers) {
        parentResultNode.sections[section.identifier] = reshapeSingleSectionData(section, sectionAnswers, sectionPath);
      }
    }
  };

  form.sections.forEach((section) => reshapeArrayOrSingleSection(section, result, application, `${section.identifier}`));
  return result;
};

export const getInitialApplication = (): ApplicationFormState => {
  return {
    formId: null,
    targets: [],
    formEntries: null,
  };
};

export const getInitialApplicationForm = (
  fieldTypes: { [id: number]: string },
  form?: Form,
  existingValues?: Object | null
): Object | null => {
  if (!form) {
    return null;
  }

  const root = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: [],
    attachments: [],
  };

  const buildSectionItem = (section, parent, sectionAnswer) => {
    const workingItem: ApplicationFormSection = {
      sections: {},
      fields: {},
      sectionRestrictions: {},
    };

    if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
      workingItem.metadata = {
        applicantType: null,
      };

      section.subsections.forEach((subsection) => {
        workingItem.sectionRestrictions[subsection.identifier] = subsection.applicant_type;
      });
    }

    section.subsections.forEach((subsection) =>
      buildSection(subsection, workingItem.sections, sectionAnswer?.sections?.[subsection.identifier])
    );
    section.fields.forEach((field) => buildField(field, workingItem.fields, sectionAnswer?.fields?.[field.identifier]));

    if (sectionAnswer?.metadata) {
      workingItem.metadata = {
        ...(workingItem.metadata || {}),
        ...sectionAnswer.metadata,
      };
    }

    return workingItem;
  };

  const buildSection = (
    section,
    parent,
    sectionAnswers
  ): void => {
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
        parent[section.identifier] = sectionAnswers.map((sectionAnswer) => buildSectionItem(section, parent, sectionAnswer));
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
        extraValue: answer.extra_value,
      };
    }

    let initialValue;
    switch (fieldTypes[field.type]) {
      case 'uploadfiles':
        if (!root.fileFieldIds.includes(field.id)) {
          root.fileFieldIds.push(field.id);
        }

        if (reformattedAnswer) {
          root.attachments.push(...reformattedAnswer.value.map((file) => file.id));
        }

        initialValue = {
          value: reformattedAnswer?.value?.map((file) => file.id) || ([]: Array<UploadedFileMeta>),
          extraValue: '',
        };
        break;
      case 'dropdown':
      case 'radiobutton':
      case 'radiobuttoninline':
        initialValue = reformattedAnswer || {
          value: '',
          extraValue: '',
        };
        break;
      case 'checkbox':
        if (reformattedAnswer) {
          initialValue = reformattedAnswer;
        } else if (field.choices?.length > 1) {
          initialValue = {
            value: ([]: Array<string>),
            extraValue: '',
          };
        } else {
          initialValue = {
            value: false,
            extraValue: '',
          };
        }
        break;
      case 'textbox':
      case 'textarea':
      default:
        initialValue = reformattedAnswer || {
          value: '',
          extraValue: '',
        };
        break;
    }

    if (initialValue) {
      parent[field.identifier] = initialValue;
    }
  };

  form.sections.forEach((section) => buildSection(section, root.sections, existingValues?.sections?.[section.identifier]));

  return root;
};

export const getSectionTemplate = (identifier: string): Object => {
  const state = store.getState();
  const templates = formValueSelector(FormNames.PLOT_APPLICATION)(
    state,
    'formEntries.sectionTemplates'
  );

  return templates[identifier] || {};
};

export const prepareApplicationForSubmission = (): Object | null => {
  const state = store.getState();
  const selector = formValueSelector(FormNames.PLOT_APPLICATION);

  const sections = selector(state, 'formEntries.sections');

  try {
    const attachMeta = (rootLevelSections) => {
      Object.keys(rootLevelSections).forEach((sectionName) => {
        const section = rootLevelSections[sectionName];

        switch (sectionName) {
          case APPLICANT_SECTION_IDENTIFIER:
            section.forEach((applicant) => {
              const applicantType = applicant.metadata.applicantType;

              applicant.sections = _.pickBy(
                _.cloneDeep(applicant.sections),
                (subsection, sectionIdentifier: string) => [ApplicantTypes.BOTH, applicant.metadata.applicantType].includes(
                  applicant.sectionRestrictions[sectionIdentifier]
                )
              );

              try {
                const identifiers = APPLICANT_MAIN_IDENTIFIERS[applicantType];

                const sectionWithIdentifier = applicant.sections[identifiers?.DATA_SECTION];
                const identifier = sectionWithIdentifier?.fields[identifiers?.IDENTIFIER_FIELD]
                  || sectionWithIdentifier[0]?.fields[identifiers?.IDENTIFIER_FIELD];

                if (!identifier?.value) {
                  // noinspection ExceptionCaughtLocallyJS
                  throw new Error(`no identifier of type ${applicant.metadata?.applicantType || 'unknown'} found for applicant section`);
                }
                applicant.metadata.identifier = identifier.value;
              } catch (e) {
                // sectionWithIdentifier or the value itself was not found, or something else went unexpectedly wrong
                displayUIMessage({title: '', body: 'Hakijan henkilö- tai Y-tunnuksen käsittely epäonnistui!'}, {type: 'error'});
                throw e;
              }
            });
            break;
          case TARGET_SECTION_IDENTIFIER:
            section.forEach((target) => {
              target.metadata = {
                identifier: target.metadata.identifier,
              };
            });
            break;
        }
      });

      return rootLevelSections;
    };

    const purgeUIFields = (node) => {
      _.each(node, (section) => {
        if (section instanceof Array) {
          section.forEach((item) => {
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

    return {
      form: selector(state, 'formId'),
      entries: {
        sections: purgeUIFields(attachMeta(sections)),
      },
      targets: selector(state, 'targets'),
      attachments: selector(state, 'formEntries.attachments'),
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSectionTargetFromMeta = (field: string): string => {
  const state = store.getState();
  const meta = formValueSelector(FormNames.PLOT_APPLICATION)(state, `${field}.metadata`);

  if (meta) {
    const target = getCurrentEditorTargets(state).find((target) => target.id === meta.identifier);
    return target ? `${target.lease_address.address} (${target.lease_identifier})` : '';
  }
  else {
    return '';
  }
};

export const getApplicationAttachmentDownloadLink = (id: number): string => createUrl(`attachment/${id}/download`);

export const getApplicantInfoCheckItems = (state: RootState, identifier: string): Array<Object> => {
  const definitions = [
    {
      type: ApplicantInfoCheckTypes.TRADE_REGISTER,
      label: 'Kaupparekisteriote',
      useIfCompany: true,
      useIfPerson: false,
      external: PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
    },
    {
      type: ApplicantInfoCheckTypes.CREDITWORTHINESS,
      label: 'Luottokelpoisuustodistus / luottotiedot',
      useIfCompany: true,
      useIfPerson: true,
      external: PlotApplicationApplicantInfoCheckExternalTypes.CREDIT_INQUIRY,
    },
    {
      type: ApplicantInfoCheckTypes.PENSION_CONTRIBUTIONS,
      label: 'Selvitys työeläkemaksujen maksamisesta',
      useIfCompany: true,
      useIfPerson: true,
      external: null,
    },
    {
      type: ApplicantInfoCheckTypes.VAT_REGISTER,
      label: 'Todistus arvonlisärekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
    },
    {
      type: ApplicantInfoCheckTypes.ADVANCE_PAYMENT,
      label: 'Todistus ennakkoperintärekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
    },
    {
      type: ApplicantInfoCheckTypes.TAX_DEBT,
      label: 'Verovelkatodistus',
      useIfCompany: true,
      useIfPerson: false,
      external: PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
    },
    {
      type: ApplicantInfoCheckTypes.EMPLOYER_REGISTER,
      label: 'Todistus työnantajarekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: PlotApplicationApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
    },
  ];

  const existingData = getApplicationApplicantInfoCheckData(state).filter((item) => item.entry === identifier);

  return definitions.map((item) => {
    const existingItem = existingData.find((existingItem) => existingItem.name === item.type);

    if (!existingItem) {
      return null;
    }

    return {
      kind: {...item},
      data: {...existingItem},
    };
  }).filter((item) => !!item);
};

export const prepareApplicantInfoCheckForSubmission = (infoCheck: Object): Object => {
  return {
    id: infoCheck.id,
    preparer: infoCheck.preparer?.id,
    comment: infoCheck.comment,
    state: infoCheck.state,
    mark_all: infoCheck.mark_all,
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

export const getSectionApplicantType = (state: RootState, section: FormSection, reduxFormPath: string): string => {
  if (section.identifier !== APPLICANT_SECTION_IDENTIFIER) {
    return ApplicantTypes.NOT_APPLICABLE;
  }

  return formValueSelector(FormNames.PLOT_APPLICATION)(state, `${reduxFormPath}.metadata.applicantType`) || ApplicantTypes.UNSELECTED;
};

export const getFieldFileIds = (state: RootState, fieldPath: string): Array<number> => {
  const fieldValue = formValueSelector(FormNames.PLOT_APPLICATION)(state, fieldPath);
  return fieldValue?.value || [];
};

export const getInitialTargetInfoCheckValues = (state: RootState, id: number): Object | null => {
  const target = getApplicationRelatedPlotSearch(state)?.plot_search_targets.find((target) => target.id === id);
  if (!target) {
    return null;
  }

  const infoCheck = getApplicationTargetInfoCheckData(state).find((infoCheck) => infoCheck.identifier === target.plan_unit.identifier);

  if (!infoCheck) {
    return null;
  }

  return [
    'id',
    'reserved',
    'counsel_date',
    'share_of_rental_denominator',
    'share_of_rental_indicator',
    'added_target_to_applicant',
    'decline_reason',
    'proposed_managements',
    'reservation_conditions',
    'arguments',
    'meeting_memos',
  ].reduce((acc, key) => {
    acc[key] = infoCheck[key];
    return acc;
  }, {});
};

export const getMeetingMemoDownloadLink = (id: number): string => createUrl(`meeting_memo/${id}/download`);
