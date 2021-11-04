// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, reduxForm, formValues} from 'redux-form';
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
  getFormAttributes,
  getIsFetchingTemplateForms,
  getTemplateForms,
  getCurrentPlotSearch,
  getForm
} from '$src/plotSearch/selectors';
import ApplicantEdit from './ApplicantEdit';
import TargetEdit from './TargetEdit';
import EditPlotApplicationSectionModal from './EditPlotApplicationSectionModal';
import type {Attributes} from '$src/types';
import Loader from "../../../../components/loader/Loader";
import ApplicationPreviewSection from "./ApplicationPreviewSection";
import {hasMinimumRequiredFieldsFilled} from "../../../helpers";
import WarningField from "../../../../components/form/WarningField";

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
  hasMinimumRequiredFieldsFilled: boolean
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

  loadTemplate = (newTemplateId) => {
    const { templateForms, change } = this.props;

    const template = templateForms.find((templateForm) => templateForm.id === newTemplateId);
    change('form', {
      ...template,
      is_template: undefined
    });
  };

  replaceTemplate = (useExisting) => {
    const { currentPlotSearchForm, change } = this.props;

    if (useExisting) {
      change('template', null);
      change('form', { ...currentPlotSearchForm });
    } else {
      change('form', null);
    }
  };

  hideEditPlotApplicationSectionModal = () => {
    this.setState({isModalOpen: false});
  }

  openEditPlotApplicationSectionModal = (sectionIndex) => {
    this.setState({
      isModalOpen: true,
      modalSectionIndex: sectionIndex
    });
  }

  render (){
    const {
      collapseStateBasic,
      isSaveClicked,
      formAttributes,
      errors,
      templateForms,
      isFetchingTemplateForms,
      currentPlotSearch,
      formData,
      useExistingForm,
      hasMinimumRequiredFieldsFilled,
      change
    } = this.props;

    const {
      isModalOpen,
    } = this.state;

    const formIdChanged = currentPlotSearch.form?.id !== formData?.id;
    const isReadOnly = !hasMinimumRequiredFieldsFilled || formIdChanged;

    const formOptions = templateForms?.map((templateForm) => ({
      value: templateForm.id,
      label: templateForm.title
    })) || [];

    const formTemplateSelect = <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={{
        "type": "field",
        "required": false,
        "read_only": false,
        "label": currentPlotSearch.form !== null ? "Korvaava lomakepohja" : "Lomakepohja"
      }}
      name={`template`}
      overrideValues={{
        options: formOptions
      }}
      onChange={(_, newValue) => this.loadTemplate(newValue)}
      disabled={!hasMinimumRequiredFieldsFilled}
    />;

    return (<>
      <EditPlotApplicationSectionModal
        isOpen={isModalOpen}
        onClose={this.hideEditPlotApplicationSectionModal}
        onSubmit={(sectionData) => {
          change(`form.sections[${this.state.modalSectionIndex}]`, sectionData);
        }}
        sectionIndex={this.state.modalSectionIndex}
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
              headerTitle={ApplicationFieldTitles.APPLICATION_TEMPLATE}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Column large={6}>
                  {isFetchingTemplateForms ? <Loader isLoading={true} /> : <>
                    {currentPlotSearch.form !== null ? <>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={{
                          "required": false,
                          "read_only": false,
                          "label": "Lomakepohja",
                          "type": "radio-with-field",
                          "choices": []
                        }}
                        name={`useExistingForm`}
                        overrideValues={{
                          "options": [
                            {
                              "label": "Käytä aiemmin tallennettua lomaketta",
                              "value": "1"
                            },
                            {
                              "label": "Korvaa uudella lomakepohjalla",
                              "value": "0"
                            }
                          ]
                        }}
                        onChange={(_, value) => this.replaceTemplate(value === '1')}
                        disabled={!hasMinimumRequiredFieldsFilled}
                      />
                      {useExistingForm === "0" && formTemplateSelect}
                      <WarningField showWarning={formIdChanged} meta={{
                        warning: "Lomakkeen kenttiä voi muokata vasta, kun lomakepohjan vaihto on vahvistettu tonttihaku tallentamalla."
                      }} />
                      <WarningField showWarning={!hasMinimumRequiredFieldsFilled} meta={{
                        warning: "Ole hyvä ja täytä ensin pakolliset perustiedot."
                      }} />
                    </> : formTemplateSelect}
                  </>}
                </Column>
              </Row>
            </Collapse>
            {formData !== null && <>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle={ApplicationFieldTitles.APPLICATION}
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <WhiteBox className='application__white-stripes'>
                <TitleH3>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(formAttributes, ApplicationFieldPaths.NAME)}
                    name='form.title'
                    overrideValues={{
                      label: ApplicationFieldTitles.APPLICATION_NAME
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.NAME)}
                  />
                </TitleH3>
                {/* <FieldArray
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
                  />*/}
                </WhiteBox>
              </Collapse>
              {formData.sections.map((section, index) =>
                <ApplicationPreviewSection
                  section={section}
                  key={index}
                  handleToggle={() => this.handleBasicInfoCollapseToggle(index)}
                  openEditPlotApplicationSectionModal={() => this.openEditPlotApplicationSectionModal(index)}
                  disabled={isReadOnly}
                />
              )}
            </>}
          </Column>
        </Row>
      </form>
    </>);
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
        formAttributes: getFormAttributes(state),
        isFetchingTemplateForms: getIsFetchingTemplateForms(state),
        templateForms: getTemplateForms(state),
        currentPlotSearch: getCurrentPlotSearch(state),
        currentPlotSearchForm: getForm(state),
        hasMinimumRequiredFieldsFilled: hasMinimumRequiredFieldsFilled(state)
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
  formValues({
    formData: 'form',
    useExistingForm: 'useExistingForm'
  })
)(ApplicationEdit);
