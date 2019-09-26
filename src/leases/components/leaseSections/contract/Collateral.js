// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {
  CollateralTypes,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from '$src/leases/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type EmptyProps = {
  attributes: Attributes,
  collateral: Object,
  typeOptions: Array<Object>,
}

const CollateralEmpty = ({
  attributes,
  collateral,
  typeOptions,
}: EmptyProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}>
              {LeaseContractCollateralsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, collateral.type) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type FinancialGuaranteeProps = {
  attributes: Attributes,
  collateral: Object,
  typeOptions: Array<Object>,
}

const CollateralFinancialGuarantee = ({
  attributes,
  collateral,
  typeOptions,
}: FinancialGuaranteeProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}>
              {LeaseContractCollateralsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, collateral.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
              {LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}
            </FormTextTitle>
            <FormText>{!isEmptyValue(collateral.total_amount) ? `${formatNumber(collateral.total_amount)} €` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.PAID_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.PAID_DATE)}>
              {LeaseContractCollateralsFieldTitles.PAID_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.paid_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
              {LeaseContractCollateralsFieldTitles.RETURNED_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.returned_date) || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}>
              {LeaseContractCollateralsFieldTitles.NOTE}
            </FormTextTitle>
            <FormText>{collateral.note  || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type MortgageDocumentProps = {
  attributes: Attributes,
  collateral: Object,
  typeOptions: Array<Object>,
}

const CollateralMortgageDocument = ({
  attributes,
  collateral,
  typeOptions,
}: MortgageDocumentProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}>
              {LeaseContractCollateralsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, collateral.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT)}>
              {LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT}
            </FormTextTitle>
            <FormText>{collateral.number || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.DEED_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.DEED_DATE)}>
              {LeaseContractCollateralsFieldTitles.DEED_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.deed_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.START_DATE)}>
              {LeaseContractCollateralsFieldTitles.START_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)}>
              {LeaseContractCollateralsFieldTitles.END_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
              {LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}
            </FormTextTitle>
            <FormText>{!isEmptyValue(collateral.total_amount) ? `${formatNumber(collateral.total_amount)} €` : '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}>
              {LeaseContractCollateralsFieldTitles.NOTE}
            </FormTextTitle>
            <FormText>{collateral.note  || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type OtherProps = {
  attributes: Attributes,
  collateral: Object,
  typeOptions: Array<Object>,
}

const CollateralOther = ({
  attributes,
  collateral,
  typeOptions,
}: OtherProps) => {
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}>
              {LeaseContractCollateralsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, collateral.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.OTHER_TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.OTHER_TYPE)}>
              {LeaseContractCollateralsFieldTitles.OTHER_TYPE}
            </FormTextTitle>
            <FormText>{collateral.other_type || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NUMBER)}>
              {LeaseContractCollateralsFieldTitles.NUMBER}
            </FormTextTitle>
            <FormText>{collateral.number || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.START_DATE)}>
              {LeaseContractCollateralsFieldTitles.START_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)}>
              {LeaseContractCollateralsFieldTitles.END_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
              {LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}
            </FormTextTitle>
            <FormText>{!isEmptyValue(collateral.total_amount) ? `${formatNumber(collateral.total_amount)} €` : '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
              {LeaseContractCollateralsFieldTitles.RETURNED_DATE}
            </FormTextTitle>
            <FormText>{formatDate(collateral.returned_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={8} large={10}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}>
              {LeaseContractCollateralsFieldTitles.NOTE}
            </FormTextTitle>
            <FormText>{collateral.note  || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

type Props = {
  attributes: Attributes,
  collateral: Object,
  otherTypeOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const Collateral = ({
  attributes,
  collateral,
  typeOptions,
}: Props) => {
  const collateralType = collateral.type;
  return(
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      {!collateralType &&
        <CollateralEmpty
          attributes={attributes}
          collateral={collateral}
          typeOptions={typeOptions}
        />
      }
      {collateralType === CollateralTypes.FINANCIAL_GUARANTEE &&
        <CollateralFinancialGuarantee
          attributes={attributes}
          collateral={collateral}
          typeOptions={typeOptions}
        />
      }
      {collateralType === CollateralTypes.MORTGAGE_DOCUMENT &&
        <CollateralMortgageDocument
          attributes={attributes}
          collateral={collateral}
          typeOptions={typeOptions}
        />
      }
      {collateralType && (collateralType === CollateralTypes.OTHER || collateralType > 3) &&
        <CollateralOther
          attributes={attributes}
          collateral={collateral}
          typeOptions={typeOptions}
        />
      }
    </BoxItem>
  );
};

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    }
  ),

)(Collateral);
