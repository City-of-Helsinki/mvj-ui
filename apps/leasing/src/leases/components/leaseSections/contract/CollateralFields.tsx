import React, { useMemo } from "react";
import Authorization from "@/components/authorization/Authorization";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import { Row, Column } from "@/components/grid/Grid";
import { ContactTypes } from "@/contacts/enums";
import { getContactFullName } from "@/contacts/helpers";
import type { Contact } from "@/contacts/types";
import {
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { getContentTenants } from "@/leases/helpers";
import { getCurrentLease } from "@/leases/selectors";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getUserFullName } from "@/users/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { useAppSelector } from "@/root/hooks";
import { CollateralFieldProps } from "@/leases/components/leaseSections/contract/Collateral";

export const CollateralTypeField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const typeOptions = getFieldOptions(
    attributes,
    LeaseContractCollateralsFieldPaths.TYPE,
  );
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.TYPE,
      )}
    >
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}
        >
          {LeaseContractCollateralsFieldTitles.TYPE}
        </FormTextTitle>
        <FormText>
          {getLabelOfOption(typeOptions, collateral.type) || "-"}
        </FormText>
      </>
    </Authorization>
  );
};

export const TotalAmountField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
        )}
      >
        {LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}
      </FormTextTitle>
      <FormText>
        {!isEmptyValue(collateral.total_amount)
          ? `${formatNumber(collateral.total_amount)} €`
          : "-"}
      </FormText>
    </>
  </Authorization>
);

export const StartDateField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.START_DATE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.START_DATE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.START_DATE}
      </FormTextTitle>
      <FormText>{formatDate(collateral.start_date) || "-"}</FormText>
    </>
  </Authorization>
);

export const EndDateField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.END_DATE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.END_DATE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.END_DATE}
      </FormTextTitle>
      <FormText>{formatDate(collateral.end_date) || "-"}</FormText>
    </>
  </Authorization>
);

export const ReturnedDateFields = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_DATE,
    )}
  >
    <>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.RETURNED_DATE,
          )}
        >
          {LeaseContractCollateralsFieldTitles.RETURNED_DATE}
        </FormTextTitle>
        <FormText>{formatDate(collateral.returned_date) || "-"}</FormText>
      </Column>

      {collateral.returned_date && (
        <Column small={6} medium={4} large={2}>
          <ReturnedByField attributes={attributes} collateral={collateral} />
        </Column>
      )}
    </>
  </Authorization>
);

export const ReturnedByField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_BY,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.RETURNED_BY,
        )}
      >
        {LeaseContractCollateralsFieldTitles.RETURNED_BY}
      </FormTextTitle>
      <FormText>{getUserFullName(collateral.returned_by) || "-"}</FormText>
    </>
  </Authorization>
);

export const NoteField = ({ attributes, collateral }: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.NOTE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}
      >
        {LeaseContractCollateralsFieldTitles.NOTE}
      </FormTextTitle>
      <FormText>{collateral.note || "-"}</FormText>
    </>
  </Authorization>
);

export const ThirdPartyPledgeFields = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const hasThirdPartyPledge =
    collateral.third_party_pledgor_business_id ||
    collateral.third_party_pledgor_name;
  return (
    <>
      <Column small={6} medium={4} large={2}>
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
            )}
          >
            {LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGE}
          </FormTextTitle>
          <FormText>{hasThirdPartyPledge ? "Kyllä" : "Ei"}</FormText>
        </>
      </Column>
      {hasThirdPartyPledge && (
        <>
          <Column small={6} medium={4} large={2}>
            <ThirdPartyPledgorNameField
              attributes={attributes}
              collateral={collateral}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <ThirdPartyPledgorBusinessIdField
              attributes={attributes}
              collateral={collateral}
            />
          </Column>
        </>
      )}
    </>
  );
};

const ThirdPartyPledgorNameField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_NAME,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_NAME,
        )}
      >
        {LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGOR_NAME}
      </FormTextTitle>
      <FormText>{collateral.third_party_pledgor_name || "-"}</FormText>
    </>
  </Authorization>
);

const ThirdPartyPledgorBusinessIdField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
        )}
      >
        {LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGOR_BUSINESS_ID}
      </FormTextTitle>
      <FormText>{collateral.third_party_pledgor_business_id || "-"}</FormText>
    </>
  </Authorization>
);

export const SubordinatePledgeFields = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const hasSubordinatePledge =
    collateral.subordinate_pledgee_business_id ||
    collateral.subordinate_pledgee_name;
  return (
    <>
      <Column small={6} medium={4} large={2}>
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
            )}
          >
            {LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGE}
          </FormTextTitle>
          <FormText>{hasSubordinatePledge ? "Kyllä" : "Ei"}</FormText>
        </>
      </Column>
      {hasSubordinatePledge && (
        <>
          <Column small={6} medium={4} large={2}>
            <SubordinatePledgeeNameField
              attributes={attributes}
              collateral={collateral}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <SubordinatePledgeeBusinessIdField
              attributes={attributes}
              collateral={collateral}
            />
          </Column>
        </>
      )}
      {!hasSubordinatePledge && <Column large={4} />}
    </>
  );
};

