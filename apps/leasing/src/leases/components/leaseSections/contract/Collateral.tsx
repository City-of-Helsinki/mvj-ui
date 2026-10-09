import React from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useAppSelector } from "@/root/hooks";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  CollateralTypes,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import {
  CollateralTypeField,
  TotalAmountField,
  StartDateField,
  EndDateField,
  ReturnedDateField,
  NoteField,
  ThirdPartyPledgeField,
  ContractPartyField,
  ContractPartyIdentifierField,
  AccountNumberField,
  DocumentTypeField,
} from "@/leases/components/leaseSections/contract/CollateralFields";
import type { Collateral } from "@/leases/types";
export type CollateralFieldProps = {
  attributes: Attributes;
  collateral: Collateral;
};

const CollateralEmpty = ({ attributes, collateral }: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
      </Row>
    </>
  );
};
// Rahavakuus
const CollateralFinancialGuarantee = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.PAID_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.PAID_DATE,
                )}
              >
                {LeaseContractCollateralsFieldTitles.PAID_DATE}
              </FormTextTitle>
              <FormText>{formatDate(collateral.paid_date) || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <ReturnedDateField attributes={attributes} collateral={collateral} />
        </Column>
        {/* {collateral.returned_date && (
          <Column small={6} medium={4} large={2}>
            <ReturnerOfCollateralDateField
              attributes={attributes}
              collateral={collateral}
            />
          </Column>
        )} */}
      </Row>
      <Row>
        <Column small={12}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <ThirdPartyPledgeField attributes={attributes} collateral={collateral} />
      <ContractPartyField attributes={attributes} collateral={collateral} />
      <ContractPartyIdentifierField
        attributes={attributes}
        collateral={collateral}
      />
      <AccountNumberField attributes={attributes} collateral={collateral} />
    </>
  );
};
//Panttikirja
const CollateralMortgageDocument = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
                )}
              >
                {LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT}
              </FormTextTitle>
              <FormText>{collateral.number || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.DEED_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.DEED_DATE,
                )}
              >
                {LeaseContractCollateralsFieldTitles.DEED_DATE}
              </FormTextTitle>
              <FormText>{formatDate(collateral.deed_date) || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <ThirdPartyPledgeField attributes={attributes} collateral={collateral} />
      <ContractPartyField attributes={attributes} collateral={collateral} />
      <ContractPartyIdentifierField
        attributes={attributes}
        collateral={collateral}
      />
      <DocumentTypeField attributes={attributes} collateral={collateral} />
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
            )}
          >
            {LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGE}
          </FormTextTitle>
          <FormText>{collateral.subordinate_pledge || "-"}</FormText>
        </>
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
            )}
          >
            {LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_NAME}
          </FormTextTitle>
          <FormText>{collateral.subordinate_pledgee_name || "-"}</FormText>
        </>
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
            )}
          >
            {
              LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_BUSINESS_ID
            }
          </FormTextTitle>
          <FormText>
            {collateral.subordinate_pledgee_business_id || "-"}
          </FormText>
        </>
      </Authorization>
    </>
  );
};

const CollateralOther = ({ attributes, collateral }: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.OTHER_TYPE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.OTHER_TYPE,
                )}
              >
                {LeaseContractCollateralsFieldTitles.OTHER_TYPE}
              </FormTextTitle>
              <FormText>{collateral.other_type || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.NUMBER,
                )}
              >
                {LeaseContractCollateralsFieldTitles.NUMBER}
              </FormTextTitle>
              <FormText>{collateral.number || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <ReturnedDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={8} large={10}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <ThirdPartyPledgeField attributes={attributes} collateral={collateral} />
      <ContractPartyField attributes={attributes} collateral={collateral} />
      <ContractPartyIdentifierField
        attributes={attributes}
        collateral={collateral}
      />
      <DocumentTypeField attributes={attributes} collateral={collateral} />
    </>
  );
};

type Props = {
  collateral: Collateral;
};

const Collateral = ({ collateral }: Props) => {
  const collateralType = collateral.type;
  const attributes: Attributes = useAppSelector(getAttributes);
  return (
    <BoxItem className="no-border-on-first-child no-border-on-last-child">
      {!collateralType && (
        <CollateralEmpty attributes={attributes} collateral={collateral} />
      )}
      {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && (
        <CollateralFinancialGuarantee
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && (
        <CollateralMortgageDocument
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType &&
        (collateralType === CollateralTypes.OTHER || collateralType > 3) && (
          <CollateralOther attributes={attributes} collateral={collateral} />
        )}
    </BoxItem>
  );
};

export default Collateral;
