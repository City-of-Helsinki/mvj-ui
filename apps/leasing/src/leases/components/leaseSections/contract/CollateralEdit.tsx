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
type CollateralFieldProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
};

const CollateralTypeField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.TYPE,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.TYPE,
      )}
      name={`${field}.type`}
      overrideValues={{ label: LeaseContractCollateralsFieldTitles.TYPE }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}
    />
  </Authorization>
);

const TotalAmountField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
    )}
  >
    <FormField
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
);

const StartDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.START_DATE,
    )}
  >
    <FormField
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
);

const EndDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.END_DATE,
    )}
  >
    <FormField
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
      uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)}
    />
  </Authorization>
);

const ReturnedDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_DATE,
    )}
  >
    <FormField
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
);

const NoteField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.NOTE,
    )}
  >
    <FormField
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
      uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}
    />
  </Authorization>
);

const CollateralEmpty = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
    </>
  );
};

const CollateralFinancialGuarantee = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
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
          <ReturnedDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <NoteField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
    </>
  );
};

const CollateralMortgageDocument = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
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
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <NoteField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
    </>
  );
};

const CollateralOther = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
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
          <StartDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <ReturnedDateField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={6} medium={8} large={10}>
          <NoteField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
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
