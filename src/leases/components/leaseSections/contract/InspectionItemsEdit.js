// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  largeScreen: boolean,
}

const InspectionItemsEdit = ({attributes, fields, isSaveClicked, largeScreen}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  if(!fields || !fields.length) {
    return (
      <Row>
        <Column>
          <AddButton
            label='Lisää tarkastus'
            onClick={handleAdd}
          />
        </Column>
      </Row>
    );
  }

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <GreenBox>
            {fields && !!fields.length &&
              <BoxItemContainer>
                {largeScreen &&
                  <Row>
                    <Column large={2}>
                      <FormTextTitle
                        title='Tarkastaja'
                        required={get(attributes, 'inspections.child.children.inspector.required')}
                      />
                    </Column>
                    <Column large={2}>
                      <FormTextTitle
                        title='Valvontapvm'
                        required={get(attributes, 'inspections.child.children.supervision_date.required')}
                      />
                    </Column>
                    <Column large={2}>
                      <FormTextTitle
                        title='Valvottu pvm'
                        required={get(attributes, 'inspections.child.children.supervised_date.required')}
                      />
                    </Column>
                    <Column large={6}>
                      <FormTextTitle
                        title='Huomautus'
                        required={get(attributes, 'inspections.child.children.description.required')}
                      />
                    </Column>
                  </Row>
                }

                {fields.map((inspection, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.INSPECTION,
                      confirmationModalTitle: DeleteModalTitles.INSPECTION,
                    });
                  };

                  if(largeScreen) {
                    return (
                      <Row key={index}>
                        <Column large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'inspections.child.children.inspector')}
                            invisibleLabel
                            name={`${inspection}.inspector`}
                            overrideValues={{
                              label: 'Tarkastaja',
                            }}
                          />
                        </Column>
                        <Column large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'inspections.child.children.supervision_date')}
                            invisibleLabel
                            name={`${inspection}.supervision_date`}
                            overrideValues={{
                              label: 'Valvontapvm',
                            }}
                          />
                        </Column>
                        <Column large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'inspections.child.children.supervised_date')}
                            invisibleLabel
                            name={`${inspection}.supervised_date`}
                            overrideValues={{
                              label: 'Valvottu pvm',
                            }}
                          />
                        </Column>
                        <Column large={6}>
                          <FieldAndRemoveButtonWrapper
                            field={
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'inspections.child.children.description')}
                                invisibleLabel
                                name={`${inspection}.description`}
                                overrideValues={{
                                  label: 'Huomautus',
                                }}
                              />
                            }
                            removeButton={
                              <RemoveButton
                                className='third-level'
                                onClick={handleRemove}
                                title="Poista"
                              />
                            }
                          />
                        </Column>
                      </Row>
                    );
                  } else {
                    return (
                      <BoxItem key={index} className='no-border-on-first-child'>
                        <ActionButtonWrapper>
                          <RemoveButton
                            onClick={handleRemove}
                            title="Poista tarkastus"
                          />
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'inspections.child.children.inspector')}
                              name={`${inspection}.inspector`}
                              overrideValues={{
                                label: 'Tarkastaja',
                              }}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'inspections.child.children.supervision_date')}
                              name={`${inspection}.supervision_date`}
                              overrideValues={{
                                label: 'Valvontapvm',
                              }}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'inspections.child.children.supervised_date')}
                              name={`${inspection}.supervised_date`}
                              overrideValues={{
                                label: 'Valvottu pvm',
                              }}
                            />
                          </Column>
                          <Column small={6} medium={12} large={6}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'inspections.child.children.description')}
                              name={`${inspection}.description`}
                              overrideValues={{
                                label: 'Huomautus',
                              }}
                            />
                          </Column>
                        </Row>
                      </BoxItem>
                    );
                  }
                })}
              </BoxItemContainer>
            }
            <Row>
              <Column>
                <AddButtonSecondary
                  label='Lisää tarkastus'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </GreenBox>
        );
      }}
    </AppConsumer>
  );
};

export default withWindowResize(InspectionItemsEdit);
