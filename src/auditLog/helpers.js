// @flow
import get from 'lodash/get';

import {
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeaseDecisionsFieldPaths,
  InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths,
} from '$src/infillDevelopment/enums';
import {
  InvoicePaymentsFieldPaths,
  InvoiceRowsFieldPaths,
} from '$src/invoices/enums';
import {
  LeaseAreasFieldPaths,
  LeaseAreaAddressesFieldPaths,
  LeaseBasisOfRentsFieldPaths,
  LeaseContractsFieldPaths,
  LeaseContractChangesFieldPaths,
  LeaseContractCollateralsFieldPaths,
  LeaseConstructabilityDescriptionsFieldPaths,
  LeaseDecisionsFieldPaths,
  LeaseDecisionConditionsFieldPaths,
  LeaseInspectionsFieldPaths,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
  LeaseRentsFieldPaths,
  LeaseRentContractRentsFieldPaths,
  LeaseRentDueDatesFieldPaths,
  LeaseRentFixedInitialYearRentsFieldPaths,
  LeaseRentAdjustmentsFieldPaths,
  LeaseTenantsFieldPaths,
  LeaseTenantContactSetFieldPaths,
} from '$src/leases/enums';
import {getFieldAttributes} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {AuditLogList} from './types';

/*
* Get auditlog action type in Finnish
* @param {string} action
* @returns {string}
*/
export const getAuditLogActionTypeInFinnish = (action: string) => {
  switch(action) {
    case 'create':
      return 'Luominen';
    case 'delete':
      return 'Poistaminen';
    case 'update':
      return 'Muokkaaminen';
    default:
      return action;
  }
};

/*
* Get general auditlog content label
* @param {string} key
* @returns {string}
*/
const getGeneralAuditLogContentLabel = (key: string) => {
  switch(key) {
    case 'contract':
      return 'Sopimus';
    case 'created_at':
      return 'Luotu';
    case 'decision':
      return 'Päätös';
    case 'deleted':
      return 'Poistettu';
    case 'id':
      return 'Id';
    case 'infill_development_compensation_lease':
      return 'Vuokraus';
    case 'invoice':
      return 'Lasku';
    case 'file':
      return 'Tiedosto';
    case 'lease':
      return 'Vuokraus';
    case 'lease_area':
      return 'Vuokra-alue';
    case 'locked_by':
      return 'Lukinnut';
    case 'modified_at':
      return 'Muokattu';
    case 'note':
      return 'Huomautus';
    case 'rent':
      return 'Vuokra';
    case 'uploaded_at':
      return 'Ladattu';
    case 'uploader':
      return 'Lataaja';
    case 'user':
      return 'Käyttäjä';
  }

  return key;
};

/*
* Get auditlog content label
* @param {Object} leaseAttributes
* @param {Object} commentAttributes
* @param {Object} contactAttributes
* @param {Object} invoiceAttributes
* @param {Object} infillDevelopmentCompensationAttributes
* @param {string} contentType
* @param {string} key
* @returns {string}
*/
export const getAuditLogContentLabel = (
  leaseAttributes: Attributes,
  commentAttributes: Attributes,
  contactAttributes: Attributes,
  invoiceAttributes: Attributes,
  infillDevelopmentCompensationAttributes: Attributes,
  contentType: string,
  key: string,
) => {
  let fieldKey = key;
  let fieldAttributes = null;

  switch(contentType) {
    case 'comment':
      fieldAttributes = getFieldAttributes(commentAttributes, key);
      break;
    case 'collateral':
      fieldKey = `${LeaseContractCollateralsFieldPaths.COLLATRALS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'contact':
      fieldAttributes = getFieldAttributes(contactAttributes, key);
      break;
    case 'condition':
      fieldKey = `${LeaseDecisionConditionsFieldPaths.CONDITIONS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'constructabilitydescription':
      fieldKey = `${LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'contract':
      fieldKey = `${LeaseContractsFieldPaths.CONTRACTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'contractchange':
      fieldKey = `${LeaseContractChangesFieldPaths.CONTRACT_CHANGES}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'contractrent':
      fieldKey = `${LeaseRentContractRentsFieldPaths.CONTRACT_RENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'decision':
      fieldKey = `${LeaseDecisionsFieldPaths.DECISIONS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'fixedinitialyearrent':
      fieldKey = `${LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'infilldevelopmentcompensation':
      fieldAttributes = getFieldAttributes(infillDevelopmentCompensationAttributes, key);
      break;
    case 'infilldevelopmentcompensationdecision':
      fieldKey = `${InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(infillDevelopmentCompensationAttributes, fieldKey);
      break;
    case 'infilldevelopmentcompensationintendeduse':
      fieldKey = `${InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(infillDevelopmentCompensationAttributes, fieldKey);
      break;
    case 'infilldevelopmentcompensationlease':
      fieldKey = `${InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(infillDevelopmentCompensationAttributes, fieldKey);
      break;
    case 'inspection':
      fieldKey = `${LeaseInspectionsFieldPaths.INSPECTIONS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'invoice':
      fieldAttributes = getFieldAttributes(invoiceAttributes, key);
      break;
    case 'invoicepayment':
      fieldKey = `${InvoicePaymentsFieldPaths.PAYMENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(invoiceAttributes, fieldKey);
      break;
    case 'invoicerow':
      fieldKey = `${InvoiceRowsFieldPaths.ROWS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(invoiceAttributes, fieldKey);
      break;
    case 'lease':
      fieldAttributes = getFieldAttributes(leaseAttributes, key);
      break;
    case 'leasearea':
      fieldKey = `${LeaseAreasFieldPaths.LEASE_AREAS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'leaseareaaddress':
      fieldKey = `${LeaseAreaAddressesFieldPaths.ADDRESSES}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'leasebasisofrent':
      fieldKey = `${LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'planunit':
      fieldKey = `${LeasePlanUnitsFieldPaths.PLAN_UNITS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'plot':
      fieldKey = `${LeasePlotsFieldPaths.PLOTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'rent':
      fieldKey = `${LeaseRentsFieldPaths.RENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'rentadjustment':
      fieldKey = `${LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'rentduedate':
      fieldKey = `${LeaseRentDueDatesFieldPaths.DUE_DATES}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'tenant':
      fieldKey = `${LeaseTenantsFieldPaths.TENANTS}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
    case 'tenantcontact':
      fieldKey = `${LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET}.child.children.${key}`;
      fieldAttributes = getFieldAttributes(leaseAttributes, fieldKey);
      break;
  }

  console.log(contentType, fieldAttributes);
  return get(fieldAttributes, 'label') || getGeneralAuditLogContentLabel(key);
};

/*
* Map auditlog list count from API response
* @param {Object} list
* @returns {number}
*/
export const getAuditLogCount = (auditLogList: AuditLogList) => get(auditLogList, 'count', 0);

/*
* Map auditlog list max page from API response
* @param {Object} list
* @param {number} size
* @returns {number}
*/
export const getAuditLogMaxPage = (auditLogList: AuditLogList, size: number) => {
  const count = getAuditLogCount(auditLogList);

  return Math.ceil(count/size);
};

/*
* Map auditlog list items from API response
* @param {Object} list
* @returns {Object[]}
*/
export const getAuditLogItems = (auditLogList: AuditLogList) => get(auditLogList, 'results', []);
