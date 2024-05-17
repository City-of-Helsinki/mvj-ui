import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "src/components/authorization/Authorization";
import FormField from "src/components/form/FormField";
import RemoveButton from "src/components/form/RemoveButton";
import { RentAdjustmentTemporarySubventionsFieldPaths, RentAdjustmentTemporarySubventionsFieldTitles } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getUiDataLeaseKey } from "src/uiData/helpers";
import { hasPermissions, isFieldAllowedToRead, getFieldAttributes } from "src/util/helpers";
import { getAttributes as getLeaseAttributes, getIsSaveClicked } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import type { Attributes } from "src/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  field: any;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const RentAdjustmentTemporarySubventionEdit = ({
  field,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  usersPermissions
}: Props) => {
  return <Row>
      <Column small={6} medium={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)} name={`${field}.description`} overrideValues={{
          label: RentAdjustmentTemporarySubventionsFieldTitles.DESCRIPTION
        }} enableUiDataEdit invisibleLabel uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)} />
        </Authorization>
      </Column>
      <Column small={4} medium={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)} name={`${field}.subvention_percent`} overrideValues={{
          label: RentAdjustmentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT
        }} unit='%' invisibleLabel enableUiDataEdit uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)} />
        </Authorization>
      </Column>
      <Column small={2} medium={4} large={2}>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_TEMPORARYSUBVENTION)}>
          <RemoveButton className='third-level' onClick={onRemove} title='Poista tilapäisalennus' />
        </Authorization>
      </Column>
    </Row>;
};

export default connect(state => {
  return {
    isSaveClicked: getIsSaveClicked(state),
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
})(RentAdjustmentTemporarySubventionEdit);