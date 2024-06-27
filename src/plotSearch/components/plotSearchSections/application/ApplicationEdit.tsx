import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { reduxForm, formValues } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import TitleH3 from "/src/components/content/TitleH3";
import WhiteBox from "/src/components/content/WhiteBox";
import Collapse from "/src/components/collapse/Collapse";
import Divider from "/src/components/content/Divider";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getUsersPermissions } from "usersPermissions/selectors";
import { ApplicationFieldPaths, ApplicationFieldTitles } from "/src/plotSearch/enums";
import Title from "/src/components/content/Title";
import { FormNames, ViewModes } from "enums";
import FormField from "/src/components/form/FormField";
import { receiveCollapseStates } from "/src/plotSearch/actions";
import { getAttributes, getCollapseStateByKey, getIsSaveClicked, getErrorsByFormName, getIsFetchingTemplateForms, getTemplateForms, getCurrentPlotSearch, getForm, isLockedForModifications } from "/src/plotSearch/selectors";
import EditPlotApplicationSectionModal from "/src/plotSearch/components/plotSearchSections/application/EditPlotApplicationSectionModal";
import Loader from "/src/components/loader/Loader";
import ApplicationPreviewSection from "/src/plotSearch/components/plotSearchSections/application/ApplicationPreviewSection";
import { hasMinimumRequiredFieldsFilled } from "/src/plotSearch/helpers";
import WarningField from "/src/components/form/WarningField";
import { getFormAttributes, getIsFetchingFormAttributes } from "/src/application/selectors";
import { fetchFormAttributes } from "/src/application/actions";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import type { Attributes } from "types";
import type { PlotSearch } from "/src/plotSearch/types";
import type { Form } from "/src/application/types";
type OwnProps = {};
type Props = OwnProps & {
  collapseStateBasic: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  fetchFormAttributes: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  formName: string;
  isSaveClicked: boolean;
  errors: Record<string, any> | null | undefined;
  attributes: Attributes;
  hasMinimumRequiredFieldsFilled: boolean;
  isFetchingFormAttributes: boolean;
  isLockedForModifications: boolean;
  formAttributes: Attributes;
  change: (...args: Array<any>) => any;
  useExistingForm: "0" | "1";
  templateForms: Record<string, any>;
  isFetchingTemplateForms: boolean;
  currentPlotSearch: PlotSearch;
  currentPlotSearchForm: Form;
  formData: Record<string, any>;
};
type State = {
  isModalOpen: boolean;
  modalSectionIndex: number;
};

class ApplicationEdit extends PureComponent<Props, State> {
  state = {
    isModalOpen: false,
    modalSectionIndex: -1
  };

