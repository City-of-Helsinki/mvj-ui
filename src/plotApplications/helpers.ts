import get from "lodash/get";
import _ from "lodash";
import { formValueSelector } from "redux-form";
import { getApiResponseResults, getFieldAttributes } from "@/util/helpers";
import createUrl from "@/api/createUrl";
import { store } from "@/index";
import { FormNames } from "@/enums";
import { getCurrentEditorTargets } from "@/plotApplications/selectors";
import { getTargetTitle, getTargetType, prepareApplicationForSubmission } from "@/application/helpers";
import { TargetIdentifierTypes } from "@/application/enums";
import type { Attributes, LeafletFeature, LeafletGeoJson } from "types";
import type { ApplicationFormState } from "@/plotApplications/types";
import type { PlotSearch } from "@/plotSearch/types";
import type { Form } from "@/application/types";

/**
 * Get plotApplication list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: any): Array<Record<string, any>> => getApiResponseResults(content).map(plotApplication => getContentApplicationListItem(plotApplication));

/**
 * Get plotApplication list item
 * @param {Object} plotApplication
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Record<string, any>): Record<string, any> => {
  return {
    id: plotApplication.id,
    plot_search: {
      name: plotApplication.plot_search,
      id: plotApplication.plot_search_id,
      end_date: plotApplication.plot_search_end_date
    },
    applicants: plotApplication.applicants,
    plot_search_type: plotApplication.plot_search_type,
    plot_search_subtype: plotApplication.plot_search_subtype,
    target_identifier: plotApplication.targets.map(target => ({
      // TODO: use the dedicated text form ID of the application target when it's done
      identifier: target.identifier,
      application: plotApplication.id
    })),
    target_address: plotApplication.targets.map(target => target.address?.address),
    target_reserved: plotApplication.targets.map(target => target.reserved),
    has_opening_record: !!plotApplication.opening_record
  };
};

/**
 * Get application target features for geojson data
 * @param {Object[]} applications
 * @returns {Object[]}
 */
export const getApplicationTargetFeatures = (applications: Array<Record<string, any>>): Array<LeafletFeature> => {
  const features = [];
  applications.forEach(application => {
    const targets = get(application, 'targets', []);
    targets.forEach(target => {
      const coords = get(target, 'geometry.coordinates', []);

      if (!coords.length) {
        return;
      }

      features.push({
        type: 'Feature',
        geometry: { ...target.geometry
        },
        properties: {
          id: application.id,
          feature_type: 'plotApplication',
          target: target,
          state: get(application, 'state.id') || application.state
        }
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
export const getApplicationTargetGeoJson = (applications: Array<Record<string, any>>): LeafletGeoJson => {
  const features = getApplicationTargetFeatures(applications);
  return {
    type: 'FeatureCollection',
    features: features
  };
};
export const reshapeSavedApplicationObject = (application: Record<string, any>, form: Form, formAttributes: Attributes, attachments: Array<Record<string, any>>): Record<string, any> => {
  const getEmptySection = (): Record<string, any> => ({
    sections: {},
    fields: {}
  });

  const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');
  const result = getEmptySection();

  const reshapeSingleSectionData = (section, answersNode, sectionPath) => {
    const data = getEmptySection();

    if (answersNode.metadata) {
      data.metadata = { ...answersNode.metadata
      };
    }

    section.subsections.forEach(subsection => {
      reshapeArrayOrSingleSection(subsection, data, answersNode, `${sectionPath}.${subsection.identifier}`);
    });
    section.fields.forEach(field => {
      let {
        value,
        extra_value
      } = answersNode.fields[field.identifier] || {};

      switch (fieldTypes?.find(fieldType => fieldType.value === field.type)?.display_name) {
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
          value = attachments.filter(attachment => attachment.field === field.identifier && attachment.path === sectionPath);
          extra_value = '';
          break;
      }

      data.fields[field.identifier] = {
        value,
        extra_value
      };
    });
    return data;
  };

  const reshapeArrayOrSingleSection = (section, parentResultNode, answersNode, sectionPath) => {
    if (section.add_new_allowed) {
      parentResultNode.sections[section.identifier] = [];

      const sectionAnswers = _.transform(answersNode, (acc, item, key: string) => {
        const match = new RegExp(`^${_.escapeRegExp(section.identifier)}\\[(\\d+)]$`).exec(key);

        if (!match) {
          return acc;
        }

        acc[Number(match[1])] = item;
        return acc;
      }, []).filter(item => item !== undefined);

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

  form.sections.forEach(section => reshapeArrayOrSingleSection(section, result, application, `${section.identifier}`));
  return result;
};
export const getInitialApplication = (): ApplicationFormState => {
  return {
    formId: null,
    targets: [],
    formEntries: null
  };
};
export const preparePlotApplicationForSubmission = (): Record<string, any> | null => {
  const state = store.getState();
  const selector = formValueSelector(FormNames.PLOT_APPLICATION);
  const sections = selector(state, 'formEntries.sections');
  return {
    form: selector(state, 'formId'),
    entries: {
      sections: prepareApplicationForSubmission(sections)
    },
    targets: selector(state, 'targets'),
    attachments: selector(state, 'formEntries.attachments')
  };
};
export const getSectionTargetFromMeta = (field: string): string => {
  const state = store.getState();
  const meta = formValueSelector(FormNames.PLOT_APPLICATION)(state, `${field}.metadata`);

  if (meta) {
    const target = getCurrentEditorTargets(state).find(target => target.id === meta.identifier);
    return target ? getTargetTitle(target) : '';
  } else {
    return '';
  }
};
export const getInitialTargetInfoCheckValues = (plotSearch: PlotSearch, infoCheckData: Record<string, any>, id: number): Record<string, any> | null => {
  const target = plotSearch?.plot_search_targets.find(target => target.id === id);

  if (!target) {
    return null;
  }

  const targetType = getTargetType(target);
  let targetIdentifier;

  if (targetType === TargetIdentifierTypes.PLAN_UNIT) {
    targetIdentifier = target.plan_unit.identifier;
  } else if (targetType === TargetIdentifierTypes.CUSTOM_DETAILED_PLAN) {
    targetIdentifier = target.custom_detailed_plan.identifier;
  } else {
    return null;
  }

  const infoCheck = infoCheckData.find(infoCheck => infoCheck.identifier === targetIdentifier);

  if (!infoCheck) {
    return null;
  }

  return ['id', 'reserved', 'counsel_date', 'share_of_rental_denominator', 'share_of_rental_indicator', 'added_target_to_applicant', 'decline_reason', 'proposed_managements', 'reservation_conditions', 'arguments', 'meeting_memos'].reduce((acc, key) => {
    acc[key] = infoCheck[key];
    return acc;
  }, {});
};
export const getMeetingMemoDownloadLink = (id: number): string => createUrl(`meeting_memo/${id}/download`);
export const getTargetInfoCheckFormName = (targetId: number): string => `${FormNames.PLOT_APPLICATION_TARGET_INFO_CHECK}--${targetId}`;