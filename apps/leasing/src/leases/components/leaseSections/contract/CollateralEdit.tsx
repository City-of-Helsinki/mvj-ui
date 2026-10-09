import React from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useAppSelector } from "@/root/hooks";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormField from "@/components/form/final-form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
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
import {
  CollateralTypeField,
  TotalAmountField,
  ReturnedDateField,
  NoteField,
  ThirdPartyPledgeField,
  ContractPartyField,
  ContractPartyIdentifierField,
  AccountNumberField,
  StartDateField,
  EndDateField,
  DocumentTypeField,
  PledgorFields,
} from "@/leases/components/leaseSections/contract/CollateralEditFields";

export type CollateralEditFieldProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralEmpty = (collateralFieldProps: CollateralEditFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

// Rahavakuus
const CollateralFinancialGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.PAID_DATE,
            )}
          >
            <FormField
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
          <ReturnedDateField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
      <ThirdPartyPledgeField {...collateralFieldProps} />
      <ContractPartyField {...collateralFieldProps} />
      <ContractPartyIdentifierField {...collateralFieldProps} />
      <AccountNumberField {...collateralFieldProps} />
      <PledgorFields {...collateralFieldProps} />
    </>
  );
};

//Panttikirja
const CollateralMortgageDocument = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
              name={`${field}.number`}
              overrideValues={{
                label:
                  LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT,
                required: true, //TODO: Handle in API?
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
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
              name={`${field}.deed_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.DEED_DATE,
                required: true, //TODO: Handle in API?
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
      <ThirdPartyPledgeField {...collateralFieldProps} />
      <ContractPartyField {...collateralFieldProps} />
      <ContractPartyIdentifierField {...collateralFieldProps} />
      <DocumentTypeField {...collateralFieldProps} />
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
          )}
          name={`${field}.subordinate_pledge`}
          overrideValues={{
            label: LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGE,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
          )}
        />
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
          )}
          name={`${field}.subordinate_pledgee_name`}
          overrideValues={{
            label: LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_NAME,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
          )}
        />
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
          )}
          name={`${field}.subordinate_pledgee_business_id`}
          overrideValues={{
            label:
              LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_BUSINESS_ID,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
          )}
        />
      </Authorization>
    </>
  );
};

const CollateralOther = (collateralFieldProps: CollateralEditFieldProps) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.OTHER_TYPE,
            )}
          >
            <FormField
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
            <FormField
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
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <ReturnedDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={8} large={10}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
      <ThirdPartyPledgeField {...collateralFieldProps} />
      <ContractPartyField {...collateralFieldProps} />
      <ContractPartyIdentifierField {...collateralFieldProps} />
      <DocumentTypeField {...collateralFieldProps} />
      <PledgorFields {...collateralFieldProps} />
    </>
  );
};

const CollateralSelfDebtorGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
      </Row>
      <ContractPartyField {...collateralFieldProps} />
      <ContractPartyIdentifierField {...collateralFieldProps} />
      {/* TODO: Number field here? */}
      <DocumentTypeField {...collateralFieldProps} />
      <ThirdPartyPledgeField {...collateralFieldProps} />
    </>
  );
};

const CollateralPledgeOfFunds = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

type Props = {
  field: string;
  onRemove: (...args: Array<any>) => any;
  collateralType: number | null | undefined;
};

const CollateralEdit: React.FC<Props> = ({
  field,
  onRemove,
  collateralType,
}) => {
  const attributes: Attributes = useAppSelector(getAttributes);
  const isSaveClicked: boolean = useAppSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useAppSelector(getUsersPermissions);
  const collateralFieldProps: CollateralEditFieldProps = {
    attributes,
    field,
    isSaveClicked,
  };
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

        {!collateralType && <CollateralEmpty {...collateralFieldProps} />}
        {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && (
          <CollateralFinancialGuarantee {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && (
          <CollateralMortgageDocument {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.SELF_DEBTOR_GUARANTEE && (
          <CollateralSelfDebtorGuarantee
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {collateralType === CollateralTypes.PLEDGE_OF_FUNDS && (
          <CollateralPledgeOfFunds
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {Boolean(collateralType) &&
          (collateralType === CollateralTypes.OTHER || collateralType > 5) && (
            <CollateralOther {...collateralFieldProps} />
          )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default CollateralEdit;
