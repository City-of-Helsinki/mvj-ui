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

export const PlotApplicationApplicantInfoCheckFieldPaths = {
  PREPARER: 'preparer',
  STATE: 'state',
  MARK_ALL: 'mark_all',
  COMMENT: 'comment',
};

export const PlotApplicationApplicantInfoCheckFieldTitles = {
  PREPARER: 'Tarkastaja',
  STATE: 'Tila',
  MARK_ALL: 'Merkitse kaikkiin hakijan hakemuksiin',
  COMMENT: 'Kommentti',
};

export const PlotApplicationApplicantInfoCheckExternalTypes = {
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

export const PlotApplicationTargetInfoCheckFieldPaths = {
  RESERVED: 'target_statuses.child.children.reserved',
  NEGOTIATION_DATE: 'target_statuses.child.children.counsel_date',
  SHARE_OF_RENT_INDICATOR: 'target_statuses.child.children.share_of_rental_indicator',
  SHARE_OF_RENT_DENOMINATOR: 'target_statuses.child.children.share_of_rental_denominator',
  ADDED_TARGET_TO_APPLICANT: 'target_statuses.child.children.added_target_to_applicant',
  DECLINE_REASON: 'target_statuses.child.children.decline_reason',
  PROPOSED_MANAGEMENTS: 'target_statuses.child.children.proposed_managements',
  RESERVATION_CONDITIONS: 'target_statuses.child.children.reservation_conditions.child',
  ARGUMENTS: 'target_statuses.child.children.arguments',
  MEETING_MEMOS: 'target_statuses.child.children.meeting_memos.child.children',

  PROPOSED_MANAGEMENT_TYPE: 'target_statuses.child.children.proposed_managements.child.children.proposed_management',
  PROPOSED_MANAGEMENT_FINANCING: 'target_statuses.child.children.proposed_managements.child.children.proposed_financing',
  PROPOSED_MANAGEMENT_HITAS: 'target_statuses.child.children.proposed_managements.child.children.hitas',
};

export const PlotApplicationTargetInfoCheckFieldTitles = {
  RESERVED: 'Esitetään varattavaksi',
  NEGOTIATION_DATE: 'Neuvottelupäivämäärä',
  SHARE_OF_RENT: 'Varauksen osuus',
  SHARE_OF_RENT_INDICATOR: 'Varauksen osuuden osoittaja',
  SHARE_OF_RENT_DENOMINATOR: 'Varauksen osuuden nimittäjä',
  ADDED_TARGET_TO_APPLICANT: 'Hakijalle lisätty kohde',
  DECLINE_REASON: 'Hylkäämisen syy',
  PROPOSED_MANAGEMENTS: 'Ehdotetut hallinta- ja rahoitusmuodot',
  RESERVATION_CONDITIONS: 'Erityiset vuokrausehdot',
  ARGUMENTS: 'Perustelut',
  MEETING_MEMOS: 'Kokous-/neuvottelumuistio',

  PROPOSED_MANAGEMENT_TYPE: 'Ehdotettu hallintamuoto',
  PROPOSED_MANAGEMENT_FINANCING: 'Ehdotettu rahoitusmuoto',
  PROPOSED_MANAGEMENT_HITAS: 'HITAS',

  RESERVATION_CONDITION_SINGULAR: 'Erityinen vuokrausehto',

  MEETING_MEMO_NAME: 'Nimi',
  MEETING_MEMO_UPLOAD_DATE: 'Tallennuspäivämäärä',
  MEETING_MEMO_UPLOADED_BY: 'Lähettäjä',
};
