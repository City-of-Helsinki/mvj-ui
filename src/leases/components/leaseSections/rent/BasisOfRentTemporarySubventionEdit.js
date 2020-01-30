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
import {BasisOfRentTemporarySubventionsFieldPaths, BasisOfRentTemporarySubventionsFieldTitles} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {calculateBasisOfRentSubventionAmountCumulative} from '$src/leases/helpers';
import {formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  initialYearRent: number,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  subventionPercent: string,
  usersPermissions: UsersPermissionsType,
  managementSubventions: Object,
  temporarySubventions: Object,
  index: number,
}

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
  const subventionAmount = calculateBasisOfRentSubventionAmountCumulative(initialYearRent, subventionPercent, managementSubventions, temporarySubventions, index, 'EDIT');

  return (
    <Row>
      <Column small={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}
            name={`${field}.description`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}}
            invisibleLabel
          />
        </Authorization>
      </Column>
      <Column small={4} large={2}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
            name={`${field}.subvention_percent`}
            disabled={disabled}
            overrideValues={{label: BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}}
            unit='%'
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
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
              <FormText className='full-width'>{formatNumber(subventionAmount)} €</FormText>
            </Authorization>
          }
          removeButton={
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_TEMPORARYSUBVENTION)}>
              {!disabled &&
                <RemoveButton
                  className='third-level'
                  onClick={onRemove}
                  title='Poista tilapäisalennus'
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
      subventionPercent: selector(state, `${props.field}.subvention_percent`),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(BasisOfRentTemporarySubventionEdit);
