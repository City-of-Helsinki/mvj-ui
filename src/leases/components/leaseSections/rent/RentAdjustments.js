// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import DecisionLink from '$components/links/DecisionLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  RentAdjustmentAmountTypes,
} from '$src/leases/enums';
import {getDecisionById, getDecisionOptions} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  leaseAttributes: Attributes,
  rentAdjustments: Array<Object>,
}

const RentAdjustments = ({currentLease, leaseAttributes, rentAdjustments}: Props) => {
  const decisionOptions = getDecisionOptions(currentLease),
    typeOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE),
    intendedUseOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE),
    amountTypeOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE);

  const getFullAmountText = (adjustment: Object) => {
    if(!adjustment.full_amount) return null;

    return `${formatNumber(adjustment.full_amount)} ${getLabelOfOption(amountTypeOptions, adjustment.amount_type)}`;
  };

  return (
    <BoxItemContainer>
      {(!rentAdjustments || !rentAdjustments.length) && <FormText>Ei alennuksia tai korotuksia</FormText>}

      {rentAdjustments && !!rentAdjustments.length &&
        rentAdjustments.map((adjustment, index) => {
          const decision = getDecisionById(currentLease, adjustment.decision);

          return (
            <BoxItem className='no-border-on-first-child no-border-on-last-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.TYPE)}>
                      {LeaseRentAdjustmentsFieldTitles.TYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(typeOptions, adjustment.type) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                      {LeaseRentAdjustmentsFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(intendedUseOptions, adjustment.intended_use) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                          {LeaseRentAdjustmentsFieldTitles.START_DATE}
                        </FormTextTitle>
                        <FormText>{formatDate(adjustment.start_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                        {adjustment.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                          <Fragment>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                              {LeaseRentAdjustmentsFieldTitles.END_DATE}
                            </FormTextTitle>
                            <FormText>{formatDate(adjustment.end_date) || '-'}</FormText>
                          </Fragment>
                        }
                      </Authorization>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                      {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                    </FormTextTitle>
                    <FormText>{getFullAmountText(adjustment) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                    {adjustment.amount_type === RentAdjustmentAmountTypes.AMOUNT_TOTAL &&
                      <Fragment>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                          {LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}
                        </FormTextTitle>
                        <FormText>{adjustment.amount_left ? `${formatNumber(adjustment.amount_left)} €` : '-'}</FormText>
                      </Fragment>
                    }
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}>
                      {LeaseRentAdjustmentsFieldTitles.DECISION}
                    </FormTextTitle>
                    <DecisionLink
                      decision={decision}
                      decisionOptions={decisionOptions}
                    />
                  </Authorization>
                </Column>
              </Row>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
                <Row>
                  <Column>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.NOTE)}>
                      {LeaseRentAdjustmentsFieldTitles.NOTE}
                    </FormTextTitle>
                    <FormText>{adjustment.note || '-'}</FormText>
                  </Column>
                </Row>
              </Authorization>
            </BoxItem>
          );
        })
      }
    </BoxItemContainer>
  );
};

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      currentLease: currentLease,
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(RentAdjustments);
