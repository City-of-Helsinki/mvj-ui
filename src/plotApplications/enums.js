//@flow
export const ApplicationFieldPaths = {
  PLOTSEARCH: 'plotsearch',
};

export const ApplicantInfoCheckTypes = {
  TRADE_REGISTER: 'trade_register',
  CREDITWORTHINESS: 'creditworthiness',
  PENSION_CONTRIBUTIONS: 'pension_contributions',
  VAT_REGISTER: 'vat_register',
  ADVANCE_PAYMENT: 'advance_payment',
  TAX_DEBT: 'tax_debt',
  EMPLOYER_REGISTER: 'employer_register',
};

export const ApplicantInfoCheckStatuses = {
  CHECKED: 'checked',
  NOT_CHECKED: 'not_checked',
  NOT_NEEDED: 'not_needed',
  FURTHER_ACTION: 'further_action',
};

export const PlotApplicationInfoCheckFieldPaths = {
  PREPARER: 'preparer',
  STATE: 'state',
  MARK_ALL: 'mark_all',
  COMMENT: 'comment',
};

export const PlotApplicationInfoCheckFieldTitles = {
  PREPARER: 'Tarkastaja',
  STATE: 'Tila',
  MARK_ALL: 'Merkitse kaikkiin hakijan hakemuksiin',
  COMMENT: 'Kommentti',
};

export const PlotApplicationInfoCheckExternalTypes = {
  CREDIT_INQUIRY: 'credit_inquiry',
  TRADE_REGISTER_INQUIRY: 'trade_register_inquiry',
};

export const ApplicantTypes = {
  PERSON: 'Person',
  COMPANY: 'Company',
  BOTH: 'Both',
  UNKNOWN: null,

  // UI only states
  UNSELECTED: 'unselected',
  NOT_APPLICABLE: 'not applicable',
};
