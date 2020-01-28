// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

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
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
} from '$src/property/selectors';
import ApplicantEdit from './ApplicantEdit';
import TargetEdit from './TargetEdit';
import type {Attributes} from '$src/types';

type ApplicantProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
  usersPermissions: UsersPermissionsType,
  attributes: Attributes,
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
  isSaveClicked: Boolean,
  usersPermissions: UsersPermissionsType,
  attributes: Attributes,
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
  isSaveClicked: boolean,
  attributes: Attributes,
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
      isSaveClicked,
      attributes,
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
              hasErrors={isSaveClicked} // {isSaveClicked && !isEmpty(errors)} // TODO
              headerTitle={ApplicationFieldTitles.APPLICATION_BASE}
              onToggle={this.handleBasicInfoCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION_BASE)}
            >
              <Row>
                <Column large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'application_base.child.children.default')}
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
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'application_base.child.children.extra')}
                    name={`extra`}
                    overrideValues={{
                      label: ApplicationFieldTitles.APPLICATION_EXTRA,
                    }}
                    enableUiDataEdit
                  />
                </Column>
              </Row>
              <Row>
                <Column large={3}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'application_base.child.children.previous')}
                    name={`previous`}
                    overrideValues={{
                      label: ApplicationFieldTitles.APPLICATION_PREVIOUS,
                    }}
                    enableUiDataEdit
                    invisibleLabel
                  />
                </Column>
                <Column large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'application_base.child.children.created')}
                    name={`created`}
                    overrideValues={{
                      label: ApplicationFieldTitles.APPLICATION_CREATED,
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
              <WhiteBox className='application__white-stripes'>
                <TitleH3>
                  {'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}
                </TitleH3>
                <FieldArray
                  component={renderApplicant}
                  disabled={false}
                  formName={FormNames.PROPERTY_APPLICATION}
                  name={'applicants'}
                />
                <FieldArray
                  component={renderTarget}
                  disabled={false}
                  formName={FormNames.PROPERTY_APPLICATION}
                  name={'targets'}
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

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PROPERTY_APPLICATION}.basic`),
        isSaveClicked: getIsSaveClicked(state),
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
