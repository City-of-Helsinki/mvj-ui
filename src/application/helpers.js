// @flow

import type {FormSection, PlotSearch} from '$src/plotSearch/types';
import type {SavedApplicationFormSection} from '$src/plotApplications/types';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
} from '$src/plotApplications/constants';
import {getTargetTitle} from '$src/plotSearch/helpers';

export const transformTargetSectionTitle = (plotSearch: PlotSearch): Function => (title: string, section: FormSection, answer: SavedApplicationFormSection): string => {
  if (section.identifier === TARGET_SECTION_IDENTIFIER && answer?.metadata?.identifier) {
    const target = plotSearch?.plot_search_targets.find((target) => target.id === answer.metadata?.identifier);
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
        const nameText = identifiers?.NAME_FIELDS?.map((field) => {
          return sectionWithIdentifier.fields[field]?.value || '';
        }).join(' ') || '-';

        return `${title} (${nameText}, ${typeText})`;
      }
    }
  }

  return title;
};

