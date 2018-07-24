// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import {getDecisionsOptions} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  decisions: Array<Object>,
  isSaveClicked: boolean,
}

const RentAdjustmentsEdit = ({attributes, decisions, fields, isSaveClicked}: Props) => {
  const decisionOptions = getDecisionsOptions(decisions);

  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((discount, index) => {
          return (
            <BoxItem className='no-border-on-first-child' key={index}>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista alennus/korotus"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.type')}
                      name={`${discount}.type`}
                      overrideValues={{
                        label: 'Tyyppi',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.intended_use')}
                      name={`${discount}.intended_use`}
                      overrideValues={{
                        label: 'Käyttötarkoitus',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Row>
                      <Column small={6}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.start_date')}
                          name={`${discount}.start_date`}
                          overrideValues={{
                            label: 'Alkupvm',
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.end_date')}
                          name={`${discount}.end_date`}
                          overrideValues={{
                            label: 'Loppupvm',
                          }}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Kokonaismäärä</FormFieldLabel>
                    <Row>
                      <Column small={6}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.full_amount')}
                          name={`${discount}.full_amount`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.amount_type')}
                          name={`${discount}.amount_type`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.amount_left')}
                      name={`${discount}.amount_left`}
                      unit='€'
                      overrideValues={{
                        label: 'Jäljellä',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.decision')}
                      name={`${discount}.decision`}
                      overrideValues={{
                        label: 'Päätös',
                        options: decisionOptions,
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={12}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.note')}
                      name={`${discount}.note`}
                      overrideValues={{
                        label: 'Huomautus',
                      }}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää alennus/korotus'
            onClick={() => fields.push({})}
            title='Lisää alennus/korotus'
          />
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      attributes: getAttributes(state),
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  },
)(RentAdjustmentsEdit);
