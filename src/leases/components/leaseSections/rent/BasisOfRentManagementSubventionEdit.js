// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import RemoveButton from '$components/form/RemoveButton';
import {BasisOfRentManagementSubventionsFieldPaths, BasisOfRentManagementSubventionsFieldTitles} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {calculateBasisOfRentSubventionAmount, calculateBasisOfRentSubventionPercantage} from '$src/leases/helpers';
import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  currentAmountPerArea: number,
  disabled: boolean,
  field: any,
  formName: string,
  initialYearRent: number,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  subventionAmount: string,
  usersPermissions: UsersPermissionsType,
}

const BasisOfRentManagementSubventionEdit = ({
  currentAmountPerArea,
  disabled,
  field,
  initialYearRent,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  subventionAmount,
  usersPermissions,
}: Props) => {

  /* Use current amount per area to calculate percantage */
  const subventionPercent = calculateBasisOfRentSubventionPercantage(subventionAmount, currentAmountPerArea);

  /* Use initial year rent to calculate subvention total */
  const subventionTotal = calculateBasisOfRentSubventionAmount(initialYearRent, subventionPercent);

  return (
    <Row>
      <Column small={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}
            name={`${field}.management`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}}
            enableUiDataEdit
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}
            name={`${field}.subvention_amount`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT}}
            unit='€'
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
          <FormText className='full-width'>{formatNumber(subventionPercent)} %</FormText>
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <FieldAndRemoveButtonWrapper
          field={
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
              <FormText className='full-width'>{formatNumber(subventionTotal)} €</FormText>
            </Authorization>
          }
          removeButton={
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_MANAGEMENTSUBVENTION)}>
              {!disabled &&
                <RemoveButton
                  className='third-level'
                  onClick={onRemove}
                  style={{height: 'unset'}}
                  title='Poista hallintamuoto'
                />
              }
            </Authorization>
          }
        />
      </Column>
    </Row>
  );
};

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      isSaveClicked: getIsSaveClicked(state),
      leaseAttributes: getLeaseAttributes(state),
      subventionAmount: selector(state, `${props.field}.subvention_amount`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(BasisOfRentManagementSubventionEdit);
