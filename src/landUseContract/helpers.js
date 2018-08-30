// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {FormNames} from './enums';
import {getContentUser} from '$src/leases/helpers';
import {fixedLengthNumber} from '$util/helpers';
import {removeSessionStorageItem} from '$util/storage';

import {getContactFullName, getContentContact} from '$src/contacts/helpers';

import type {LandUseContract} from './types';

export const getContentLandUseContractIdentifier = (item: Object) => {
  if(isEmpty(item)) {
    return null;
  }
  return `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
};

export const getContentListItemLitigant = (litigant: Object) =>
  litigant ? getContactFullName(litigant.contact) : null;

export const getContentListItemLitigants = (contract: Object) =>
  get(contract, 'litigants', []).map((litigant) => getContentListItemLitigant(litigant));

export const getContentLandUseContractListItem = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    litigants: getContentListItemLitigants(contract),
    plan_number: get(contract, 'plan_number'),
    area: get(contract, 'areas[0].area'),
    project_area: get(contract, 'project_area'),
    state: get(contract, 'state'),
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

export const getContentLitigant = (litigant: Object) => {
  return litigant ? {
    id: get(litigant, 'id'),
    contact: getContentContact(get(litigant, 'contact')),
  } : {};
};

const getContentLitigants = (contract: LandUseContract) =>
  get(contract, 'litigants', []).map((litigant) => getContentLitigant(litigant));

export const getContentBasicInformation = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    areas: getContentAreas(contract),
    litigants: getContentLitigants(contract),
    preparer: getContentUser(get(contract, 'preparer')),
    land_use_contract_type: get(contract, 'land_use_contract_type'),
    estimated_completion_year: get(contract, 'estimated_completion_year'),
    estimated_introduction_year: get(contract, 'estimated_introduction_year'),
    project_area: get(contract, 'project_area'),
    plan_reference_number: get(contract, 'plan_reference_number'),
    plan_number: get(contract, 'plan_number'),
    plan_acceptor: get(contract, 'plan_acceptor'),
    plan_lawfulness_date: get(contract, 'plan_lawfulness_date'),
    state: get(contract, 'state'),
  };
};

const getContentDecisionConditions = (decision: Object) =>
  get(decision, 'conditions', []).map((condition) => {
    return {
      type: get(condition, 'type'),
      area: get(condition, 'area'),
      deposit: get(condition, 'deposit'),
      compensation: get(condition, 'compensation'),
      note: get(condition, 'note'),
    };
  });

const getContentDecisionItem = (decision: Object) => {
  return {
    id: get(decision, 'id'),
    decision_maker: get(decision, 'decision_maker'),
    decision_date: get(decision, 'decision_date'),
    section: get(decision, 'section'),
    type: get(decision, 'type'),
    reference_number: get(decision, 'reference_number'),
    conditions: getContentDecisionConditions(decision),
  };
};

export const getContentDecisions = (contract: LandUseContract) =>
  get(contract, 'decisions', []).map((decision) => getContentDecisionItem(decision));

const getContentContractItem = (contract: Object) => {
  return {
    id: get(contract, 'id'),
    state: get(contract, 'state'),
    decision_date: get(contract, 'decision_date'),
    sign_date: get(contract, 'sign_date'),
    ed_contract_number: get(contract, 'ed_contract_number'),
    reference_number: get(contract, 'reference_number'),
    area_arrengements: get(contract, 'area_arrengements'),
  };
};

export const getContentContracts = (contract: LandUseContract) =>
  get(contract, 'contracts', []).map((contract) => getContentContractItem(contract));

export const getContentCompensationInvoices = (compensation: Object) =>
  get(compensation, 'invoices', []).map((invoice) => {
    return {
      amount: get(invoice, 'amount'),
      due_date: get(invoice, 'due_date'),
    };
  });

export const getContentCompensations = (contract: LandUseContract) => {
  const compensations = get(contract, 'compensations', {});

  return {
    cash_compensation: get(compensations, 'cash_compensation'),
    land_compensation: get(compensations, 'land_compensation'),
    other_compensation: get(compensations, 'other_compensation'),
    first_installment_increase: get(compensations, 'first_installment_increase'),
    free_delivery_area: get(compensations, 'free_delivery_area'),
    free_delivery_amount: get(compensations, 'free_delivery_area'),
    additional_floor_area_apartment: get(compensations, 'additional_floor_area_apartment'),
    additional_floor_area_company: get(compensations, 'additional_floor_area_company'),
    invoices: getContentCompensationInvoices(compensations),
  };
};

const getContentInvoiceItem = (invoice: Object) => {
  return {
    amount: get(invoice, 'amount'),
    due_date: get(invoice, 'due_date'),
    sent_date: get(invoice, 'sent_date'),
    paid_date: get(invoice, 'paid_date'),
  };
};

export const getContentInvoices = (contract: LandUseContract) =>
  get(contract, 'invoices', []).map((invoice) => getContentInvoiceItem(invoice));

export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.COMPENSATIONS);
  removeSessionStorageItem(FormNames.CONTRACTS);
  removeSessionStorageItem(FormNames.DECISIONS);
  removeSessionStorageItem(FormNames.INVOICES);
  removeSessionStorageItem('landUseContractId');
  removeSessionStorageItem('landUseContractValidity');
};
