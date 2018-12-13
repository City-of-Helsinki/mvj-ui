// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
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
import {Breakpoints} from '$src/foundation/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  largeScreen: boolean,
}

const FixedInitialYearRentsEdit = ({attributes, fields, isSaveClicked, largeScreen}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };
  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <BoxItemContainer>
              {fields && !!fields.length && largeScreen &&
                <Row>
                  <Column large={2}>
                    <FormTextTitle title='Käyttötarkoitus' />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle title='Kiinteä alkuvuosivuokra' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Alkupvm' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Loppupvm' />
                  </Column>
                </Row>
              }
              {fields && !!fields.length && fields.map((rent, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.FIXED_INITIAL_YEAR_RENT,
                    confirmationModalTitle: DeleteModalTitles.FIXED_INITIAL_YEAR_RENT,
                  });
                };

                if(largeScreen) {
                  return (
                    <Row key={index}>
                      <Column large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                          invisibleLabel={largeScreen}
                          name={`${rent}.intended_use`}
                          overrideValues={{label: 'Käyttötarkoitus'}}
                        />
                      </Column>
                      <Column large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                          invisibleLabel={largeScreen}
                          name={`${rent}.amount`}
                          unit='€'
                          overrideValues={{label: 'Kiinteä alkuvuosivuokra'}}
                        />
                      </Column>
                      <Column large={1}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                          invisibleLabel={largeScreen}
                          name={`${rent}.start_date`}
                          overrideValues={{label: 'Alkupvm'}}
                        />
                      </Column>
                      <Column  large={1}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                          invisibleLabel={largeScreen}
                          name={`${rent}.end_date`}
                          overrideValues={{label: 'Loppupvm'}}
                        />
                      </Column>
                      <Column>
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista alennus/korotus"
                        />
                      </Column>
                    </Row>
                  );
                } else {
                  return (
                    <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <RemoveButton
                            hideFor={Breakpoints.LARGE}
                            onClick={handleRemove}
                            title="Poista kiinteä alkuvuosivuokra"
                          />
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={3} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                              invisibleLabel={largeScreen}
                              name={`${rent}.intended_use`}
                              overrideValues={{label: 'Käyttötarkoitus'}}
                            />
                          </Column>
                          <Column small={6} medium={3} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                              invisibleLabel={largeScreen}
                              name={`${rent}.amount`}
                              unit='€'
                              overrideValues={{label: 'Kiinteä alkuvuosivuokra'}}
                            />
                          </Column>
                          <Column small={6} medium={3} large={1}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                              invisibleLabel={largeScreen}
                              name={`${rent}.start_date`}
                              overrideValues={{label: 'Alkupvm'}}
                            />
                          </Column>

                          <Column  small={6} medium={3} large={1}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                              invisibleLabel={largeScreen}
                              name={`${rent}.end_date`}
                              overrideValues={{label: 'Loppupvm'}}
                            />
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                }
              })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                  label='Lisää kiinteä alkuvuosivuokra'
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

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    },
  ),
)(FixedInitialYearRentsEdit);
