import React, { Fragment } from "react";
import { Row, Column } from "react-foundation";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import ActionButtonWrapper from "/src/components/form/ActionButtonWrapper";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItem from "/src/components/content/BoxItem";
import FormField from "/src/components/form/FormField";
import RemoveButton from "/src/components/form/RemoveButton";
import { FormNames } from "enums";
import { CollateralTypes, LeaseContractCollateralsFieldPaths, LeaseContractCollateralsFieldTitles } from "leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getFieldAttributes, hasPermissions, isFieldAllowedToRead } from "util/helpers";
import { getAttributes, getIsSaveClicked } from "leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type EmptyProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralEmpty = ({
  attributes,
  field,
  isSaveClicked
}: EmptyProps) => {
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TYPE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)} />
          </Authorization>
        </Column>
      </Row>
    </Fragment>;
};

type FinancialGuaranteeProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralFinancialGuarantee = ({
  attributes,
  field,
  isSaveClicked
}: FinancialGuaranteeProps) => {
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TYPE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} name={`${field}.total_amount`} unit='€' overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT
          }} enableUiDataEdit tooltipStyle={{
            right: 12
          }} uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.PAID_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.PAID_DATE)} name={`${field}.paid_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.PAID_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.PAID_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)} name={`${field}.returned_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.RETURNED_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.RETURNED_DATE)} />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NOTE)} name={`${field}.note`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.NOTE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)} />
          </Authorization>
        </Column>
      </Row>
    </Fragment>;
};

type MortgageDocumentProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralMortgageDocument = ({
  attributes,
  field,
  isSaveClicked
}: MortgageDocumentProps) => {
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TYPE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NUMBER)} name={`${field}.number`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.DEED_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.DEED_DATE)} name={`${field}.deed_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.DEED_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.DEED_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.START_DATE)} name={`${field}.start_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.START_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.START_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.END_DATE)} name={`${field}.end_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.END_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} name={`${field}.total_amount`} unit='€' overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT
          }} enableUiDataEdit tooltipStyle={{
            right: 12
          }} uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NOTE)} name={`${field}.note`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.NOTE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)} />
          </Authorization>
        </Column>
      </Row>
    </Fragment>;
};

type OtherProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralOther = ({
  attributes,
  field,
  isSaveClicked
}: OtherProps) => {
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TYPE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.OTHER_TYPE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.OTHER_TYPE)} name={`${field}.other_type`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.OTHER_TYPE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.OTHER_TYPE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NUMBER)} name={`${field}.number`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.NUMBER
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NUMBER)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.START_DATE)} name={`${field}.start_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.START_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.START_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.END_DATE)} name={`${field}.end_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.END_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} name={`${field}.total_amount`} unit='€' overrideValues={{
            label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT
          }} enableUiDataEdit tooltipStyle={{
            right: 12
          }} uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)} />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)} name={`${field}.returned_date`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.RETURNED_DATE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.RETURNED_DATE)} />
          </Authorization>
        </Column>
        <Column small={6} medium={8} large={10}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NOTE)} name={`${field}.note`} overrideValues={{
            label: LeaseContractCollateralsFieldTitles.NOTE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)} />
          </Authorization>
        </Column>
      </Row>
    </Fragment>;
};

type Props = {
  attributes: Attributes;
  collateralType: number | null | undefined;
  field: string;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const CollateralEdit = ({
  attributes,
  collateralType,
  field,
  isSaveClicked,
  onRemove,
  usersPermissions
}: Props) => {
  return <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_COLLATERAL)}>
            <RemoveButton onClick={onRemove} title="Poista vakuus" />
          </Authorization>
        </ActionButtonWrapper>

        {!collateralType && <CollateralEmpty attributes={attributes} field={field} isSaveClicked={isSaveClicked} />}
        {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && <CollateralFinancialGuarantee attributes={attributes} field={field} isSaveClicked={isSaveClicked} />}
        {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && <CollateralMortgageDocument attributes={attributes} field={field} isSaveClicked={isSaveClicked} />}
        {collateralType && (collateralType === CollateralTypes.OTHER || collateralType > 3) && <CollateralOther attributes={attributes} field={field} isSaveClicked={isSaveClicked} />}
      </BoxContentWrapper>
    </BoxItem>;
};

const formName = FormNames.LEASE_CONTRACTS;
const selector = formValueSelector(formName);
export default flowRight(connect((state, props: Props) => {
  return {
    attributes: getAttributes(state),
    collateralType: selector(state, `${props.field}.type`),
    isSaveClicked: getIsSaveClicked(state),
    usersPermissions: getUsersPermissions(state)
  };
}))(CollateralEdit);