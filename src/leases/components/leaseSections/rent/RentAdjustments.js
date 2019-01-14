// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {LeaseRentAdjustmentsFieldPaths, LeaseRentAdjustmentsFieldTitles} from '$src/leases/enums';
import {getDecisionById, getDecisionOptions} from '$src/decision/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  decisions: Array<Object>,
  leaseAttributes: Attributes,
  rentAdjustments: Array<Object>,
}

const RentAdjustments = ({decisions, leaseAttributes, rentAdjustments}: Props) => {
  const decisionOptions = getDecisionOptions(decisions),
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
          const decision = getDecisionById(decisions, adjustment.decision);

          return (
            <BoxItem className='no-border-on-first-child no-border-on-last-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.TYPE}</FormTextTitle>
                    <FormText>{getLabelOfOption(typeOptions, adjustment.type) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.INTENDED_USE}</FormTextTitle>
                    <FormText>{getLabelOfOption(intendedUseOptions, adjustment.intended_use) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                        <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.START_DATE}</FormTextTitle>
                        <FormText>{formatDate(adjustment.start_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                        <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.END_DATE}</FormTextTitle>
                        <FormText>{formatDate(adjustment.end_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}</FormTextTitle>
                    <FormText>{getFullAmountText(adjustment) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}</FormTextTitle>
                    <FormText>{adjustment.amount_left ? `${formatNumber(adjustment.amount_left)} €` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.DECISION}</FormTextTitle>
                    {decision
                      ? <FormText>{decision.reference_number
                        ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, adjustment.decision)}</a>
                        : getLabelOfOption(decisionOptions, adjustment.decision)
                      }</FormText>
                      : <FormText>-</FormText>
                    }
                  </Authorization>
                </Column>
              </Row>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
                <Row>
                  <Column>
                    <FormTextTitle>{LeaseRentAdjustmentsFieldTitles.NOTE}</FormTextTitle>
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
      decisions: getDecisionsByLease(state, currentLease.id),
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(RentAdjustments);
