// @flow
import React, {PureComponent, type Element} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, reduxForm} from 'redux-form';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import {getLoggedInUser} from '$src/auth/selectors';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import GreenBox from '$components/content/GreenBox';
import InspectionItemEdit from './InspectionItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {LeaseInspectionsFieldPaths} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  hasPermissions,
  isFieldAllowedToEdit,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import get from 'lodash/get';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type InspectionsProps = {
  fields: any,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
  username: String,
}

const renderInspections = ({
  fields,
  leaseAttributes,
  username,
  usersPermissions,
}: InspectionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({inspector: username});
  };

  if(!fields || !fields.length) {
    return (
      <Authorization
        allow={isFieldAllowedToEdit(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTIONS)}
        errorComponent={<FormText className='no-margin'>Ei tarkastuksia tai huomautuksia</FormText>}
      >
        <Row>
          <Column>
            <AddButtonSecondary
              style={{marginTop: 0}}
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
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_INSPECTION.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_INSPECTION.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_INSPECTION.TITLE,
                    });
                  };

                  return(
                    <InspectionItemEdit
                      key={index}
                      field={field}
                      onRemove={handleRemove}
                    />
                  );
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

type Props = {
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  receiveFormValidFlags: Function,
  user: Object,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

class InspectionsEdit extends PureComponent<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  render() {
    const {
      leaseAttributes,
      usersPermissions,
      user,
    } = this.props;

    return (
      <form>
        <GreenBox>
          <FieldArray
            component={renderInspections}
            leaseAttributes={leaseAttributes}
            name="inspections"
            usersPermissions={usersPermissions}
            username={get(user, 'profile.name')}
          />
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.LEASE_INSPECTIONS;

export default flowRight(
  connect(
    (state) => {
      const user = getLoggedInUser(state);

      if (!user || user.expired) {
        return {
          user: null,
        };
      }
      return {
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
        user,
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);