  componentDidMount() {
    const {
      formAttributes,
      formData,
      fetchFormAttributes
    } = this.props;

    if (!formAttributes && formData?.id) {
      fetchFormAttributes(formData?.id);
    }
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {
      receiveCollapseStates
    } = this.props;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val
        }
      }
    });
  };
  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  };
  loadTemplate = newTemplateId => {
    const {
      templateForms,
      fetchFormAttributes,
      change
    } = this.props;
    const template = templateForms.find(templateForm => templateForm.id === newTemplateId);
    change('form', { ...template,
      is_template: undefined
    });
    fetchFormAttributes(template.id);
  };
  replaceTemplate = useExisting => {
    const {
      currentPlotSearchForm,
      change
    } = this.props;

    if (useExisting) {
      change('template', null);
      change('form', { ...currentPlotSearchForm
      });
    } else {
      change('form', null);
    }
  };
  hideEditPlotApplicationSectionModal = () => {
    this.setState({
      isModalOpen: false
    });
  };
  openEditPlotApplicationSectionModal = sectionIndex => {
    this.setState({
      isModalOpen: true,
      modalSectionIndex: sectionIndex
    });
  };

  render() {
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
      isLockedForModifications,
      change
    } = this.props;
    const {
      isModalOpen
    } = this.state;
    const formIdChanged = currentPlotSearch.form?.id !== formData?.id;
    const isReadOnly = !hasMinimumRequiredFieldsFilled || isLockedForModifications || formIdChanged;
    const formOptions = templateForms?.map(templateForm => ({
      value: templateForm.id,
      label: templateForm.title
    })) || [];
    const formTemplateSelect = <FormField disableTouched={isSaveClicked} fieldAttributes={{
      'type': 'field',
      'required': false,
      'read_only': false,
      'label': currentPlotSearch.form !== null ? 'Korvaava lomakepohja' : 'Lomakepohja'
    }} name={`template`} overrideValues={{
      options: formOptions
    }} onChange={(_, newValue) => this.loadTemplate(newValue)} disabled={!hasMinimumRequiredFieldsFilled} />;
    return <>
      <EditPlotApplicationSectionModal isOpen={isModalOpen} onClose={this.hideEditPlotApplicationSectionModal} onSubmit={sectionData => {
        change(`form.sections[${this.state.modalSectionIndex}]`, sectionData);
      }} sectionIndex={this.state.modalSectionIndex} />
      <form>
        <Title uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.APPLICATION)}>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            {!isLockedForModifications && <Collapse defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true} hasErrors={isSaveClicked && !isEmpty(errors)} headerTitle={ApplicationFieldTitles.APPLICATION_TEMPLATE} onToggle={this.handleBasicInfoCollapseToggle}>
              <Row>
                <Column large={6}>
                  {isFetchingTemplateForms ? <Loader isLoading={true} /> : <>
                    {currentPlotSearch.form !== null ? <>
                      <FormField disableTouched={isSaveClicked} fieldAttributes={{
                        required: false,
                        read_only: false,
                        label: 'Lomakepohja',
                        type: 'radio-with-field',
                        choices: []
                      }} name={`useExistingForm`} overrideValues={{
                        options: [{
                          label: 'Käytä aiemmin tallennettua lomaketta',
                          value: '1'
                        }, {
                          label: 'Korvaa uudella lomakepohjalla',
                          value: '0'
                        }]
                      }} onChange={(_, value) => this.replaceTemplate(value === '1')} disabled={!hasMinimumRequiredFieldsFilled} />
                      {useExistingForm === '0' && formTemplateSelect}
                    </> : <>
                      {formTemplateSelect}
                    </>}
                    <WarningField showWarning={formIdChanged} meta={{
                      warning: 'Lomakkeen kenttiä voi muokata vasta, kun lomakepohjan vaihto on vahvistettu tonttihaku tallentamalla.'
                    }} />
                    <WarningField showWarning={!hasMinimumRequiredFieldsFilled} meta={{
                      warning: 'Ole hyvä ja täytä ensin pakolliset perustiedot.'
                    }} />
                  </>}
                </Column>
              </Row>
            </Collapse>}
            {formData !== null && (!formAttributes ? <Loader isLoading={true} /> : <>
                <Collapse defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true} hasErrors={isSaveClicked && !isEmpty(errors)} headerTitle={ApplicationFieldTitles.APPLICATION} onToggle={this.handleBasicInfoCollapseToggle}>
                  <WhiteBox className='application__white-stripes'>
                    <TitleH3>
                      <FormField disableTouched={isSaveClicked} fieldAttributes={get(formAttributes, ApplicationFieldPaths.NAME)} name='form.title' overrideValues={{
                      label: ApplicationFieldTitles.APPLICATION_NAME,
                      allowEdit: !isLockedForModifications
                    }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(ApplicationFieldPaths.NAME)} />
                    </TitleH3>
                  </WhiteBox>
                </Collapse>
                {formData.sections.map((section, index) => <ApplicationPreviewSection section={section} key={index} handleToggle={() => this.handleBasicInfoCollapseToggle(index)} openEditPlotApplicationSectionModal={() => this.openEditPlotApplicationSectionModal(index)} disabled={isReadOnly} />)}
              </>)}
          </Column>
        </Row>
      </form>
    </>;
  }

}

const formName = FormNames.PLOT_SEARCH_APPLICATION;
export default (flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    usersPermissions: getUsersPermissions(state),
    collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_APPLICATION}.basic`),
    isSaveClicked: getIsSaveClicked(state),
    errors: getErrorsByFormName(state, formName),
    formAttributes: getFormAttributes(state),
    isFetchingTemplateForms: getIsFetchingTemplateForms(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
    templateForms: getTemplateForms(state),
    currentPlotSearch: getCurrentPlotSearch(state),
    currentPlotSearchForm: getForm(state),
    hasMinimumRequiredFieldsFilled: hasMinimumRequiredFieldsFilled(state),
    isLockedForModifications: isLockedForModifications(state)
  };
}, {
  receiveCollapseStates,
  fetchFormAttributes
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}), formValues({
  formData: 'form',
  useExistingForm: 'useExistingForm'
}))(ApplicationEdit) as React.ComponentType<OwnProps>);