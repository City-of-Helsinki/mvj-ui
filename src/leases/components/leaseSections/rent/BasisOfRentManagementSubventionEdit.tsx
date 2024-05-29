import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { change, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "components/authorization/Authorization";
import FieldAndRemoveButtonWrapper from "components/form/FieldAndRemoveButtonWrapper";
import FormField from "components/form/FormField";
import FormText from "components/form/FormText";
import RemoveButton from "components/form/RemoveButton";
import { BasisOfRentManagementSubventionsFieldPaths, BasisOfRentManagementSubventionsFieldTitles } from "leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { calculateBasisOfRentSubventionAmount, calculateBasisOfRentSubventionPercentage, calculateSubventionAmountFromPercantage } from "leases/helpers";
import { formatNumber, hasPermissions, isFieldAllowedToRead, getFieldAttributes } from "util/helpers";
import { getAttributes as getLeaseAttributes, getIsSaveClicked } from "leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  currentAmountPerArea: number;
  change: (...args: Array<any>) => any;
  disabled: boolean;
  field: any;
  formName: string;
  initialYearRent: number;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  subventionAmount: string;
  usersPermissions: UsersPermissionsType;
};
type State = {};

class BasisOfRentManagementSubventionEdit extends PureComponent<Props, State> {
  componentDidMount() {
    const {
      change,
      currentAmountPerArea,
      formName,
      field,
      subventionAmount
    } = this.props;
    const subventionPercent = calculateBasisOfRentSubventionPercentage(subventionAmount, currentAmountPerArea);
    change(formName, `${field}.subvention_percent`, subventionPercent);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      change,
      currentAmountPerArea,
      formName,
      field,
      subventionAmount
    } = this.props;

    if (currentAmountPerArea !== prevProps.currentAmountPerArea) {
      const subventionPercent = calculateBasisOfRentSubventionPercentage(subventionAmount, currentAmountPerArea);
      change(formName, `${field}.subvention_percent`, subventionPercent);
    }
  }

  onChangeCurrentSubventionAmount = (value: any) => {
    const {
      change,
      currentAmountPerArea,
      formName,
      field
    } = this.props;
    const subventionAmount = calculateSubventionAmountFromPercantage(value, currentAmountPerArea);
    change(formName, `${field}.subvention_amount`, subventionAmount);
  };
  onChangeCurrentSubventionPercent = (value: any) => {
    const {
      change,
      currentAmountPerArea,
      formName,
      field
    } = this.props;
    const subventionPercent = calculateBasisOfRentSubventionPercentage(value, currentAmountPerArea);
    change(formName, `${field}.subvention_percent`, subventionPercent);
  };

  render() {
    const {
      currentAmountPerArea,
      disabled,
      field,
      initialYearRent,
      isSaveClicked,
      leaseAttributes,
      onRemove,
      subventionAmount,
      usersPermissions
    } = this.props;

    /* Use current amount per area to calculate percantage */
    const subventionPercent = calculateBasisOfRentSubventionPercentage(subventionAmount, currentAmountPerArea);

    /* Use initial year rent to calculate subvention total */
    const subventionTotal = calculateBasisOfRentSubventionAmount(initialYearRent, subventionPercent);
    return <Row>
        <Column small={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
            <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)} name={`${field}.management`} disabled={disabled} overrideValues={{
            label: BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT
          }} enableUiDataEdit invisibleLabel />
          </Authorization>
        </Column>
        <Column small={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
            <FormField disableTouched={isSaveClicked} onChange={this.onChangeCurrentSubventionPercent} fieldAttributes={getFieldAttributes(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)} name={`${field}.subvention_amount`} disabled={disabled} overrideValues={{
            label: BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT
          }} unit='€' invisibleLabel />
          </Authorization>
        </Column>
        <Column small={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
            <FormField disableTouched={isSaveClicked} onChange={this.onChangeCurrentSubventionAmount} fieldAttributes={{
            decimal_places: 2,
            label: 'Subventio prosentteina',
            max_digits: 2,
            read_only: false,
            required: false,
            type: 'decimal'
          }} name={`${field}.subvention_percent`} disabled={disabled} unit='%' invisibleLabel />
          </Authorization>
        </Column>
        <Column small={4} large={2}>
          <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                <FormText className='full-width'>{formatNumber(subventionTotal, 3)} €</FormText>
              </Authorization>} removeButton={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_MANAGEMENTSUBVENTION)}>
                {!disabled && <RemoveButton className='third-level' onClick={onRemove} style={{
            height: 'unset'
          }} title='Poista hallintamuoto' />}
              </Authorization>} />
        </Column>
      </Row>;
  }

}

export default connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    isSaveClicked: getIsSaveClicked(state),
    leaseAttributes: getLeaseAttributes(state),
    subventionAmount: selector(state, `${props.field}.subvention_amount`),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  change
})(BasisOfRentManagementSubventionEdit);