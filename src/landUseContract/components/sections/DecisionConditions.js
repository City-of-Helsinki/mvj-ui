// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {formatNumber} from '$util/helpers';

import type {Attributes} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  conditions: Array<Object>,
}

const DecisionConditions = ({attributes, conditions}: Props) => {
  console.log(attributes);
  return (
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>Ehdot</h4>
      }
    >
      <BoxItemContainer>
        {!conditions.length && <p>Ei ehtoja</p>}
        {!!conditions.length && conditions.map((condition, index) => {
          return (
            <BoxItem key={index} className='no-border-on-first-child'>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Hallintamuoto</FormFieldLabel>
                  <p>{condition.management_type || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Ala</FormFieldLabel>
                  <p>{condition.area ? `${formatNumber(condition.area)} k-m²` : '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Vakuus</FormFieldLabel>
                  <p>{condition.deposit ? `${formatNumber(condition.deposit)} €` : '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormFieldLabel>Korvaus</FormFieldLabel>
                  <p>{condition.compensation ? `${formatNumber(condition.compensation)} €` : '-'}</p>
                </Column>
                <Column small={12} medium={8} large={4}>
                  <FormFieldLabel>Huomautus</FormFieldLabel>
                  <p>{condition.note || '-'}</p>
                </Column>
              </Row>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
    </Collapse>
  );
};

export default DecisionConditions;
