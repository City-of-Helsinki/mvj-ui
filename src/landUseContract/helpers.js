// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {isDirty} from 'redux-form';

import {FormNames, LitigantContactType} from './enums';
import {getContentUser} from '$src/leases/helpers';
import {fixedLengthNumber, sortStringByKeyDesc} from '$util/helpers';
import {getIsEditMode} from '$src/landUseContract/selectors';
import {removeSessionStorageItem} from '$util/storage';

import {getContactFullName, getContentContact} from '$src/contacts/helpers';

import type {LandUseContract} from './types';

export const getContentLandUseContractIdentifier = (item: Object) => {
  if(isEmpty(item)) {return null;}
  return `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
};

export const getContentListItemLitigant = (litigant: Object) =>
  litigant ? getContactFullName(litigant.contact) : null;

export const getContentListItemLitigants = (contract: Object) =>
  get(contract, 'litigants', [])
    .map((litigant) => get(litigant, 'litigantcontact_set', []).find((x) => x.type === LitigantContactType.LITIGANT))
    .filter((litigant) => !isLitigantArchived(litigant))
    .map((litigant) => getContentListItemLitigant(litigant));

export const getContentLandUseContractListItem = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    litigants: getContentListItemLitigants(contract),
    plan_number: contract.plan_number,
    area: get(contract, 'areas[0].area'),
    project_area: contract.project_area,
    state: contract.state,
  };
};

export const getContentLandUseContractList = (content: Object) =>
  get(content, 'results', []).map((contract) => getContentLandUseContractListItem(contract));

const getContentAreas = (contract: LandUseContract) =>
  get(contract, 'areas', []).map((area) => {
    return {
      area: get(area, 'area'),
    };
  });

export const getContentLitigantItem = (litigant: Object) => {
  const contact = get(litigant, 'litigantcontact_set', []).find(x => x.type === LitigantContactType.LITIGANT);

  return contact ? {
    id: contact.id,
    type: contact.type,
    contact: getContentContact(contact.contact),
    start_date: contact.start_date,
    end_date: contact.end_date,
  } : {};
};

export const getContentLitigantContactSet = (litigant: Object) =>
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

export const getContentLitigant = (litigant: Object) => {
  return litigant ? {
    id: litigant.id,
    share_numerator: litigant.share_numerator,
    share_denominator: litigant.share_denominator,
    reference: litigant.reference,
    litigant: getContentLitigantItem(litigant),
    litigantcontact_set: getContentLitigantContactSet(litigant),

  } : {};
};

export const getContentLitigants = (contract: LandUseContract) =>
  get(contract, 'litigants', []).map((litigant) => getContentLitigant(litigant));

export const getContentBasicInformation = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    areas: getContentAreas(contract),
    preparer: getContentUser(contract.preparer),
    preparer2: getContentUser(contract.preparer2),
    land_use_contract_type: contract.land_use_contract_type,
    estimated_completion_year: contract.estimated_completion_year,
    estimated_introduction_year: contract.estimated_introduction_year,
    project_area: contract.project_area,
    plan_reference_number: contract.plan_reference_number,
    plan_number: contract.plan_number,
    plan_acceptor: contract.plan_acceptor,
    plan_lawfulness_date: contract.plan_lawfulness_date,
    state: contract.state,
  };
};

const getContentDecisionConditions = (decision: Object) =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      type: condition.type,
      supervision_date: condition.supervision_date,
      supervised_date: condition.supervised_date,
      description: condition.description,
    };
  });

const getContentDecisionItem = (decision: Object) => {
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

export const getContentDecisions = (contract: LandUseContract) =>
  get(contract, 'decisions', []).map((decision) => getContentDecisionItem(decision));

const getContentContractItem = (contract: Object) => {
  return {
    id: contract.id,
    state: contract.state,
    decision_date: contract.decision_date,
    sign_date: contract.sign_date,
    ed_contract_number: contract.ed_contract_number,
    reference_number: contract.reference_number,
    area_arrengements: contract.area_arrengements,
  };
};

export const getContentContracts = (contract: LandUseContract) =>
  get(contract, 'contracts', []).map((contract) => getContentContractItem(contract));

export const getContentCompensationInvoices = (compensation: Object) =>
  get(compensation, 'invoices', []).map((invoice) => {
    return {
      amount: invoice.amount,
      due_date: invoice.due_date,
    };
  });

export const getContentCompensations = (contract: LandUseContract) => {
  const compensations = get(contract, 'compensations', {});

  return {
    cash_compensation: compensations.cash_compensation,
    land_compensation: compensations.land_compensation,
    other_compensation: compensations.other_compensation,
    first_installment_increase: compensations.first_installment_increase,
    free_delivery_area: compensations.free_delivery_area,
    free_delivery_amount: compensations.free_delivery_area,
    additional_floor_area_apartment: compensations.additional_floor_area_apartment,
    additional_floor_area_company: compensations.additional_floor_area_company,
    invoices: getContentCompensationInvoices(compensations),
  };
};

const getContentInvoiceItem = (invoice: Object) => {
  return {
    amount: invoice.amount,
    due_date: invoice.due_date,
    sent_date: invoice.sent_date,
    paid_date: invoice.paid_date,
  };
};

export const getContentInvoices = (contract: LandUseContract) =>
  get(contract, 'invoices', []).map((invoice) => getContentInvoiceItem(invoice));


//Format form data for DB
const getLitigantContactSetForDb = (litigantData: Object) => {
  let contacts = [];
  const litigant = litigantData.litigant;

  contacts.push({
    id: litigant.id,
    type: LitigantContactType.LITIGANT,
    contact: litigant.contact,
    start_date: litigant.start_date,
    end_date: litigant.end_date,
  });

  const billingPersons = get(litigantData, 'litigantcontact_set', []);
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

// Functions to add form data to payload
export const addLitigantsDataToPayload = (payload: Object, formData: Object) => {
  const litigants = [...formData.activeLitigants, ...formData.archivedLitigants];
  payload.litigants = litigants.map((litigant) => {
    return {
      id: litigant.id,
      share_numerator: litigant.share_numerator,
      share_denominator: litigant.share_denominator,
      reference: litigant.reference,
      litigantcontact_set: getLitigantContactSetForDb(litigant),
    };
  });

  return payload;
};

export const isLitigantActive = (litigant: ?Object) => {
  const now = moment();
  const startDate = get(litigant, 'start_date');
  const endDate = get(litigant, 'end_date');

  if(startDate && moment(startDate).isAfter(now, 'day') || endDate && now.isAfter(endDate, 'day')) {
    return false;
  }

  return true;
};

export const isLitigantArchived = (litigant: ?Object) => {
  const now = moment();
  const endDate = get(litigant, 'end_date');

  if(endDate && now.isAfter(endDate, 'day')) {
    return true;
  }

  return false;
};

export const isAnyLandUseContractFormDirty = (state: any) => {
  const isEditMode = getIsEditMode(state);

  return isEditMode && (
    isDirty(FormNames.BASIC_INFORMATION)(state) ||
    isDirty(FormNames.COMPENSATIONS)(state) ||
    isDirty(FormNames.CONTRACTS)(state) ||
    isDirty(FormNames.DECISIONS)(state) ||
    isDirty(FormNames.INVOICES)(state));
};

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.COMPENSATIONS);
  removeSessionStorageItem(FormNames.CONTRACTS);
  removeSessionStorageItem(FormNames.DECISIONS);
  removeSessionStorageItem(FormNames.INVOICES);
  removeSessionStorageItem('landUseContractId');
  removeSessionStorageItem('landUseContractValidity');
};
