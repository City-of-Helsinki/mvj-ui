/**
 * PlotSearch field paths enumerable.
 *
 * @type {{}}
 */
export const PlotSearchFieldPaths = {
  BASIC_INFO: 'basic_info',
  name: 'name',
  PREPARER: 'preparer',
  APPLICATIONS: 'applications',
  TYPE: 'type',
  SUBTYPE: 'subtype',
  START_DATE: 'start_date',
  BEGIN_AT: 'begin_at',
  CLOCK: 'clock',
  END_DATE: 'end_date',
  END_AT: 'end_at',
  APPLICATIONS_UPDATED_DATE: 'Applications_updated_date',
  DECISION: 'decision',
  DECISION_TO_LIST: 'decision_to_list',
  STAGE: 'stage',
};

/**
 * PlotSearch field titles enumerable.
 *
 * @type {{}}
 */
export const PlotSearchFieldTitles = {
  BASIC_INFO: 'Perustiedot',
  NAME: 'Haun nimi',
  PREPARER: 'Valmistelija',
  APPLICATIONS: 'Hakemukset',
  TYPE: 'Haun tyyppi',
  SUBTYPE: 'Haun alatyyppi',
  START_DATE: 'Alkupvm',
  CLOCK: 'Klo',
  END_DATE: 'Loppupvm',
  APPLICATIONS_UPDATED_DATE: 'Hakemukset päivitetty',
  DECISION: 'Päätös',
  DECISION_TO_LIST: 'Päätös hakutuloslistaan',
  STAGE: 'Haun vaihe',
  INFO_LINK_DESCRIPTION: 'Lisätietolinkin kuvaus',
  INFO_LINK_URL: 'Lisätietolinkki',
  INFO_LINK_LANGUAGE: 'Kieli'
};

/**
 * PlotSearch application field paths enumerable.
 *
 * @type {{}}
 */
export const ApplicationFieldPaths = {
  APPLICATION: 'application',
  APPLICATION_BASE: 'application_base',
  APPLICATION_DEFAULT: 'application_default',
  APPLICATION_EXTRA: 'application_extra',
  APPLICATION_PREVIOUS: 'application_previous',
  APPLICATION_CREATED: 'application_created',
};

/**
 * PlotSearch field titles enumerable.
 *
 * @type {{}}
 */
export const ApplicationFieldTitles = {
  APPLICATION: 'HAKEMUSLOMAKE',
  APPLICATION_BASE: 'Lomakepohja',
  APPLICATION_DEFAULT: 'Hakutyypin oletuslomake',
  APPLICATION_EXTRA: 'Lomakkeen lisäosat',
  APPLICATION_PREVIOUS: 'Aiemmin luotu lomake',
  APPLICATION_CREATED: 'Luodut hakulomakkeet',
  APPLICATION_TITLE: 'Lomakkeen otsikko',
};
