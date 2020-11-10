// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import {ButtonColors} from '$components/enums';
import {ConfirmationModalTexts} from '$src/enums';
import TitleH3 from '$components/content/TitleH3';
import WhiteBox from '$components/content/WhiteBox';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {ApplicationFieldPaths, ApplicationFieldTitles} from '$src/plotSearch/enums';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {FormNames, ViewModes} from '$src/enums';
import FormField from '$components/form/FormField';
import Button from '$components/button/Button';
import {
  receiveCollapseStates,
} from '$src/plotSearch/actions';
import {
  getAttributes,
  getCollapseStateByKey,
  getIsSaveClicked,
  getErrorsByFormName,
} from '$src/plotSearch/selectors';
import ApplicantEdit from './ApplicantEdit';
import TargetEdit from './TargetEdit';
import EditPlotApplicationModal from './EditPlotApplicationModal';
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
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_APPLICANT.TITLE,
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
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_TARGET.TITLE,
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
  errors: ?Object,
  attributes: Attributes,
}

type State = {
  isModalOpen: boolean,
}

class ApplicationEdit extends PureComponent<Props, State> {
  state = {
    isModalOpen: false,
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

  hideEditPlotApplicationModal = () => {
    this.setState({isModalOpen: false});
  }

  openEditPlotApplicationModal = () => {
    this.setState({isModalOpen: true});
  }

  render (){
    const {
      collapseStateBasic,
      isSaveClicked,
      attributes,
      errors,
    } = this.props;
    const {
      isModalOpen,
    } = this.state;
    return (
      <Fragment>
        <EditPlotApplicationModal
          isOpen={isModalOpen}
          onClose={this.hideEditPlotApplicationModal}
          onSubmit={()=>{}}
        />
        <form>
          <Title uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION)}>
            {ApplicationFieldTitles.APPLICATION}
          </Title>
          <Divider />
          <Row className='summary__content-wrapper'>
            <Column small={12}>
              <Collapse
                defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
                hasErrors={isSaveClicked && !isEmpty(errors)}
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
                <WhiteBox className='application__white-stripes'>
                  <Column className={'editPlotApplication'}>
                    <Button
                      className={ButtonColors.PRIMARY}
                      onClick={this.openEditPlotApplicationModal}
                      text='Muokkaa'
                    />
                  </Column>
                  <TitleH3>
                    {'Kruununvuorenrannan kortteleiden 49288 ja 49289 hinta- ja laatukilpailu'}
                  </TitleH3>
                  <FieldArray
                    component={renderApplicant}
                    disabled={false}
                    formName={FormNames.PLOT_SEARCH_APPLICATION}
                    name={'applicants'}
                  />
                  <FieldArray
                    component={renderTarget}
                    disabled={false}
                    formName={FormNames.PLOT_SEARCH_APPLICATION}
                    name={'targets'}
                  />
                </WhiteBox>
              </Collapse>
            </Column>
          </Row>
        </form>
      </Fragment>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_APPLICATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        usersPermissions: getUsersPermissions(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_APPLICATION}.basic`),
        isSaveClicked: getIsSaveClicked(state),
        errors: getErrorsByFormName(state, formName),
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
