// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {BasisOfRentTemporarySubventionsFieldPaths, BasisOfRentTemporarySubventionsFieldTitles} from '$src/leases/enums';
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

const BasisOfRentTemporarySubventionEdit = ({
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
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}
            name={`${field}.description`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}}
            enableUiDataEdit
            invisibleLabel
            uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}
          />
        </Authorization>
      </Column>
      <Column small={4} medium={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
            name={`${field}.subvention_percent`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}}
            unit='%'
            invisibleLabel
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
          />
        </Authorization>
      </Column>
      <Column small={2} medium={4} large={2}>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_TEMPORARYSUBVENTION)}>
          {!disabled &&
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              title='Poista tilapäisalennus'
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
)(BasisOfRentTemporarySubventionEdit);
