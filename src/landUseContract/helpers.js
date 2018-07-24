// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {FormNames} from './enums';
import {getContentUser} from '$src/leases/helpers';
import {fixedLengthNumber} from '$util/helpers';
import {removeSessionStorageItem} from '$util/storage';

import type {LandUseContract} from './types';

export const getContentLandUseContractIdentifier = (item: Object) => {
  if(isEmpty(item)) {
    return null;
  }
  const unit = `${get(item, 'identifier.type.identifier')}${get(item, 'identifier.municipality.identifier')}${fixedLengthNumber(get(item, 'identifier.district.identifier'), 2)}-${get(item, 'identifier.sequence')}`;
  return unit;
};

export const getContentLandUseContractListItem = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    litigant: get(contract, 'litigants[0].litigant'),
    plan_number: get(contract, 'plan_number'),
    area: get(contract, 'areas[0].area'),
    project_area: get(contract, 'project_area'),
    state: get(contract, 'state'),
  };
};

const getContentBasicInformationAreas = (contract: LandUseContract) => {
  return get(contract, 'areas', []).map((area) => {
    return {
      area: get(area, 'area'),
    };
  });
};

const getContentBasicInformationLitigants = (contract: LandUseContract) => {
  return get(contract, 'litigants', []).map((litigant) => {
    return {
      litigant: get(litigant, 'litigant'),
    };
  });
};

export const getContentBasicInformation = (contract: LandUseContract) => {
  return {
    id: contract.id,
    identifier: getContentLandUseContractIdentifier(contract),
    areas: getContentBasicInformationAreas(contract),
    litigants: getContentBasicInformationLitigants(contract),
    preparer: getContentUser(get(contract, 'preparer')),
    land_use_contract_number: get(contract, 'land_use_contract_number'),
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

const getContentDecisionConditions = (decision: Object) => {
  const conditions = get(decision, 'conditions', []);
  return conditions.map((condition) => {
    return {
      type: get(condition, 'type'),
      area: get(condition, 'area'),
      deposit: get(condition, 'deposit'),
      compensation: get(condition, 'compensation'),
      note: get(condition, 'note'),
    };
  });
};

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

export const getContentDecisions = (contract: LandUseContract) => {
  return get(contract, 'decisions', []).map((decision) => getContentDecisionItem(decision));
};

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

export const getContentContracts = (contract: LandUseContract) => {
  return get(contract, 'contracts', []).map((contract) => getContentContractItem(contract));
};

export const getContentCompensationInvoices = (compensation: Object) => {
  const invoices = get(compensation, 'invoices', []);
  return invoices.map((invoice) => {
    return {
      amount: get(invoice, 'amount'),
      due_date: get(invoice, 'due_date'),
    };
  });
};

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

export const getContentInvoices = (contract: LandUseContract) => {
  return get(contract, 'invoices', []).map((invoice) => getContentInvoiceItem(invoice));
};

export const getContentLandUseContractList = (content: Object) => {
  const contracts = get(content, 'results', []);
  return contracts.map((contract) => getContentLandUseContractListItem(contract));
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
