// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import SubTitle from '$components/content/SubTitle';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import Loader from '$components/loader/Loader';
import {FormNames, ViewModes} from '$src/enums';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FileDownloadButton from '$components/file/FileDownloadButton';
import TitleH3 from '$components/content/TitleH3';
import WhiteBox from '$components/content/WhiteBox';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentPlotSearch,
  getIsFetchingFormAttributes,
  getIsFetchingForm,
  getFormAttributes,
  getForm,
  getIsFetchingTemplateForms
} from '$src/plotSearch/selectors';
import {receiveCollapseStates} from '$src/plotSearch/actions';
import {getContentApplication} from '$src/plotSearch/helpers';
import {ApplicationFieldTitles} from '$src/plotSearch/enums';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {PlotSearch} from '$src/plotSearch/types';
import Applicant from './Applicant';
import Target from './Target';

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentPlotSearch: PlotSearch,
  isFetchingFormAttributes: Boolean,
  ifFetchingForm: Boolean,
  formAttributes: Attributes,
  form: Object,
}

type State = {

}

class Application extends PureComponent<Props, State> {
  state = {
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_APPLICATION]: {
          application: val,
        },
      },
    });
  }

  renderSection = (section: Object) => {
    return (
      <Fragment>
        <Row>
          <Column large={12}>
            <SubTitle>
              {get(section, 'title')}
            </SubTitle>
          </Column>
        </Row>
        <Row>
          {section.fields && section.fields.map(field => this.renderField(field))}
        </Row>
        {section.subsections && section.subsections.map(subsection => this.renderSection(subsection))}
      </Fragment>
    );
  }

  renderField = (field: Object) => {
    switch (field.type) {
      case 'checkbox':
        return (
          <Column small={12} medium={12} large={12}>
            <FormTextTitle>{get(field, 'label')}</FormTextTitle>
            <FormText>{get(field, 'type')}</FormText>
          </Column>
        );
      case 'textarea':
        return (
          <Column small={12} medium={12} large={12}>
            <FormTextTitle>{get(field, 'label')}</FormTextTitle>
            <FormText>{get(field, 'type')}</FormText>
          </Column>
        );
      default:
        return (
          <Column small={6} medium={4} large={3}>
            <FormTextTitle>{get(field, 'label')}</FormTextTitle>
            <FormText>{get(field, 'type')}</FormText>
          </Column>
        );
    }
  }

  render (){
    const {
      // usersPermissions,
      applicationCollapseState,
      attributes,
      currentPlotSearch,
      isFetchingFormAttributes,
      isFetchingForm,
      isFetchingTemplateForms,
      formAttributes,
      form,
    } = this.props;

    const application = getContentApplication(currentPlotSearch);
    const extraOptions = getFieldOptions(attributes, 'application_base.child.children.extra');
    const createdOptions = getFieldOptions(attributes, 'application_base.child.children.created');

    if (isFetchingFormAttributes || isFetchingForm || isFetchingTemplateForms) {
      return <Loader isLoading={true} />;
    }

    return (
      <Fragment>
        <Title>
          {ApplicationFieldTitles.APPLICATION}
        </Title>
        <Divider />
        {form && form.sections.map((section, index) => {
          return (
            <Row className='summary__content-wrapper' key={index}>
              <Column small={12} style={{marginTop: 15}}>
                <Collapse
                  defaultOpen={applicationCollapseState !== undefined ? applicationCollapseState : true}
                  headerTitle={'Osio'}
                  onToggle={this.handleBasicInfoCollapseToggle(index)}
                >
                  {this.renderSection(section)}
                </Collapse>
              </Column>
            </Row>
          );
        })}
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_APPLICATION}.application`),
      attributes: getAttributes(state),
      currentPlotSearch: getCurrentPlotSearch(state),
      isFetchingFormAttributes: getIsFetchingFormAttributes(state),
      isFetchingForm: getIsFetchingForm(state),
      isFetchingTemplateForms: getIsFetchingTemplateForms(state),
      formAttributes: getFormAttributes(state),
      form: getForm(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Application);