const SubordinatePledgeeNameField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
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
);

const SubordinatePledgeeBusinessIdField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
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
        {LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_BUSINESS_ID}
      </FormTextTitle>
      <FormText>{collateral.subordinate_pledgee_business_id || "-"}</FormText>
    </>
  </Authorization>
);

export const PledgorFields = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <>
    <Column small={6} medium={4} large={2}>
      <PledgorNameField attributes={attributes} collateral={collateral} />
    </Column>
    <Column small={6} medium={4} large={2}>
      <PledgorIdentificationNumberField
        attributes={attributes}
        collateral={collateral}
      />
    </Column>
    <Column small={6} medium={4} large={2}>
      <PledgorBusinessIdField attributes={attributes} collateral={collateral} />
    </Column>
  </>
);

export const PledgorNameField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
        )}
      >
        {LeaseContractCollateralsFieldTitles.PLEDGOR_NAME}
      </FormTextTitle>
      <FormText>{collateral.pledgor_name || "-"}</FormText>
    </>
  </Authorization>
);

const PledgorIdentificationNumberField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
        )}
      >
        {
          LeaseContractCollateralsFieldTitles.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER
        }
      </FormTextTitle>
      <FormText>
        {collateral.pledgor_national_identification_number || "-"}
      </FormText>
    </>
  </Authorization>
);

export const PledgorBusinessIdField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
      )}
    >
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
          )}
        >
          {LeaseContractCollateralsFieldTitles.PLEDGOR_BUSINESS_ID}
        </FormTextTitle>
        <FormText>{collateral.pledgor_business_id || "-"}</FormText>
      </>
    </Authorization>
  );
};

//TODO: figure out if we want these combined or separtedted
const getContactIdentifier = (contact: Contact | null | undefined) =>
  contact?.type === ContactTypes.BUSINESS
    ? contact?.business_id
    : contact?.national_identification_number;

type ContractPartyTableProps = {
  tenantIds: Array<number> | null | undefined;
  showTitleWhenEmpty?: boolean;
};

export const ContractPartyTable = ({
  tenantIds,
  showTitleWhenEmpty = true,
}: ContractPartyTableProps) => {
  const currentLease = useAppSelector(getCurrentLease);
  const contractParties = useMemo(() => {
    if (!tenantIds?.length) return [];
    const tenants = getContentTenants(currentLease);
    return tenantIds.map((id) => ({
      contact: tenants.find((t) => t.id === id)?.tenant?.contact,
    }));
  }, [currentLease, tenantIds]);

  if (!contractParties.length) {
    return showTitleWhenEmpty ? (
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
          )}
        >
          {LeaseContractCollateralsFieldTitles.CONTRACT_PARTY}
        </FormTextTitle>
        <FormText>-</FormText>
      </>
    ) : null;
  }

  return (
    <>
      <Row>
        <Column small={6}>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
            )}
          >
            {LeaseContractCollateralsFieldTitles.CONTRACT_PARTY}
          </FormTextTitle>
        </Column>
        <Column small={6}>
          <FormTextTitle>
            {LeaseContractCollateralsFieldTitles.CONTRACT_PARTY_IDENTIFIER}
          </FormTextTitle>
        </Column>
      </Row>
      {contractParties.map(({ contact }) => (
        <Row key={contact.id}>
          <Column small={6}>
            <FormText>{getContactFullName(contact) || "-"}</FormText>
          </Column>
          <Column small={6}>
            <FormText>{getContactIdentifier(contact) || "-"}</FormText>
          </Column>
        </Row>
      ))}
    </>
  );
};

export const ContractPartyFields = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
    )}
  >
    <ContractPartyTable tenantIds={collateral.contract_party} />
  </Authorization>
);

export const AccountNumberField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
        )}
      >
        {LeaseContractCollateralsFieldTitles.ACCOUNT_NUMBER}
      </FormTextTitle>
      <FormText>{collateral.account_number || "-"}</FormText>
    </>
  </Authorization>
);

export const DocumentTypeField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const documentTypeOptions = getFieldOptions(
    attributes,
    LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
  );
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
      )}
    >
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
          )}
        >
          {LeaseContractCollateralsFieldTitles.DOCUMENT_TYPE}
        </FormTextTitle>
        <FormText>
          {getLabelOfOption(documentTypeOptions, collateral.document_type) ||
            "-"}
        </FormText>
      </>
    </Authorization>
  );
};
