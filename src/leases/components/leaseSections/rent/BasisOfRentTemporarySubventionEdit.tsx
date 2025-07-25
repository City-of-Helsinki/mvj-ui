import React from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import RemoveButton from "@/components/form/RemoveButton";
import {
  BasisOfRentTemporarySubventionsFieldPaths,
  BasisOfRentTemporarySubventionsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { calculateBasisOfRentSubventionAmountCumulative } from "@/leases/helpers";
import {
  formatNumber,
  hasPermissions,
  isFieldAllowedToRead,
  getFieldAttributes,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  disabled: boolean;
  field: any;
  formName: string;
  initialYearRent: number;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  subventionPercent: string;
  usersPermissions: UsersPermissionsType;
  managementSubventions: any;
  temporarySubventions: any;
  index: number;
};

const BasisOfRentTemporarySubventionEdit = ({
  disabled,
  field,
  initialYearRent,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  subventionPercent,
  usersPermissions,
  managementSubventions,
  temporarySubventions,
  index,
}: Props) => {
  const subventionAmount = calculateBasisOfRentSubventionAmountCumulative(
    initialYearRent,
    subventionPercent,
    managementSubventions,
    temporarySubventions,
    index,
    "EDIT",
  );
  return (
    <Row>
      <Column small={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION,
          )}
        >
          <FormFieldLegacy
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION,
            )}
            name={`${field}.description`}
            disabled={disabled}
            overrideValues={{
              label: BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION,
            }}
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
          )}
        >
          <FormFieldLegacy
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
            )}
            name={`${field}.subvention_percent`}
            disabled={disabled}
            overrideValues={{
              label:
                BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT,
            }}
            unit="%"
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        {/* Silence */}
      </Column>
      <Column small={4} large={2}>
        <FieldAndRemoveButtonWrapper
          field={
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
              )}
            >
              <FormText className="full-width">
                {formatNumber(subventionAmount, 3)} €
              </FormText>
            </Authorization>
          }
          removeButton={
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.DELETE_TEMPORARYSUBVENTION,
              )}
            >
              {!disabled && (
                <RemoveButton
                  className="third-level"
                  onClick={onRemove}
                  title="Poista tilapäisalennus"
                />
              )}
            </Authorization>
          }
        />
      </Column>
    </Row>
  );
};

export default connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    isSaveClicked: getIsSaveClicked(state),
    leaseAttributes: getLeaseAttributes(state),
    subventionPercent: selector(state, `${props.field}.subvention_percent`),
    usersPermissions: getUsersPermissions(state),
  };
})(BasisOfRentTemporarySubventionEdit);
