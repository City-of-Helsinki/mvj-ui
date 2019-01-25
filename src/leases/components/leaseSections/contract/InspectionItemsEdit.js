// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, LeaseInspectionsFieldPaths, LeaseInspectionsFieldTitles} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToRead,
  isFieldAllowedToEdit,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  largeScreen: boolean,
  usersPermissions: UsersPermissionsType,
}

const InspectionItemsEdit = ({
  attributes,
  fields,
  isSaveClicked,
  largeScreen,
  usersPermissions,
}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  if(!fields || !fields.length) {
    return (
      <Authorization
        allow={isFieldAllowedToEdit(attributes, LeaseInspectionsFieldPaths.INSPECTIONS)}
        errorComponent={<FormText className='no-margin'>Ei tarkastuksia tai huomautuksia</FormText>}
      >
        <Row>
          <Column>
            <AddButton
              label='Lisää tarkastus'
              onClick={handleAdd}
            />
          </Column>
        </Row>
      </Authorization>
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
                      <FormTextTitle required={isFieldRequired(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
                        {LeaseInspectionsFieldTitles.INSPECTOR}
                      </FormTextTitle>
                    </Column>
                    <Column large={2}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                        {LeaseInspectionsFieldTitles.SUPERVISION_DATE}
                      </FormTextTitle>
                    </Column>
                    <Column large={2}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                        {LeaseInspectionsFieldTitles.SUPERVISED_DATE}
                      </FormTextTitle>
                    </Column>
                    <Column large={6}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
                        {LeaseInspectionsFieldTitles.DESCRIPTION}
                      </FormTextTitle>
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
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}
                              invisibleLabel
                              name={`${inspection}.inspector`}
                              overrideValues={{label: LeaseInspectionsFieldTitles.INSPECTOR}}
                            />
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}
                              invisibleLabel
                              name={`${inspection}.supervision_date`}
                              overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISION_DATE}}
                            />
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}
                              invisibleLabel
                              name={`${inspection}.supervised_date`}
                              overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISED_DATE}}
                            />
                          </Authorization>
                        </Column>
                        <Column large={6}>
                          <FieldAndRemoveButtonWrapper
                            field={
                              <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
                                <FormField
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}
                                  invisibleLabel
                                  name={`${inspection}.description`}
                                  overrideValues={{label: LeaseInspectionsFieldTitles.DESCRIPTION}}
                                />
                              </Authorization>
                            }
                            removeButton={
                              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INSPECTION)}>
                                <RemoveButton
                                  className='third-level'
                                  onClick={handleRemove}
                                  title="Poista"
                                />
                              </Authorization>
                            }
                          />
                        </Column>
                      </Row>
                    );
                  } else {
                    return (
                      <BoxItem key={index} className='no-border-on-first-child'>
                        <ActionButtonWrapper>
                          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INSPECTION)}>
                            <RemoveButton
                              onClick={handleRemove}
                              title="Poista tarkastus"
                            />
                          </Authorization>
                        </ActionButtonWrapper>
                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}
                                name={`${inspection}.inspector`}
                                overrideValues={{label: LeaseInspectionsFieldTitles.INSPECTOR}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}
                                name={`${inspection}.supervision_date`}
                                overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISION_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}
                                name={`${inspection}.supervised_date`}
                                overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISED_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={12} large={6}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}
                                name={`${inspection}.description`}
                                overrideValues={{label: LeaseInspectionsFieldTitles.DESCRIPTION}}
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxItem>
                    );
                  }
                })}
              </BoxItemContainer>
            }

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INSPECTION)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää tarkastus'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </GreenBox>
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
        isSaveClicked: getIsSaveClicked(state),
        usersPermissions: getUsersPermissions(state),
      };
    }
  )
)(InspectionItemsEdit);
