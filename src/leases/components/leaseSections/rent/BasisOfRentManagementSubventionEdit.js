// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {BasisOfRentManagementSubventionsFieldPaths, BasisOfRentManagementSubventionsFieldTitles} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  disabled: boolean,
  field: any,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const BasisOfRentManagementSubventionEdit = ({
  disabled,
  field,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  usersPermissions,
}: Props) => {
  return (
    <Row>
      <Column small={6} medium={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}
            name={`${field}.management`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}}
            enableUiDataEdit
            invisibleLabel
            uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}
          />
        </Authorization>
      </Column>
      <Column small={4} medium={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}
            name={`${field}.subvention_percent`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}}
            unit='%'
            invisibleLabel
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}
          />
        </Authorization>
      </Column>
      <Column small={2} medium={4} large={2}>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_MANAGEMENTSUBVENTION)}>
          {!disabled &&
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              title='Poista hallintamuoto'
            />
          }
        </Authorization>
      </Column>
    </Row>
  );
};

export default connect(
  (state) => {
    return {
      isSaveClicked: getIsSaveClicked(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(BasisOfRentManagementSubventionEdit);
