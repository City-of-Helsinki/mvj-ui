import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FormField from "@/components/form/final-form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import {
  RentAdjustmentManagementSubventionsFieldPaths,
  RentAdjustmentManagementSubventionsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
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
  field: any;
  onRemove: (...args: Array<any>) => any;
};

const RentAdjustmentManagementSubventionEdit: React.FC<Props> = ({
  field,
  onRemove,
}: Props) => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  return (
    <Row>
      <Column small={6} medium={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
            )}
            name={`${field}.management`}
            overrideValues={{
              label: RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT,
            }}
            enableUiDataEdit
            invisibleLabel
            uiDataKey={getUiDataLeaseKey(
              RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
            )}
          />
        </Authorization>
      </Column>
      <Column small={4} medium={4} large={2}>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
          )}
        >
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(
              leaseAttributes,
              RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
            )}
            name={`${field}.subvention_amount`}
            overrideValues={{
              label:
                RentAdjustmentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT,
            }}
            unit="%"
            invisibleLabel
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
            )}
          />
        </Authorization>
      </Column>
      <Column small={2} medium={4} large={2}>
        <Authorization
          allow={hasPermissions(
            usersPermissions,
            UsersPermissions.DELETE_MANAGEMENTSUBVENTION,
          )}
        >
          <RemoveButton
            className="third-level"
            onClick={onRemove}
            title="Poista hallintamuoto"
          />
        </Authorization>
      </Column>
    </Row>
  );
};

export default RentAdjustmentManagementSubventionEdit;
