import { ApplicantTypes } from "src/application/enums";
export const APPLICANT_SECTION_IDENTIFIER = 'hakijan-tiedot';
export const TARGET_SECTION_IDENTIFIER = 'haettava-kohde';
export const APPLICANT_TYPE_FIELD_IDENTIFIER = 'hakija';
export const CONTROL_SHARE_FIELD_IDENTIFIER = 'hallintaosuus';
export const EMAIL_FIELD_IDENTIFIER = 'sahkoposti';
export const APPLICANT_MAIN_IDENTIFIERS: Record<string, {
  DATA_SECTION: string;
  IDENTIFIER_FIELD: string;
  NAME_FIELDS: Array<string>;
  LABEL: string;
}> = {
  [ApplicantTypes.COMPANY]: {
    DATA_SECTION: 'yrityksen-tiedot',
    IDENTIFIER_FIELD: 'y-tunnus',
    NAME_FIELDS: ['yrityksen-nimi'],
    LABEL: 'Yritys'
  },
  [ApplicantTypes.PERSON]: {
    DATA_SECTION: 'henkilon-tiedot',
    IDENTIFIER_FIELD: 'henkilotunnus',
    NAME_FIELDS: ['etunimi', 'Sukunimi'],
    LABEL: 'Henkilö'
  }
};