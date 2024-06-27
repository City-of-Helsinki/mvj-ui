import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { isDirty } from "redux-form";
import { FormNames } from "enums";
import { LitigantContactType } from "./enums";
import { getContentUser } from "/src/users/helpers";
import { fixedLengthNumber, getApiResponseResults, isArchived, sortStringByKeyDesc, addEmptyOption, formatDate, convertStrToDecimalNumber } from "/src/util/helpers";
import { getIsEditMode } from "/src/landUseContract/selectors";
import { removeSessionStorageItem } from "/src/util/storage";
import { getContactFullName, getContentContact } from "/src/contacts/helpers";
import type { LandUseContract } from "./types";
import type { RootState } from "/src/root/types";

/** 
 * Get land use contract identifier
 * @param {Object} item
 * @return {string}
 */
export const getContentLandUseContractIdentifier = (item: Record<string, any>): string | null | undefined => {
  if (isEmpty(item)) {
    return null;
  }

  return `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
};

/** 
 * Get land use contract list litigant name
 * @param {Object} litigant
 * @return {string}
 */
export const getListLitigantName = (litigant: Record<string, any>): string | null | undefined => litigant ? getContactFullName(litigant.contact) : null;

/** 
 * Get land use contract list litigants
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentListLitigants = (contract: Record<string, any>): Array<Record<string, any>> => get(contract, 'litigants', []).map(litigant => get(litigant, 'landuseagreementlitigantcontact_set', []).find(x => x.type === LitigantContactType.TENANT)).filter(litigant => !isArchived(litigant)).map(litigant => getListLitigantName(litigant));

/** 
 * Get land use contract list estate ids
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentListEstateIds = (contract: Record<string, any>): Array<Record<string, any>> => get(contract, 'estate_ids', []).map(estate_id => estate_id.estate_id);

/** 
 * Get land use contract list item
 * @param {Object} contract
 * @return {Object}
 */
export const getContentLandUseContractListItem = (contract: LandUseContract): Record<string, any> => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    litigants: getContentListLitigants(contract),
    plan_number: contract.plan_number,
    estate_ids: getContentListEstateIds(contract),
    project_area: contract.project_area,
    state: contract.state
  };
};

/** 
 * Get land use contract list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentLandUseContractListResults = (content: any): Array<Record<string, any>> => getApiResponseResults(content).map(contract => getContentLandUseContractListItem(contract));

/** 
 * Get land use contract estate ids
 * @param {Object} contract
 * @return {Object[]}
 */
const getContentEstateIds = (contract: LandUseContract): Array<Record<string, any>> => get(contract, 'estate_ids', []).map(estate_id => {
  return {
    estate_id: estate_id.estate_id
  };
});

/** 
 * Get land use contract litigant details
 * @param {Object} litigant
 * @return {Object}
 */
export const getContentLitigantDetails = (litigant: Record<string, any>): Record<string, any> => {
  const contact = get(litigant, 'landuseagreementlitigantcontact_set', []).find(x => x.type === LitigantContactType.TENANT);
  return contact ? {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date
  } : {};
};

/** 
 * Get land use contract litigant contact set
 * @param {Object} litigant
 * @return {Object[]}
 */
export const getContentLitigantContactSet = (litigant: Record<string, any>): Array<Record<string, any>> => get(litigant, 'landuseagreementlitigantcontact_set', []).filter(x => x.type !== LitigantContactType.TENANT).map(contact => {
  return {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date
  };
}).sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

/** 
 * Get land use contract litigant
 * @param {Object} litigant
 * @return {Object}
 */
export const getContentLitigant = (litigant: Record<string, any>): Record<string, any> => {
  return litigant ? {
    id: litigant.id,
    share_numerator: litigant.share_numerator,
    share_denominator: litigant.share_denominator,
    reference: litigant.reference,
    litigant: getContentLitigantDetails(litigant),
    landuseagreementlitigantcontact_set: getContentLitigantContactSet(litigant)
  } : {};
};

/** 
 * Get land use contract litigants
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentLitigants = (contract: LandUseContract): Array<Record<string, any>> => get(contract, 'litigants', []).map(litigant => getContentLitigant(litigant));

/** 
 * Get land use contract basic information content
 * @param {Object} contract
 * @return {Object}
 */
export const getContentBasicInformation = (contract: LandUseContract): Record<string, any> => {
  return {
    id: contract.id,
    type: contract.type,
    identifier: getContentLandUseContractIdentifier(contract),
    estate_ids: getContentEstateIds(contract),
    preparer: getContentUser(contract.preparer),
    preparer2: getContentUser(contract.preparer2),
    estimated_completion_year: contract.estimated_completion_year,
    estimated_introduction_year: contract.estimated_introduction_year,
    project_area: contract.project_area,
    plan_reference_number: contract.plan_reference_number,
    plan_number: contract.plan_number,
    plan_acceptor: contract.plan_acceptor,
    plan_lawfulness_date: contract.plan_lawfulness_date,
    state: contract.state,
    definition: contract.definition,
    status: contract.status,
    addresses: contract.addresses,
    plots: contract.plots
  };
};

/** 
 * Get land use contract decision conditions
 * @param {Object} decision
 * @return {Object[]}
 */
const getContentDecisionConditions = (decision: Record<string, any>): Array<Record<string, any>> => get(decision, 'conditions', []).map(condition => {
  return {
    type: condition.type,
    supervision_date: condition.supervision_date,
    supervised_date: condition.supervised_date,
    description: condition.description
  };
});

/** 
 * Get land use contract decision
 * @param {Object} decision
 * @return {Object}
 */
const getContentDecision = (decision: Record<string, any>) => {
  return {
    id: decision.id,
    decision_maker: decision.decision_maker,
    decision_date: decision.decision_date,
    section: decision.section,
    type: decision.type,
    description: decision.description,
    reference_number: decision.reference_number,
    conditions: getContentDecisionConditions(decision)
  };
};

/** 
 * Get land use contract decisions
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentDecisions = (contract: LandUseContract): Array<Record<string, any>> => get(contract, 'decisions', []).map(decision => getContentDecision(decision));

/** 
 * Get contract of land use contract
 * @param {Object} contract
 * @return {Object}
 */
const getContentContract = (contract: Record<string, any>): Record<string, any> => {
  return {
    type: contract.type,
    id: contract.id,
    state: contract.state,
    signing_date: contract.signing_date,
    contract_number: contract.contract_number,
    area_arrengements: contract.area_arrengements,
    decision: contract.decision,
    // warrants: getContractWarrants(contract),
    collaterals: getContractCollaterals(contract),
    contract_changes: contract.contract_changes,

    /*
    collaterals: {type: "field", required: false, read_only: false, label: "Collaterals",…}
    contract_number: {type: "string", required: false, read_only: false, label: "Sopimusnumero", max_length: 255}
    decision: {type: "field", required: false, read_only: false, label: "Decision"}
    first_call_sent: {type: "date", required: false, read_only: false, label: "1. kutsu lähetetty"}
    id: {type: "integer", required: false, read_only: false, label: "Id"}
    institution_identifier: {type: "string", required: false, read_only: false, label: "Laitostunnus", max_length: 255}
    is_readjustment_decision: {type: "boolean", required: false, read_only: true, label: "Järjestelypäätös"}
    
    */
    ktj_link: contract.ktj_link,
    second_call_sent: contract.second_call_sent,
    sign_by_date: contract.sign_by_date,
    signing_note: contract.signing_note,
    third_call_sent: contract.third_call_sent
  };
};

/**
 * Get decision options from lease data
 * @param {Object} lease
 * @return {Object[]};
 */
export const getDecisionOptions = (contract: LandUseContract): Array<Record<string, any>> => {
  const decisions = getContentDecisions(contract);
  const decisionOptions = decisions.map(item => {
    return {
      value: item.id,
      label: !item.reference_number && !item.decision_date && !item.section ? item.id : `${item.reference_number ? item.reference_number + ', ' : ''}${item.section ? item.section + ' §, ' : ''}${formatDate(item.decision_date) || ''}`
    };
  });
  return addEmptyOption(decisionOptions);
};

/**
 * Get decision by id
 * @param {Object} lease
 * @param {number} id
 * @returns {Object}
 */
export const getDecisionById = (contract: LandUseContract, id: number | null | undefined): Record<string, any> | null | undefined => getContentDecisions(contract).find(decision => decision.id === id);

/** 
 * Get land use contract collaterals
 * @param {Object} decision
 * @return {Object[]}
 */
const getContractCollaterals = (contract: Record<string, any>): Array<Record<string, any>> => get(contract, 'collaterals', []).map(contract => {
  return {
    type: contract.type,
    start_date: contract.start_date,
    end_date: contract.end_date,
    note: contract.note,
    deed_date: contract.deed_date,
    id: contract.id,
    number: contract.number,
    other_type: contract.other_type,
    paid_date: contract.paid_date,
    returned_date: contract.returned_date,
    total_amount: contract.total_amount
  };
});

/** 
 * Get contracts of land use contract
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentContracts = (contract: LandUseContract): Array<Record<string, any>> => get(contract, 'contracts', []).map(contract => getContentContract(contract));

/** 
 * Get land use contract compensation invoices
 * @param {Object} compensation
 * @return {Object[]}
 */
export const getContentCompensationInvoices = (compensation: Record<string, any>): Array<Record<string, any>> => get(compensation, 'invoices', []).map(invoice => {
  return {
    amount: invoice.amount,
    due_date: invoice.due_date
  };
});

/** 
 * Get land use contract compensations
 * @param {Object} contract
 * @return {Object}
 */
export const getContentCompensations = (contract: LandUseContract): Record<string, any> => {
  const compensations = get(contract, 'compensations', {});
  return {
    cash_compensation: get(compensations, 'cash_compensation'),
    land_compensation: get(compensations, 'land_compensation'),
    other_compensation: get(compensations, 'other_compensation'),
    first_installment_increase: get(compensations, 'first_installment_increase'),
    street_acquisition_value: get(compensations, 'street_acquisition_value'),
    street_area: get(compensations, 'street_area'),
    park_acquisition_value: get(compensations, 'park_acquisition_value'),
    park_area: get(compensations, 'park_area'),
    other_acquisition_value: get(compensations, 'other_acquisition_value'),
    other_area: get(compensations, 'other_area'),
    unit_prices_used_in_calculation: get(compensations, 'unit_prices_used_in_calculation')
  };
};

/** 
 * Get land use contract invoice
 * @param {Object} invoice
 * @return {Object[]}
 */
const getContentInvoice = (invoice: Record<string, any>): Record<string, any> => {
  return {
    amount: invoice.amount,
    due_date: invoice.due_date,
    sent_date: invoice.sent_date,
    paid_date: invoice.paid_date
  };
};

/** 
 * Get land use contract invoices
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentInvoices = (contract: LandUseContract): Array<Record<string, any>> => get(contract, 'invoices', []).map(invoice => getContentInvoice(invoice));

/** 
 * Get land use contract litigant contact set payload
 * @param {Object} litigant
 * @return {Object[]}
 */
const getPayloadLitigantContactSet = (litigant: Record<string, any>): Array<Record<string, any>> => {
  let contacts = [];
  const contact = litigant.litigant;
  contacts.push({
    id: contact.id,
    type: LitigantContactType.TENANT,
    contact: contact.contact,
    start_date: contact.start_date,
    end_date: contact.end_date
  });
  const billingPersons = get(litigant, 'landuseagreementlitigantcontact_set', []);
  billingPersons.forEach(person => {
    contacts.push({
      id: person.id,
      type: LitigantContactType.BILLING,
      contact: person.contact,
      start_date: person.start_date,
      end_date: person.end_date
    });
  });
  return contacts;
};

/** 
 * Add litigants form values to payload
 * @param {Object} payload
 * @param {Object} formValues
 * @return {Object}
 */
export const addLitigantsFormValuesToPayload = (payload: Record<string, any>, formValues: Record<string, any>): Record<string, any> => {
  const newPayload = { ...payload
  };
  const litigants = [...formValues.activeLitigants, ...formValues.archivedLitigants];
  newPayload.litigants = litigants.map(litigant => {
    return {
      id: litigant.id,
      share_numerator: litigant.share_numerator,
      share_denominator: litigant.share_denominator,
      reference: litigant.reference,
      landuseagreementlitigantcontact_set: getPayloadLitigantContactSet(litigant)
    };
  });
  return newPayload;
};

/** 
 * Get land use contract conditions
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentConditions = (contract: LandUseContract): Record<string, any> => get(contract, 'conditions', []).map(condition => getContentCondition(condition));

/** 
 * Get land use contract condition
 * @param {Object} condition
 * @return {Object}
 */
export const getContentCondition = (condition: Record<string, any>): Record<string, any> => {
  return condition ? {
    actualized_area: condition.actualized_area,
    compensation_pc: condition.compensation_pc,
    form_of_management: condition.form_of_management,
    id: condition.id,
    obligated_area: condition.obligated_area,
    subvention_amount: condition.subvention_amount,
    supervised_date: condition.supervised_date,
    supervision_date: condition.supervision_date
  } : {};
};

/**
 * Get plan accepotr name as string
 * @param {Object} plan_acceptor
 * @returns {string}
 */
export const getPlanAcceptorName = (plan_acceptor: Record<string, any>): string => {
  if (!plan_acceptor) return '';
  return plan_acceptor.name ? `${plan_acceptor.name}` : '-';
};

/**
 * Test is any lease page form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isAnyLandUseContractFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);
  return isEditMode && (isDirty(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION)(state) || isDirty(FormNames.LAND_USE_CONTRACT_COMPENSATIONS)(state) || isDirty(FormNames.LAND_USE_CONTRACT_CONTRACTS)(state) || isDirty(FormNames.LAND_USE_CONTRACT_DECISIONS)(state) || isDirty(FormNames.LAND_USE_CONTRACT_INVOICES)(state));
};

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_COMPENSATIONS);
  removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_CONTRACTS);
  removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_DECISIONS);
  removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_INVOICES);
  removeSessionStorageItem('landUseContractId');
  removeSessionStorageItem('landUseContractValidity');
};

/**
 * Get used price
 * @param {string} unitValue
 * @param {string} discount
 * @return {number}
 */
export const getUsedPrice = (unitValue: string, discount: string): number => {
  const value = Number(convertStrToDecimalNumber(unitValue));
  const dis = Number(convertStrToDecimalNumber(discount));
  return value - value * (dis / 100);
};

/**
 * Convert Compensation Values To Decimal Number
 * @param {Object} values
 * @return {Object}
 */
export const convertCompensationValuesToDecimalNumber = (values: Record<string, any>): Record<string, any> => {
  return {
    compensations: { ...values.compensations,
      cash_compensation: Number(convertStrToDecimalNumber(values.compensations.cash_compensation)),
      first_installment_increase: Number(convertStrToDecimalNumber(values.compensations.first_installment_increase)),
      land_compensation: Number(convertStrToDecimalNumber(values.compensations.land_compensation)),
      other_acquisition_value: Number(convertStrToDecimalNumber(values.compensations.other_acquisition_value)),
      other_area: Number(convertStrToDecimalNumber(values.compensations.other_area)),
      other_compensation: Number(convertStrToDecimalNumber(values.compensations.other_compensation)),
      park_acquisition_value: Number(convertStrToDecimalNumber(values.compensations.park_acquisition_value)),
      park_area: Number(convertStrToDecimalNumber(values.compensations.park_area)),
      street_acquisition_value: Number(convertStrToDecimalNumber(values.compensations.street_acquisition_value)),
      street_area: Number(convertStrToDecimalNumber(values.compensations.street_area)),
      unit_prices_used_in_calculation: convertUnitPricesUsedInCalculations(values.compensations.unit_prices_used_in_calculation)
    }
  };
};
export const convertUnitPricesUsedInCalculations = (UnitPrices: Record<string, any>): Record<string, any> => {
  if (UnitPrices) return UnitPrices.map(UnitPrice => ({ ...UnitPrice,
    area: Number(convertStrToDecimalNumber(UnitPrice.area)),
    unit_value: Number(convertStrToDecimalNumber(UnitPrice.unit_value)),
    discount: Number(convertStrToDecimalNumber(UnitPrice.discount)),
    used_price: Number(convertStrToDecimalNumber(UnitPrice.used_price))
  }));else return [];
};

/**
 * get sum
 * @param {string} area
 * @param {number} usedPrice
 * @return {boolean}
 */
export const getSum = (area: string, usedPrice: number): number => {
  const areaNumber = Number(convertStrToDecimalNumber(area));
  const price = Number(convertStrToDecimalNumber(usedPrice));
  return Number((areaNumber * price).toFixed(2));
};

/**
 * get recipient options from litigants
 * @param {Object[]} litigants
 * @return {Object[]}
 */
export const getRecipientOptionsFromLitigants = (litigants: Array<Record<string, any>>): Array<Record<string, any>> => {
  if (litigants) return litigants.map(litigant => get(litigant, 'landuseagreementlitigantcontact_set', []).find(x => x.type === LitigantContactType.TENANT)).filter(litigant => !isArchived(litigant)).map(litigant => {
    return {
      value: get(get(litigant, 'contact'), 'id'),
      label: getListLitigantName(litigant)
    };
  });else return [];
};

/**
 * Get create invoice payload for API
 * @param {Object} invoice
 * @returns {Object}
 */
export const getPayloadCreateInvoice = (invoice: Record<string, any>): Record<string, any> => {
  return {
    land_use_agreement: invoice.land_use_agreement,
    recipient: invoice.recipient,
    type: invoice.type,
    due_date: invoice.due_date,
    total_amount: convertStrToDecimalNumber(invoice.total_amount),
    notes: invoice.notes,
    rows: getPayloadInvoiceRows(invoice)
  };
};

/**
 * Get rows for invoice payload for API
 * @param {Object} invoice
 * @returns {Object[]}
 */
const getPayloadInvoiceRows = (invoice: Record<string, any>): Array<Record<string, any>> => {
  return get(invoice, 'rows', []).map(row => {
    return {
      tenant: row.tenant,
      compensation_amount: convertStrToDecimalNumber(row.compensation_amount),
      amount: convertStrToDecimalNumber(row.amount),
      increase_percentage: convertStrToDecimalNumber(row.increase_percentage),
      plan_lawfulness_date: row.plan_lawfulness_date,
      receivable_type: row.receivable_type,
      sign_date: row.sign_date,
      description: row.description
    };
  });
};