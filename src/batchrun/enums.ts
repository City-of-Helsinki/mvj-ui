/**
 * Job run field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunFieldPaths = {
  ID: 'id',
  EXIT_CODE: 'exit_code',
  STARTED_AT: 'started_at',
  STOPPED_AT: 'stopped_at'
};

/**
 * Job run field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunFieldTitles = {
  ID: '',
  EXIT_CODE: '',
  STARTED_AT: 'Aloitusaika',
  STOPPED_AT: 'Päättymisaika'
};

/**
 * Job run jobs field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunJobFieldPaths = {
  COMMENT: 'job.children.comment',
  NAME: 'job.children.name'
};

/**
 * Job run jobs field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunJobFieldTitles = {
  COMMENT: 'Työn kommentti',
  NAME: 'Työ'
};

/**
 * Job run log entry field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunLogEntryFieldPaths = {
  TEXT: 'text',
  TIME: 'time'
};

/**
 * Job run log entry field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const JobRunLogEntryFieldTitles = {
  TEXT: 'Tulos',
  TIME: 'Aika'
};

/**
 * Scheduled job field paths enumerable.
 * @readonly
 * @enum {string}
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
  COMMENT: 'comment'
};

/**
 * Scheduled job field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const ScheduledJobFieldTitles = {
  ID: '',
  ENABLED: 'Käytössä',
  YEARS: 'Vuodet',
  MONTHS: 'Kuukaudet',
  DAYS_OF_MONTH: 'Päivät',
  WEEKDAYS: 'Viikonpäivä',
  HOURS: 'tunnit',
  MINUTES: 'Minuutit',
  COMMENT: 'Kommentti'
};

/**
 * Scheduled job job field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const ScheduledJobJobFieldPaths = {
  COMMENT: 'job.children.comment',
  NAME: 'job.children.comment'
};

/**
 * Scheduled job job field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const ScheduledJobJobFieldTitles = {
  COMMENT: 'Työn kommentti',
  NAME: 'Työ'
};