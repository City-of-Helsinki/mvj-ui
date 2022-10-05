// @flow

import get from 'lodash/get';
import _ from 'lodash';
import {getFieldAttributes, displayUIMessage, getApiResponseResults} from "../util/helpers";
import {formValueSelector} from "redux-form";

import createUrl from "../api/createUrl";
import {store} from '../root/startApp';
import {FormNames} from "../enums";
import {
  getApplicationInfoCheckData,
  getCurrentEditorTargets,
  getPendingUploads,
} from "./selectors";
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER
} from "./constants";
import type {LeafletFeature, LeafletGeoJson} from '$src/types';
import {ApplicantInfoCheckTypes, ApplicantTypes} from "./enums";
import type {RootState} from "../root/types";
import type {PlotApplicationFormValue, ApplicationFormSection, ApplicationFormState} from "./types";
import type {Form, FormSection} from "../plotSearch/types";
import type {Attributes} from "../types";

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
          ...target.geometry
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
    fields: {}
  });

  const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

  const result = getEmptySection();

  const reshapeSingleSectionData = (section, answersNode) => {
    const data = getEmptySection();

    if (answersNode.metadata) {
      data.metadata = { ...answersNode.metadata };
    }

    section.subsections.forEach((subsection) => {
      reshapeArrayOrSingleSection(subsection, data, answersNode);
    });

    section.fields.forEach((field) => {
      let { value, extra_value } = answersNode.fields[field.identifier] || {};

      switch (fieldTypes?.find((fieldType) => fieldType.value === field.type)?.display_name) {
        case 'radiobutton':
        case 'radiobuttoninline':
          value = value !== null && value !== undefined ? value : null;
          break;
        case 'checkbox':
        case 'dropdown':
          if (!field.choices) {
            value = value !== null && value !== undefined ? value : null;
          }
          break;
        case 'uploadfiles':
          extra_value = '';
          value = attachments.filter((attachment) => attachment.field === field.identifier);
          break;
      }

      data.fields[field.identifier] = {
        value,
        extra_value
      };
    })

    return data;
  }

  const reshapeArrayOrSingleSection = (section, parentResultNode, answersNode) => {
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

      sectionAnswers.forEach((answer) => {
        parentResultNode.sections[section.identifier].push(reshapeSingleSectionData(section, answer))
      });


    } else {
      const sectionAnswers = answersNode[section.identifier];

      if (sectionAnswers) {
        parentResultNode.sections[section.identifier] = reshapeSingleSectionData(section, sectionAnswers);
      }
    }
  };

  form.sections.forEach((section) => reshapeArrayOrSingleSection(section, result, application));
  return result;
};

export const getAttachmentLink = (id: number): string => createUrl(`attachment/${id}/download/`);

export const getInitialApplication = (): ApplicationFormState => {
  return {
    //plotSearch: null,
    formId: null,
    targets: [],
    formEntries: null
  }
};

