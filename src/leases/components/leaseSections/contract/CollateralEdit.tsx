import React from "react";
import { Row, Column } from "react-foundation";
import { formValueSelector } from "redux-form";
import { useSelector } from "react-redux";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import RemoveButton from "@/components/form/RemoveButton";
import { FormNames } from "@/enums";
import {
  CollateralTypes,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes, getIsSaveClicked } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type EmptyProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralEmpty = ({ attributes, field, isSaveClicked }: EmptyProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
              name={`${field}.type`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
    </>
  );
};

type FinancialGuaranteeProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralFinancialGuarantee = ({
  attributes,
  field,
  isSaveClicked,
}: FinancialGuaranteeProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
              name={`${field}.type`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
              name={`${field}.total_amount`}
              unit="€"
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT,
              }}
              enableUiDataEdit
              tooltipStyle={{
                right: 12,
              }}
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.PAID_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.PAID_DATE,
              )}
              name={`${field}.paid_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.PAID_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.PAID_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.RETURNED_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.RETURNED_DATE,
              )}
              name={`${field}.returned_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.RETURNED_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.RETURNED_DATE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NOTE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
              name={`${field}.note`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
    </>
  );
};

type MortgageDocumentProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralMortgageDocument = ({
  attributes,
  field,
  isSaveClicked,
}: MortgageDocumentProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
              name={`${field}.type`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
              name={`${field}.number`}
              overrideValues={{
                label:
                  LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.DEED_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
              name={`${field}.deed_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.DEED_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.START_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.START_DATE,
              )}
              name={`${field}.start_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.START_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.END_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.END_DATE,
              )}
              name={`${field}.end_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.END_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
              name={`${field}.total_amount`}
              unit="€"
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT,
              }}
              enableUiDataEdit
              tooltipStyle={{
                right: 12,
              }}
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NOTE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
              name={`${field}.note`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
    </>
  );
};

type OtherProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralOther = ({ attributes, field, isSaveClicked }: OtherProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TYPE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
              name={`${field}.type`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TYPE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.OTHER_TYPE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.OTHER_TYPE,
              )}
              name={`${field}.other_type`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.OTHER_TYPE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.OTHER_TYPE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
              name={`${field}.number`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.NUMBER,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.START_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.START_DATE,
              )}
              name={`${field}.start_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.START_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.END_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.END_DATE,
              )}
              name={`${field}.end_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.END_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.END_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
              name={`${field}.total_amount`}
              unit="€"
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT,
              }}
              enableUiDataEdit
              tooltipStyle={{
                right: 12,
              }}
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.RETURNED_DATE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.RETURNED_DATE,
              )}
              name={`${field}.returned_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.RETURNED_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.RETURNED_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={8} large={10}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NOTE,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
              name={`${field}.note`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NOTE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
    </>
  );
};

const formName = FormNames.LEASE_CONTRACTS;
const selector = formValueSelector(formName);

type Props = {
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const CollateralEdit: React.FC<Props> = ({ field, onRemove }) => {
  const attributes: Attributes = useSelector(getAttributes);
  const collateralType: number | null | undefined = useSelector((state) =>
    selector(state, `${field}.type`),
  );
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.DELETE_COLLATERAL,
            )}
          >
            <RemoveButton onClick={onRemove} title="Poista vakuus" />
          </Authorization>
        </ActionButtonWrapper>

        {!collateralType && (
          <CollateralEmpty
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && (
          <CollateralFinancialGuarantee
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && (
          <CollateralMortgageDocument
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {Boolean(collateralType) &&
          (collateralType === CollateralTypes.OTHER || collateralType > 3) && (
            <CollateralOther
              attributes={attributes}
              field={field}
              isSaveClicked={isSaveClicked}
            />
          )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default CollateralEdit;
