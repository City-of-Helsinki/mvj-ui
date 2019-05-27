// @flow

/**
 * Job run field paths enumerable.
 *
 * @type {{}}
 */
export const JobRunFieldPaths = {
  ID: 'id',
  EXIT_CODE: 'exit_code',
  STARTED_AT: 'started_at',
  STOPPED_AT: 'stopped_at',
  JOB_COMMENT: 'job.comment',
};

/**
 * Job run field titles enumerable.
 *
 * @type {{}}
 */
export const JobRunFieldTitles = {
  ID: '',
  EXIT_CODE: '',
  STARTED_AT: 'Aloitusaika',
  STOPPED_AT: 'Päättymisaika',
  JOB_COMMENT: 'Työ',
};

/**
 * Job run log entry field paths enumerable.
 *
 * @type {{}}
 */
export const JobRunLogEntryFieldPaths = {
  ID: 'id',
  TEXT: 'text',
  TIME: 'time',
};

/**
 * Job run log entry field titles enumerable.
 *
 * @type {{}}
 */
export const JobRunLogEntryFieldTitles = {
  ID: '',
  TEXT: 'Tulos',
  TIME: 'Aika',
};

/**
 * Scheduled job field paths enumerable.
 *
 * @type {{}}
 */
export const ScheduledJobFieldPaths = {
  ID: 'id',
  ENABLED: 'enabled',
  YEARS: 'years',
  MONTHS: 'months',
  DAYS_OF_MONTH: 'days_of_month',
  WEEKDAYS: 'weekdays',
  HOURS: 'hours',
  MINUTES: 'minutes',
  COMMENT: 'comment',
};

/**
 * Scheduled job field titles enumerable.
 *
 * @type {{}}
 */
export const ScheduledJobFieldTitles = {
  ID: '',
  ENABLED: 'Status',
  YEARS: 'Vuodet',
  MONTHS: 'Kuukaudet',
  DAYS_OF_MONTH: 'Päivät',
  WEEKDAYS: 'Viikonpäivä',
  HOURS: 'tunnit',
  MINUTES: 'Minuutit',
  COMMENT: 'Työ',
};
