import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import RemoveButton from "@/components/form/RemoveButton";
import {
  BasisOfRentManagementSubventionsFieldPaths,
  BasisOfRentManagementSubventionsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  calculateBasisOfRentSubventionAmount,
  calculateBasisOfRentSubventionPercentage,
  calculateSubventionAmountFromPercantage,
} from "@/leases/helpers";
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
import { useForm } from "react-final-form";
import { useFieldValue } from "@/components/helpers";
type Props = {
  currentAmountPerArea: number;
  disabled: boolean;
  field: any;
  initialYearRent: number;
  onRemove: (...args: Array<any>) => any;
};

const BasisOfRentManagementSubventionEdit: React.FC<Props> = ({
  currentAmountPerArea,
  disabled,
  field,
  initialYearRent,
  onRemove,
}) => {
  const form = useForm();
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const subventionAmount = useFieldValue(`${field}.subvention_amount`);

  const onChangeCurrentSubventionAmount = (value: any) => {
    const subventionAmount = calculateSubventionAmountFromPercantage(
      value,
      currentAmountPerArea,
    );
    form.change(`${field}.subvention_amount`, subventionAmount);
  };

  const onChangeCurrentSubventionPercent = (value: any) => {
    const subventionPercent = calculateBasisOfRentSubventionPercentage(
      value,
      currentAmountPerArea,
    );
    form.change(`${field}.subvention_percent`, subventionPercent);
  };

  /* Use current amount per area to calculate percantage */
  const subventionPercent = calculateBasisOfRentSubventionPercentage(
    subventionAmount,
    currentAmountPerArea,
  );

  /* Use initial year rent to calculate subvention total */
  const subventionTotal = calculateBasisOfRentSubventionAmount(
    initialYearRent,
    subventionPercent,
  );
  return (
    <Row>
      <Column small={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
            )}
            name={`${field}.management`}
            disabled={disabled}
            overrideValues={{
              label: BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT,
            }}
            enableUiDataEdit
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            onChange={onChangeCurrentSubventionPercent}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
            )}
            name={`${field}.subvention_amount`}
            disabled={disabled}
            overrideValues={{
              label:
                BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT,
            }}
            unit="€"
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            onChange={onChangeCurrentSubventionAmount}
            fieldAttributes={{
              decimal_places: 2,
              label: "Subventio prosentteina",
              max_digits: 2,
              read_only: false,
              required: false,
              type: "decimal",
            }}
            name={`${field}.subvention_percent`}
            disabled={disabled}
            unit="%"
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <FieldAndRemoveButtonWrapper
          field={
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
              )}
            >
              <FormText className="full-width">
                {formatNumber(subventionTotal, 3)} €
              </FormText>
            </Authorization>
          }
          removeButton={
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.DELETE_MANAGEMENTSUBVENTION,
              )}
            >
              {!disabled && (
                <RemoveButton
                  className="third-level"
                  onClick={onRemove}
                  style={{
                    height: "unset",
                  }}
                  title="Poista hallintamuoto"
                />
              )}
            </Authorization>
          }
        />
      </Column>
    </Row>
  );
};

export default BasisOfRentManagementSubventionEdit;
