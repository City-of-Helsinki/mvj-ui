// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import {getDecisionById, getDecisionOptions} from '$src/decision/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {formatNumber, getReferenceNumberLink} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisions: Array<Object>,
  rentAdjustments: Array<Object>,
}

const RentAdjustments = ({attributes, decisions, rentAdjustments}: Props) => {
  const decisionOptions = getDecisionOptions(decisions);
  const typeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.type');
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.intended_use');
  const amountTypeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.amount_type');

  const getFullAmount = (adjustment: Object) => {
    if(!adjustment.full_amount) {
      return null;
    }

    return `${formatNumber(adjustment.full_amount)} ${getLabelOfOption(amountTypeOptions, adjustment.amount_type)}`;
  };

  return (
    <BoxItemContainer>
      {(!rentAdjustments || !rentAdjustments.length) && <p>Ei alennuksia tai korotuksia</p>}
      {rentAdjustments && !!rentAdjustments.length &&
        rentAdjustments.map((adjustment, index) => {
          const decision = getDecisionById(decisions, adjustment.decision);

          return (
            <BoxItem  className='no-border-on-first-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <label>Tyyppi</label>
                  <p>{getLabelOfOption(typeOptions, adjustment.type) || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Käyttötarkoitus</label>
                  <p>{getLabelOfOption(intendedUseOptions, adjustment.intended_use) || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <label>Alkupvm</label>
                      <p>{formatDate(adjustment.start_date) || '-'}</p>
                    </Column>
                    <Column small={6}>
                      <label>Loppupvm</label>
                      <p>{formatDate(adjustment.end_date) || '-'}</p>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Kokonaismäärä</label>
                  <p>{getFullAmount(adjustment) || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Jäljellä</label>
                  <p>{adjustment.amount_left ? `${formatNumber(adjustment.amount_left)} €` : '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Päätös</label>
                  {decision
                    ? <div>{decision.reference_number
                      ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, adjustment.decision)}</a>
                      : <p>{getLabelOfOption(decisionOptions, adjustment.decision)}</p>
                    }</div>
                    : <p>-</p>
                  }
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Huomautus</label>
                  <p>{adjustment.note || '-'}</p>
                </Column>
              </Row>
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
      attributes: getAttributes(state),
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  }
)(RentAdjustments);
