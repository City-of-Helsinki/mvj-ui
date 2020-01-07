// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import {ButtonColors} from '$components/enums';
import {ConfirmationModalTexts} from '$src/enums';
import TitleH3 from '$components/content/TitleH3';
import WhiteBox from '$components/content/WhiteBox';
import FileDownloadButton from '$components/file/FileDownloadButton';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {ApplicationFieldPaths, ApplicationFieldTitles} from '$src/property/enums';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {FormNames, ViewModes} from '$src/enums';
import FormField from '$components/form/FormField';
import {
  receiveCollapseStates,
} from '$src/property/actions';
import {
  getCollapseStateByKey,
} from '$src/property/selectors';
import ApplicantEdit from './ApplicantEdit';
import TargetEdit from './TargetEdit';

type ApplicantProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  // leaseAttrobites
  // usersPermissions: UsersPermissionsType,
}

const renderApplicant = ({
  disabled,
  fields,
  formName,
  // usersPermissions,
}: ApplicantProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT, 
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_APPLICANT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_APPLICANT.LABEL, 
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_APPLICANT.TITLE, // TODO jatka tästä: Haluatko varmasti poistaa päätöksen
                });
              };

              return <ApplicantEdit
                key={index}
                disabled={disabled}
                field={field}
                formName={formName}
                onRemove={handleRemove}
              />;
            })}

            {!disabled &&
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää hakija'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type TargetProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  // leaseAttrobites
  // usersPermissions: UsersPermissionsType,
}

const renderTarget = ({
  disabled,
  fields,
  formName,
  // usersPermissions,
}: TargetProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT, 
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_TARGET.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_TARGET.LABEL, 
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_TARGET.TITLE, // TODO Poista kohde
                });
              };

              return <TargetEdit
                key={index}
                disabled={disabled}
                field={field}
                formName={formName}
                onRemove={handleRemove}
              />;
            })}

            {!disabled &&
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää kohde'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  collapseStateBasic: boolean,
  receiveCollapseStates: Function,
  usersPermissions: UsersPermissionsType,
  formName: string,
}

type State = {

}

class ApplicationEdit extends PureComponent<Props, State> {
  state = {
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  render (){
    const {
      collapseStateBasic,
    } = this.props;
  
    return (
      <form>
        <Title uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION)}>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'> {/* TODO wrap columns around authorization */}
          <Column small={12}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={false} // {isSaveClicked && !isEmpty(errors)} // TODO
              headerTitle={ApplicationFieldTitles.APPLICATION_BASE}
              onToggle={this.handleBasicInfoCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION_BASE)}
            >
              <Row>
                <Column large={3}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Hakutyyppi',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`default`}
                    overrideValues={{
                      fieldType: 'checkbox',
                      label: ApplicationFieldTitles.APPLICATION_DEFAULT,
                      options: [{value: 1, label: 'Hakytyypin oletuslomake'}],
                    }}
                    enableUiDataEdit
                    invisibleLabel
                  />
                </Column>
                <Column large={4}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Lomakkeen lisäosat',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`extra`}
                    overrideValues={{
                      fieldType: 'choice',
                      label: ApplicationFieldTitles.APPLICATION_EXTRA,
                      options: [{value: 1, label: 'one'}, {value: 2, label: 'two'}],
                    }}
                    enableUiDataEdit
                  />
                </Column>
              </Row>
              <Row>
                <Column large={3}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Aiemmin luotu lomake',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`previous`}
                    overrideValues={{
                      fieldType: 'checkbox',
                      label: ApplicationFieldTitles.APPLICATION_PREVIOUS,
                      options: [{value: 1, label: 'Aiemmin luotu lomake'}],
                    }}
                    enableUiDataEdit
                    invisibleLabel
                  />
                </Column>
                <Column large={4}>
                  <FormField
                    disableTouched={false} // isSaveClicked} // TODO
                    fieldAttributes={{
                      label: 'Lomakkeen lisäosat',
                      read_only: false,
                      required: false,
                      type: 'string',
                    }} // TODO
                    name={`created`}
                    overrideValues={{
                      fieldType: 'choice',
                      label: ApplicationFieldTitles.APPLICATION_CREATED,
                      options: [{value: 1, label: 'one'}, {value: 2, label: 'two'}],
                    }}
                    enableUiDataEdit
                  />
                </Column>
              </Row>
              <Column className={''} style={{margin: '0 0 10px 0'}}>
                <FileDownloadButton
                  disabled={true}
                  label='ESIKATSELE'
                  payload={{
                  }}
                  url={''} 
                />
              </Column>
              <WhiteBox className='application__white-stripes'> {/* TODO  : make stripes */}
                <TitleH3>
                  {'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}
                </TitleH3>
                <FieldArray
                  component={renderApplicant}
                  // attributes
                  disabled={false}
                  formName={FormNames.PROPERTY_APPLICATION} // TODO formname from form FormNames 
                  name={'applicants'}
                  // usersPermissions={usersPermissions}
                />
                <FieldArray
                  component={renderTarget}
                  // attributes
                  disabled={false}
                  formName={FormNames.PROPERTY_APPLICATION} // TODO formname from form FormNames 
                  name={'targets'}
                  // usersPermissions={usersPermissions}
                />
              </WhiteBox>
            </Collapse>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.PROPERTY_APPLICATION;
// const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_APPLICATION}.basic`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ApplicationEdit);
