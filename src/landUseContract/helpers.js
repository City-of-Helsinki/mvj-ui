// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {isDirty} from 'redux-form';

import {FormNames} from '$src/enums';
import {LitigantContactType} from './enums';
import {getContentUser} from '$src/users/helpers';
import {
  fixedLengthNumber, 
  getApiResponseResults, 
  isArchived,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getIsEditMode} from '$src/landUseContract/selectors';
import {removeSessionStorageItem} from '$util/storage';

import {getContactFullName, getContentContact} from '$src/contacts/helpers';

import type {LandUseContract} from './types';
import type {RootState} from '$src/root/types';

/** 
 * Get land use contract identifier
 * @param {Object} item
 * @return {string}
 */
export const getContentLandUseContractIdentifier = (item: Object): ?string => {
  if(isEmpty(item)) {return null;}
  return `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
};

/** 
 * Get land use contract list litigant name
 * @param {Object} litigant
 * @return {string}
 */
export const getListLitigantName = (litigant: Object): ?string =>
  litigant ? getContactFullName(litigant.contact) : null;

/** 
 * Get land use contract list litigants
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentListLitigants = (contract: Object): Array<Object> =>
  get(contract, 'litigants', [])
    .map((litigant) => get(litigant, 'litigantcontact_set', []).find((x) => x.type === LitigantContactType.LITIGANT))
    .filter((litigant) => !isArchived(litigant))
    .map((litigant) => getListLitigantName(litigant));

/** 
 * Get land use contract list estate ids
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentListEstateIds = (contract: Object): Array<Object> =>
  get(contract, 'estate_ids', []).map((estate_id) => estate_id.estate_id);

/** 
 * Get land use contract list item
 * @param {Object} contract
 * @return {Object}
 */
export const getContentLandUseContractListItem = (contract: LandUseContract): Object => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    litigants: getContentListLitigants(contract),
    plan_number: contract.plan_number,
    estate_ids: getContentListEstateIds(contract),
    project_area: contract.project_area,
    state: contract.state,
  };
};

/** 
 * Get land use contract list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentLandUseContractListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((contract) => getContentLandUseContractListItem(contract));

/** 
 * Get land use contract estate ids
 * @param {Object} contract
 * @return {Object[]}
 */
const getContentEstateIds = (contract: LandUseContract): Array<Object> =>
  get(contract, 'estate_ids', []).map((estate_id) => {
    return {
      estate_id: estate_id.estate_id,
    };
  });

/** 
 * Get land use contract litigant details
 * @param {Object} litigant
 * @return {Object}
 */
export const getContentLitigantDetails = (litigant: Object): Object => {
  const contact = get(litigant, 'litigantcontact_set', []).find(x => x.type === LitigantContactType.LITIGANT);

  return contact ? {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date,
  } : {};
};

/** 
 * Get land use contract litigant contact set
 * @param {Object} litigant
 * @return {Object[]}
 */
export const getContentLitigantContactSet = (litigant: Object): Array<Object> =>
  get(litigant, 'litigantcontact_set', [])
    .filter((x) => x.type !== LitigantContactType.LITIGANT)
    .map((contact) => {
      return {
        id: contact.id,
        type: contact.type,
        contact: getContentContact(contact.contact),
        start_date: contact.start_date,
        end_date: contact.end_date,
      };
    })
    .sort((a, b) => sortStringByKeyDesc(a, b, 'start_date'));

/** 
 * Get land use contract litigant
 * @param {Object} litigant
 * @return {Object}
 */
export const getContentLitigant = (litigant: Object): Object => {
  return litigant ? {
    id: litigant.id,
    share_numerator: litigant.share_numerator,
    share_denominator: litigant.share_denominator,
    reference: litigant.reference,
    litigant: getContentLitigantDetails(litigant),
    litigantcontact_set: getContentLitigantContactSet(litigant),

  } : {};
};

/** 
 * Get land use contract litigants
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentLitigants = (contract: LandUseContract): Array<Object> =>
  get(contract, 'litigants', []).map((litigant) => getContentLitigant(litigant));

/** 
 * Get land use contract basic information content
 * @param {Object} contract
 * @return {Object}
 */
export const getContentBasicInformation = (contract: LandUseContract): Object => {
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
    plan_acceptor: get(contract.plan_acceptor, 'id'),
    plan_lawfulness_date: contract.plan_lawfulness_date,
    state: contract.state,
    definition: contract.definition,
    status: contract.status,
    addresses: contract.addresses,
  };
};

/** 
 * Get land use contract decision conditions
 * @param {Object} decision
 * @return {Object[]}
 */
const getContentDecisionConditions = (decision: Object): Array<Object> =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      type: condition.type,
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });

/** 
 * Get land use contract decision
 * @param {Object} decision
 * @return {Object}
 */
const getContentDecision = (decision: Object) => {
  return {
    id: decision.id,
    decision_maker: decision.decision_maker,
    decision_date: decision.decision_date,
    section: decision.section,
    type: decision.type,
    reference_number: decision.reference_number,
    conditions: getContentDecisionConditions(decision),
  };
};

/** 
 * Get land use contract decisions
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentDecisions = (contract: LandUseContract): Array<Object> =>
  get(contract, 'decisions', []);
  // get(contract, 'decisions', []).map((decision) => getContentDecision(decision));

/** 
 * Get contract of land use contract
 * @param {Object} contract
 * @return {Object}
 */
const getContentContract = (contract: Object): Object => {
  return {
    id: contract.id,
    contract_type: contract.contract_type,
    state: contract.state,
    sign_date: contract.sign_date,
    ed_contract_number: contract.ed_contract_number,
    area_arrengements: contract.area_arrengements,
    decision: contract.decision,
    warrants: getContractWarrants(contract),
  };
};

/** 
 * Get land use contract warrants
 * @param {Object} decision
 * @return {Object[]}
 */
const getContractWarrants = (contract: Object): Array<Object> =>
  get(contract, 'warrants', []).map((contract) => {
    return {
      warrant_type: contract.warrant_type,
      type: contract.type,
      rent_warrant_number: contract.rent_warrant_number,
      start_date: contract.start_date,
      end_date: contract.end_date,
      amount: contract.amount,
      return_date: contract.return_date,
      note: contract.note,
    };
  });

/** 
 * Get contracts of land use contract
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentContracts = (contract: LandUseContract): Array<Object> =>
  get(contract, 'contracts', []).map((contract) => getContentContract(contract));

/** 
 * Get land use contract compensation invoices
 * @param {Object} compensation
 * @return {Object[]}
 */
export const getContentCompensationInvoices = (compensation: Object): Array<Object> =>
  get(compensation, 'invoices', []).map((invoice) => {
    return {
      amount: invoice.amount,
      due_date: invoice.due_date,
    };
  });

/** 
 * Get land use contract compensations
 * @param {Object} contract
 * @return {Object}
 */
export const getContentCompensations = (contract: LandUseContract): Object => {
  const compensations = get(contract, 'compensations', {});

  return {
    cash_compensation: compensations.cash_compensation,
    land_compensation: compensations.land_compensation,
    other_compensation: compensations.other_compensation,
    first_installment_increase: compensations.first_installment_increase,
    street_acquisition_value: compensations.street_acquisition_value,
    street_area: compensations.street_area,
    park_acquisition_value: compensations.park_acquisition_value,
    park_area: compensations.park_area,
    other_acquisition_value: compensations.other_acquisition_value,
    other_area: compensations.other_area,
    unit_prices_used_in_calculation: compensations.unit_prices_used_in_calculation,
  };
};

/** 
 * Get land use contract invoice
 * @param {Object} invoice
 * @return {Object[]}
 */
const getContentInvoice = (invoice: Object): Object => {
  return {
    amount: invoice.amount,
    due_date: invoice.due_date,
    sent_date: invoice.sent_date,
    paid_date: invoice.paid_date,
  };
};

/** 
 * Get land use contract invoices
 * @param {Object} contract
 * @return {Object[]}
 */
export const getContentInvoices = (contract: LandUseContract): Array<Object> =>
  get(contract, 'invoices', []).map((invoice) => getContentInvoice(invoice));

/** 
 * Get land use contract litigant contact set payload
 * @param {Object} litigant
 * @return {Object[]}
 */
const getPayloadLitigantContactSet = (litigant: Object): Array<Object> => {
  let contacts = [];
  const contact = litigant.litigant;

  contacts.push({
    id: contact.id,
    type: LitigantContactType.LITIGANT,
    contact: contact.contact,
    start_date: contact.start_date,
    end_date: contact.end_date,
  });

  const billingPersons = get(litigant, 'litigantcontact_set', []);
  billingPersons.forEach((person) => {
    contacts.push({
      id: person.id,
      type: LitigantContactType.BILLING,
      contact: person.contact,
      start_date: person.start_date,
      end_date: person.end_date,
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
export const addLitigantsFormValuesToPayload = (payload: Object, formValues: Object): Object => {
  const newPayload = {...payload};
  const litigants = [...formValues.activeLitigants, ...formValues.archivedLitigants];

  newPayload.litigants = litigants.map((litigant) => {
    return {
      id: litigant.id,
      share_numerator: litigant.share_numerator,
      share_denominator: litigant.share_denominator,
      reference: litigant.reference,
      litigantcontact_set: getPayloadLitigantContactSet(litigant),
    };
  });

  return newPayload;
};

/**
 * Get plan accepotr name as string
 * @param {Object} plan_acceptor
 * @returns {string}
 */
export const getPlanAcceptorName = (plan_acceptor: Object): string=> {
  if(!plan_acceptor) return '';

  return plan_acceptor.name
    ? `${plan_acceptor.name}`
    : '-';
};

/**
 * Test is any lease page form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isAnyLandUseContractFormDirty = (state: RootState): boolean => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && (
    isDirty(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION)(state) ||
    isDirty(FormNames.LAND_USE_CONTRACT_COMPENSATIONS)(state) ||
    isDirty(FormNames.LAND_USE_CONTRACT_CONTRACTS)(state) ||
    isDirty(FormNames.LAND_USE_CONTRACT_DECISIONS)(state) ||
    isDirty(FormNames.LAND_USE_CONTRACT_INVOICES)(state));
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
