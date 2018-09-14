// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import InfillDevelopmentForm from './forms/InfillDevelopmentForm';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import {
  clearFormValidFlags,
  createInfillDevelopment,
  fetchInfillDevelopmentAttributes,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/infillDevelopment/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {getContentInfillDevelopmentForDb} from '$src/infillDevelopment/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFormValidById, getIsSaveClicked} from '$src/infillDevelopment/selectors';

import type {RootState} from '$src/root/types';
import type {Attributes} from '../types';

type Props = {
  attributes: Attributes,
  clearFormValidFlags: Function,
  createInfillDevelopment: Function,
  fetchAttributes: Function,
  fetchInfillDevelopmentAttributes: Function,
  formValues: Object,
  hideEditMode: Function,
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

class NewInfillDevelopmentPage extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      clearFormValidFlags,
      fetchInfillDevelopmentAttributes,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakantamiskorvaus',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchInfillDevelopmentAttributes();
    }

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    showEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    const {isFormDirty} = this.props;

    if(isFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}`,
      query,
    });
  }

  cancelChanges = () => {
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('infillDevelopment'),
    });
  }

  saveChanges = () => {
    const {formValues, createInfillDevelopment, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      createInfillDevelopment(getContentInfillDevelopmentForDb(formValues));
    }
  }

  render() {
    const {attributes, isFormValid, isSaveClicked} = this.props;

    return (
      <PageContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={this.cancelChanges}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi täydennysrakentamiskorvaus</h1>}
          onBack={this.handleBack}
        />
        <ContentContainer>
          {isEmpty(attributes) &&
            <Row>
              <Column>
                <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>
              </Column>
            </Row>
          }
          {!isEmpty(attributes) &&
            <InfillDevelopmentForm
              isFocusedOnMount
            />
          }
        </ContentContainer>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    formValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
    isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
    isFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      clearFormValidFlags,
      createInfillDevelopment,
      fetchInfillDevelopmentAttributes,
      hideEditMode,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(NewInfillDevelopmentPage);
