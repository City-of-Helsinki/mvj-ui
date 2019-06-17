// @flow 
import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import {SteppedDiscountAmountTypeOptions} from '$src/leases/constants';
import {FormNames} from '$src/enums';
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
} from '$src/leases/enums';
import {validateSteppedDiscountForm} from '$src/leases/formValidators';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  decisionOptions: Array<Object>,
  leaseAttributes: Attributes,
}

const SteppedDiscountForm = ({
  decisionOptions,
  leaseAttributes,
}: Props) => {
  return(
    <div>
      <Row>
        <Column small={6} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
            <FormField
              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
              name='intended_use'
              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE}}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
            <FormField
              fieldAttributes={{
                ...getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE),
                required: true,
              }}
              name='start_date'
              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.START_DATE}}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
            <FormField
              fieldAttributes={{
                ...getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE),
                required: true,
              }}
              name='end_date'
              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.END_DATE}}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
            <FormTextTitle
              required={isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT) ||
                isFieldRequired(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
            >
              {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
            </FormTextTitle>

            <Row>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                  <FormField
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}
                    invisibleLabel
                    name='full_amount'
                    overrideValues={{label: LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}>
                  <FormField
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE)}
                    invisibleLabel
                    name='stepped_discount_amount_type'
                    overrideValues={{
                      label: LeaseRentAdjustmentsFieldTitles.AMOUNT_TYPE,
                      options: SteppedDiscountAmountTypeOptions,
                    }}
                  />
                </Authorization>
              </Column>
            </Row>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
            <FormField
              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}
              name='decision'
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
        <Column small={12}>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
            <FormField
              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}
              name='note'
              overrideValues={{label: LeaseRentAdjustmentsFieldTitles.NOTE}}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}
            />
          </Authorization>
        </Column>
      </Row>
    </div>
  );
};

export default flowRight(
  connect(
    (state) => {
      return {
        leaseAttributes: getLeaseAttributes(state),
      };
    }
  ),
  reduxForm({
    form: FormNames.LEASE_STEPPED_DISCOUNT,
    validate: validateSteppedDiscountForm,
  })
)(SteppedDiscountForm);
