// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  rentAdjustments: Array<Object>,
}

const RentAdjustments = ({attributes, decisionOptions, rentAdjustments}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.type');
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.intended_use');
  const amountTypeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.amount_type');

  return (
    <BoxItemContainer>
      {(!rentAdjustments || !rentAdjustments.length) && <p>Ei alennuksia tai korotuksia</p>}
      {rentAdjustments && !!rentAdjustments.length &&
        rentAdjustments.map((adjustment, index) => {
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
                  <p>{adjustment.full_amount} {getLabelOfOption(amountTypeOptions, adjustment.amount_type)}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Jäljellä (€)</label>
                  <p>{adjustment.amount_left || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Päätös</label>
                  <p>{getLabelOfOption(decisionOptions, adjustment.decision) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Kommentti</label>
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

export default RentAdjustments;
