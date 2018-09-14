// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {change, destroy, getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import InfillDevelopmentForm from './forms/InfillDevelopmentForm';
import InfillDevelopmentTemplate from './InfillDevelopmentTemplate';
import PageContainer from '$components/content/PageContainer';
import {
  clearFormValidFlags,
  editInfillDevelopment,
  fetchInfillDevelopmentAttributes,
  fetchSingleInfillDevelopment,
  hideEditMode,
  receiveFormInitialValues,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/infillDevelopment/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {
  clearUnsavedChanges,
  getContentInfillDevelopment,
  getContentInfillDevelopmentCopy,
  getContentInfillDevelopmentForDb,
} from '$src/infillDevelopment/helpers';
import {getRouteById} from '$src/root/routes';
import {
  getAttributes,
  getCurrentInfillDevelopment,
  getIsEditMode,
  getIsFormValidById,
  getIsSaveClicked,
} from '$src/infillDevelopment/selectors';
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '$util/storage';

import type {Attributes, InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  attributes: Attributes,
  change: Function,
  clearFormValidFlags: Function,
  currentInfillDevelopment: InfillDevelopment,
  destroy: Function,
  editInfillDevelopment: Function,
  fetchInfillDevelopmentAttributes: Function,
  fetchSingleInfillDevelopment: Function,
  hideEditMode: Function,
  infillDevelopmentFormValues: Object,
  isEditMode: boolean,
  isFormValid: boolean,
  isInfillDevelopmentFormDirty: boolean,
  isSaveClicked: boolean,
  params: Object,
  receiveFormInitialValues: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

type State = {
  currentInfillDevelopment: InfillDevelopment,
  formatedInfillDevelopment: Object,
  isRestoreModalOpen: boolean,
}

class InfillDevelopmentPage extends Component<Props, State> {
  state = {
    formatedInfillDevelopment: {},
    currentInfillDevelopment: {},
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentDidMount() {
    const {
      attributes,
      fetchInfillDevelopmentAttributes,
      fetchSingleInfillDevelopment,
      hideEditMode,
      params: {infillDevelopmentId},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchInfillDevelopmentAttributes();
    }

    fetchSingleInfillDevelopment(infillDevelopmentId);
    receiveIsSaveClicked(false);

    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if(props.currentInfillDevelopment !== state.currentInfillDevelopment) {
      return {
        currentInfillDevelopment: props.currentInfillDevelopment,
        formatedInfillDevelopment: getContentInfillDevelopment(props.currentInfillDevelopment),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {params: {infillDevelopmentId}} = this.props;
    if(isEmpty(prevProps.currentInfillDevelopment) && !isEmpty(this.props.currentInfillDevelopment)) {
      const storedInfillDevelopmentId = getSessionStorageItem('infillDevelopmentId');
      if(Number(infillDevelopmentId) === storedInfillDevelopmentId) {
        this.setState({
          isRestoreModalOpen: true,
        });
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !this.props.isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      params: {infillDevelopmentId},
      router: {location: {pathname}},
    } = this.props;

    if(pathname !== `${getRouteById('infillDevelopment')}/${infillDevelopmentId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    const {isEditMode, isInfillDevelopmentFormDirty} = this.props;
    if(isInfillDevelopmentFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.storeUnsavedChanges(),
      5000
    );
  }

  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  }

  storeUnsavedChanges = () => {
    const {
      infillDevelopmentFormValues,
      isInfillDevelopmentFormDirty,
      params: {infillDevelopmentId},
    } = this.props;

    if(isInfillDevelopmentFormDirty) {
      setSessionStorageItem(FormNames.INFILL_DEVELOPMENT, infillDevelopmentFormValues);
      setSessionStorageItem('infillDevelopmentId', infillDevelopmentId);
    } else {
      removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
      removeSessionStorageItem('infillDevelopmentId');
    }
  };

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({isRestoreModalOpen: false});
  }

  restoreUnsavedChanges = () => {
    const {currentInfillDevelopment, receiveFormInitialValues, showEditMode} = this.props;

    showEditMode();
    receiveFormInitialValues(getContentInfillDevelopment(currentInfillDevelopment));

    setTimeout(() => {
      const storedInfillDevelopmentFormValues = getSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
      if(storedInfillDevelopmentFormValues) {
        this.bulkChange(FormNames.INFILL_DEVELOPMENT, storedInfillDevelopmentFormValues);
      }
    }, 20);

    this.startAutoSaveTimer();

    this.setState({isRestoreModalOpen: false});
  }

  bulkChange = (formName: string, obj: Object) => {
    const {change} = this.props;
    const fields = Object.keys(obj);
    fields.forEach(field => {
      change(formName, field, obj[field]);
    });
  }

  copyInfillDevelopment = () => {
    const {
      currentInfillDevelopment,
      hideEditMode,
      receiveFormInitialValues,
      router,
    } = this.props;
    const {router: {location: {query}}} = this.props;

    const infillDevelopment = {...currentInfillDevelopment};

    infillDevelopment.id = undefined;
    receiveFormInitialValues(getContentInfillDevelopmentCopy(infillDevelopment));
    hideEditMode();
    clearUnsavedChanges();

    return router.push({
      pathname: getRouteById('newInfillDevelopment'),
      query,
    });
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}`,
      query,
    });
  }

  handleShowEditMode = () => {
    const {
      clearFormValidFlags,
      currentInfillDevelopment,
      receiveFormInitialValues,
      receiveIsSaveClicked,
      showEditMode,
    } = this.props;

    receiveIsSaveClicked(false);
    showEditMode();
    clearFormValidFlags();
    this.destroyAllForms();
    receiveFormInitialValues(getContentInfillDevelopment(currentInfillDevelopment));
    this.startAutoSaveTimer();
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  saveChanges = () => {
    const {isFormValid, receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    if(isFormValid) {
      const {currentInfillDevelopment, infillDevelopmentFormValues, editInfillDevelopment} = this.props;

      const editedInfillDevelopment = getContentInfillDevelopmentForDb(infillDevelopmentFormValues);
      editedInfillDevelopment.id = currentInfillDevelopment.id;
      editInfillDevelopment(editedInfillDevelopment);
    }
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.INFILL_DEVELOPMENT);
  }

  render() {
    const {
      isEditMode,
      isFormValid,
      isSaveClicked,
    } = this.props;

    const {formatedInfillDevelopment, isRestoreModalOpen} = this.state;

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Palauta muutokset'
          isOpen={isRestoreModalOpen}
          label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
          onCancel={this.cancelRestoreUnsavedChanges}
          onClose={this.cancelRestoreUnsavedChanges}
          onSave={this.restoreUnsavedChanges}
          title='Palauta tallentamattomat muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCancelDisabled={false}
              isCopyDisabled={false}
              isEditDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={this.cancelChanges}
              onCopy={this.copyInfillDevelopment}
              onEdit={this.handleShowEditMode}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>{formatedInfillDevelopment.name}</h1>}
          onBack={this.handleBack}
        />
        <ContentContainer>
          {isEditMode
            ? <InfillDevelopmentForm infillDevelopment={formatedInfillDevelopment} />
            : <InfillDevelopmentTemplate infillDevelopment={formatedInfillDevelopment} />
          }
        </ContentContainer>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentInfillDevelopment: getCurrentInfillDevelopment(state),
        infillDevelopmentFormValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
        isEditMode: getIsEditMode(state),
        isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
        isInfillDevelopmentFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      editInfillDevelopment,
      fetchInfillDevelopmentAttributes,
      fetchSingleInfillDevelopment,
      hideEditMode,
      receiveFormInitialValues,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
  withRouter,
)(InfillDevelopmentPage);