export const getInitialApplicationForm = (
  fieldTypes: { [id: number]: string },
  form?: Form
): Object | null => {
  if (!form) {
    return null;
  }

  const root = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: []
  };

  const buildSection = (
    section,
    parent = root.sections
  ): void => {
    if (!section.visible) {
      return;
    }

    const workingItem: ApplicationFormSection = {
      sections: {},
      fields: {},
      sectionRestrictions: {}
    };

    if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
      workingItem.metadata = {
        applicantType: null
      };

      section.subsections.forEach((subsection) => {
        workingItem.sectionRestrictions[subsection.identifier] = subsection.applicant_type;
      })
    }

    section.subsections.forEach((subsection) =>
      buildSection(subsection, workingItem.sections)
    );
    section.fields.forEach((field) => buildField(field, workingItem.fields));

    if (section.add_new_allowed) {
      root.sectionTemplates[section.identifier] = { ...workingItem };

      if (section.identifier === TARGET_SECTION_IDENTIFIER) {
        parent[section.identifier] = [];
      } else {
        parent[section.identifier] = [workingItem];
      }
    } else {
      parent[section.identifier] = workingItem;
    }
  };

  const buildField = (field, parent): void => {
    if (!field.enabled) {
      return;
    }

    let initialValue;
    switch (fieldTypes[field.type]) {
      case 'uploadfiles':
        // handled outside redux-form
        root.fileFieldIds.push(field.id);
        break;
      case 'dropdown':
      case 'radiobutton':
      case 'radiobuttoninline':
        initialValue = {
          value: '', //null,
          extraValue: '',
        };
        break;
      case 'checkbox':
        if (field.choices?.length > 1) {
          initialValue = {
            value: [],
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
        initialValue = {
          value: '',
          extraValue: '',
        };
        break;
    }

    if (initialValue) {
      parent[field.identifier] = initialValue;
    }
  };

  form.sections.forEach((section) => buildSection(section));

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
  const fileFieldIds = selector(
    state,
    'formEntries.fileFieldIds'
  );

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
                displayUIMessage({title: '', body: 'Hakijan henkilö- tai Y-tunnuksen käsittely epäonnistui!'}, { type: 'error' });
                throw e;
              }
            });
            break;
          case TARGET_SECTION_IDENTIFIER:
            section.forEach((target) => {
              target.metadata = {
                identifier: target.metadata.identifier
              };
            });
            break;
        }
      });

      return rootLevelSections;
    }

    const purgeUIFields = (node) => {
      _.each(node, (section) => {
        if (section instanceof Array) {
          section.forEach((item) => {
            delete item.sectionRestrictions;
            purgeUIFields(item.sections);
          })
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
      attachments: getPendingUploads(state)
        .filter((file) => fileFieldIds.includes(file.field))
        .map((file) => file.id)
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
}

export const getApplicationAttachmentDownloadLink = (id: number): string => createUrl(`attachment/${id}/download`);

export const getApplicantInfoCheckItems = (state: RootState, identifier: string): Array<Object> => {
  const definitions = [
    {
      type: ApplicantInfoCheckTypes.TRADE_REGISTER,
      label: 'Kaupparekisteriote',
      useIfCompany: true,
      useIfPerson: false,
      external: true
    },
    {
      type: ApplicantInfoCheckTypes.CREDITWORTHINESS,
      label: 'Luottokelpoisuustodistus / luottotiedot',
      useIfCompany: true,
      useIfPerson: true,
      external: false
    },
    {
      type: ApplicantInfoCheckTypes.PENSION_CONTRIBUTIONS,
      label: 'Selvitys työeläkemaksujen maksamisesta',
      useIfCompany: true,
      useIfPerson: true,
      external: false
    },
    {
      type: ApplicantInfoCheckTypes.VAT_REGISTER,
      label: 'Todistus arvonlisärekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: true
    },
    {
      type: ApplicantInfoCheckTypes.ADVANCE_PAYMENT,
      label: 'Todistus ennakkoperintärekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: true
    },
    {
      type: ApplicantInfoCheckTypes.TAX_DEBT,
      label: 'Verovelkatodistus',
      useIfCompany: true,
      useIfPerson: false,
      external: true
    },
    {
      type: ApplicantInfoCheckTypes.EMPLOYER_REGISTER,
      label: 'Todistus työnantajarekisteriin lisäämisestä',
      useIfCompany: true,
      useIfPerson: false,
      external: true
    }
  ];

  const existingData = getApplicationInfoCheckData(state).filter((item) => item.entry === identifier);

  return definitions.map((item) => {
    const existingItem = existingData.find((existingItem) => existingItem.name === item.type);

    if (!existingItem) {
      return null;
    }

    return {
      kind: { ...item },
      data: { ...existingItem }
    }
  }).filter((item) => !!item);
}

export const prepareInfoCheckForSubmission = (infoCheck: Object): Object => {
  return {
    id: infoCheck.id,
    preparer: infoCheck.preparer?.id,
    comment: infoCheck.comment,
    state: infoCheck.state,
    mark_all: infoCheck.mark_all
  }
};

export const valueToApplicantType = (value: PlotApplicationFormValue): string | null => {
  if (value === '1') {
    return ApplicantTypes.COMPANY;
  }
  if (value === '2') {
    return ApplicantTypes.PERSON;
  }

  return ApplicantTypes.UNKNOWN;
}

export const getSectionApplicantType = (state: RootState, section: FormSection, reduxFormPath: string): string => {
  if (section.identifier !== APPLICANT_SECTION_IDENTIFIER) {
    return ApplicantTypes.NOT_APPLICABLE;
  }

  return formValueSelector(FormNames.PLOT_APPLICATION)(state, `${reduxFormPath}.metadata.applicantType`) || ApplicantTypes.UNSELECTED;
};
