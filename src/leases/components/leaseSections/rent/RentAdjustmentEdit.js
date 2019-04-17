// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import DecisionLink from '$components/links/DecisionLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/enums';
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  RentAdjustmentAmountTypes,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getDecisionById} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  amountType: ?string,
  amountTypeOptions: Array<Object>,
  currentLease:Lease,
  decisionOptions: Array<Object>,
  field: string,
  fullAmount: ?number,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const RentAdjustmentsEdit = ({
  amountType,
  amountTypeOptions,
  currentLease,
  decisionOptions,
  field,
  fullAmount,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  usersPermissions,
}: Props) => {
  const decisionReadOnlyRenderer = (value: ?number) => {
    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
  };

  const getFullAmountText = () => {
    if(!fullAmount) return null;

    return `${formatNumber(fullAmount)} ${getLabelOfOption(amountTypeOptions, amountType)}`;
  };

  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_RENTADJUSTMENT)}>
            <RemoveButton
              onClick={onRemove}
              title="Poista alennus/korotus"
            />
          </Authorization>
        </ActionButtonWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}
                name={`${field}.type`}
                overrideValues={{label: LeaseRentAdjustmentsFieldTitles.TYPE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.TYPE)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
                name={`${field}.intended_use`}
                overrideValues={{label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}
                    name={`${field}.start_date`}
                    overrideValues={{label: LeaseRentAdjustmentsFieldTitles.START_DATE}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                  {amountType !== RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}
                      name={`${field}.end_date`}
                      overrideValues={{label: LeaseRentAdjustmentsFieldTitles.END_DATE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}
                    />
                  }
                </Authorization>
              </Column>
            </Row>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
              <FormTextTitle
                required={isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
              >
                {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
              </FormTextTitle>

              <Row>
                <Authorization
                  allow={
                    isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT) ||
                    isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)
                  }
                  errorComponent={<Column><FormText>{getFullAmountText()}</FormText></Column>}
                >
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                        invisibleLabel
                        name={`${field}.full_amount`}
                        overrideValues={{label: LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}
                        invisibleLabel
                        name={`${field}.amount_type`}
                        overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_TYPE}}
                      />
                    </Authorization>
                  </Column>
                </Authorization>
              </Row>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
              {amountType === RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                  name={`${field}.amount_left`}
                  unit='€'
                  overrideValues={{label: LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}}
                  enableUiDataEdit
                  tooltipStyle={{right: 12}}
                  uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}
                />
              }
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}
                name={`${field}.decision`}
                readOnlyValueRenderer={decisionReadOnlyRenderer}
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.DECISION,
                  options: decisionOptions,

                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column medium={12}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}
                name={`${field}.note`}
                overrideValues={{label: LeaseRentAdjustmentsFieldTitles.NOTE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.NOTE)}
              />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      amountType: selector(state, `${props.field}.amount_type`),
      currentLease: getCurrentLease(state),
      fullAmount: selector(state, `${props.field}.full_amount`),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(RentAdjustmentsEdit);
