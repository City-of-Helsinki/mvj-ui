import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
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
import { useFieldValue } from "@/components/helpers";
type Props = {
  disabled: boolean;
  field: any;
  initialYearRent: number;
  onRemove: (...args: Array<any>) => any;
  managementSubventions: any;
  temporarySubventions: any;
  index: number;
};

const BasisOfRentTemporarySubventionEdit: React.FC<Props> = ({
  disabled,
  field,
  initialYearRent,
  onRemove,
  managementSubventions,
  temporarySubventions,
  index,
}) => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const subventionPercent = useFieldValue(`${field}.subvention_percent`);

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
          <FormField
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
          <FormField
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

export default BasisOfRentTemporarySubventionEdit;
