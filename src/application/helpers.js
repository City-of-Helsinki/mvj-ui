// @flow

import {formValueSelector} from 'redux-form';

import type {FormSection, PlotSearch} from '$src/plotSearch/types';
import type {PlotApplicationFormValue, SavedApplicationFormSection} from '$src/plotApplications/types';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
} from '$src/plotApplications/constants';
import {getTargetTitle} from '$src/plotSearch/helpers';
import {FormNames} from '$src/enums';
import {ApplicantInfoCheckExternalTypes, ApplicantInfoCheckTypes, ApplicantTypes} from '$src/application/enums';
import {getContentUser} from '$src/users/helpers';
import type {RootState} from '$src/root/types';

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

export const getApplicantInfoCheckFormName = (infoCheckId: number): string =>
  `${FormNames.APPLICANT_INFO_CHECK}--${infoCheckId}`;
const APPLICATION_INFO_CHECK_DEFINITIONS = [
  {
    type: ApplicantInfoCheckTypes.TRADE_REGISTER,
    label: 'Kaupparekisteriote',
    useIfCompany: true,
    useIfPerson: false,
    external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
  },
  {
    type: ApplicantInfoCheckTypes.CREDITWORTHINESS,
    label: 'Luottokelpoisuustodistus / luottotiedot',
    useIfCompany: true,
    useIfPerson: true,
    external: ApplicantInfoCheckExternalTypes.CREDIT_INQUIRY,
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
    external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
  },
  {
    type: ApplicantInfoCheckTypes.ADVANCE_PAYMENT,
    label: 'Todistus ennakkoperintärekisteriin lisäämisestä',
    useIfCompany: true,
    useIfPerson: false,
    external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
  },
  {
    type: ApplicantInfoCheckTypes.TAX_DEBT,
    label: 'Verovelkatodistus',
    useIfCompany: true,
    useIfPerson: false,
    external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
  },
  {
    type: ApplicantInfoCheckTypes.EMPLOYER_REGISTER,
    label: 'Todistus työnantajarekisteriin lisäämisestä',
    useIfCompany: true,
    useIfPerson: false,
    external: ApplicantInfoCheckExternalTypes.TRADE_REGISTER_INQUIRY,
  },
];

export const getApplicantInfoCheckItems = (existingData: Array<Object>): Array<Object> => {
  return APPLICATION_INFO_CHECK_DEFINITIONS.map((item) => {
    const existingItem = existingData.find((existingItem) => existingItem.name === item.type);

    if (!existingItem) {
      return null;
    }

    return {
      kind: {...item},
      data: {
        ...existingItem,
        preparer: getContentUser(existingItem.preparer),
      },
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
