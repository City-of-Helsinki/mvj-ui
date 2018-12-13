// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  fields: any,
  decisions: Array<Object>,
  isSaveClicked: boolean,
}

const RentAdjustmentsEdit = ({attributes, decisions, fields, isSaveClicked}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  const decisionOptions = getDecisionOptions(decisions);

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((discount, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.RENT_ADJUSTMENT,
                    confirmationModalTitle: DeleteModalTitles.RENT_ADJUSTMENT,
                  });
                };

                return (
                  <BoxItem key={index}>
                    <BoxContentWrapper>
                      <ActionButtonWrapper>
                        <RemoveButton
                          onClick={handleRemove}
                          title="Poista alennus/korotus"
                        />
                      </ActionButtonWrapper>
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
                          <FormTextTitle title='Kokonaismäärä' />
                          <Row>
                            <Column small={6}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.full_amount')}
                                invisibleLabel
                                name={`${discount}.full_amount`}
                              />
                            </Column>
                            <Column small={6}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.rent_adjustments.child.children.amount_type')}
                                invisibleLabel
                                name={`${discount}.amount_type`}
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
                  className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                  label='Lisää alennus/korotus'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
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
