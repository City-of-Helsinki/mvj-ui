// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
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
      {(!rentAdjustments || !rentAdjustments.length) &&
        <FormText>Ei alennuksia tai korotuksia</FormText>
      }
      {rentAdjustments && !!rentAdjustments.length &&
        rentAdjustments.map((adjustment, index) => {
          const decision = getDecisionById(decisions, adjustment.decision);

          return (
            <BoxItem  className='no-border-on-first-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormTitleAndText
                    title='Tyyppi'
                    text={getLabelOfOption(typeOptions, adjustment.type) || '-'}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTitleAndText
                    title='Käyttötarkoitus'
                    text={getLabelOfOption(intendedUseOptions, adjustment.intended_use) || '-'}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <FormTitleAndText
                        title='Alkupvm'
                        text={formatDate(adjustment.start_date) || '-'}
                      />
                    </Column>
                    <Column small={6}>
                      <FormTitleAndText
                        title='Loppupvm'
                        text={formatDate(adjustment.end_date) || '-'}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTitleAndText
                    title='Kokonaismäärä'
                    text={getFullAmount(adjustment) || '-'}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTitleAndText
                    title='Jäljellä'
                    text={adjustment.amount_left ? `${formatNumber(adjustment.amount_left)} €` : '-'}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle title='Päätös' />
                  {decision
                    ? <FormText>{decision.reference_number
                      ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, adjustment.decision)}</a>
                      : getLabelOfOption(decisionOptions, adjustment.decision)
                    }</FormText>
                    : <FormText>-</FormText>
                  }
                </Column>
              </Row>
              <Row>
                <Column>
                  <FormTitleAndText
                    title='Huomautus'
                    text={adjustment.note || '-'}
                  />
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
