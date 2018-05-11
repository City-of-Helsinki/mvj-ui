// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {change, getFormValues, isDirty} from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import RentBasisEdit from './RentBasisEdit';
import RentBasisInfo from './RentBasisInfo';
import RentBasisReadonly from './RentBasisReadonly';
import {
  editRentBasis,
  fetchAttributes,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  showEditMode,
} from '$src/rentbasis/actions';
import {FormNames} from '$src/rentbasis/enums';
import {
  getAttributes,
  getIsEditMode,
  getIsFetching,
  getIsFormValid,
  getRentBasis,
} from '$src/rentbasis/selectors';
import {clearUnsavedChanges, getContentCopiedRentBasis, getContentRentBasis} from '$src/rentbasis/helpers';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';

import type {Attributes, RentBasis} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  change: Function,
  editedRentBasis: Object,
  editRentBasis: Function,
  fetchAttributes: Function,
  fetchSingleRentBasis: Function,
  hideEditMode: Function,
  initializeRentBasis: Function,
  isEditMode: boolean,
  isFetching: boolean,
  isFormDirty: boolean,
  isFormValid: boolean,
  params: Object,
  receiveTopNavigationSettings: Function,
  rentBasisData: RentBasis,
  router: Object,
  showEditMode: Function,
}

type State = {
  isCancelModalOpen: boolean,
  isRestoreModalOpen: boolean,
}

class RentBasisPage extends Component<Props, State> {
  state = {
    isCancelModalOpen: false,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentWillMount() {
    const {
      attributes,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      params: {rentBasisId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    hideEditMode();

    fetchSingleRentBasis(rentBasisId);

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps) {
    const {params: {rentBasisId}} = this.props;

    if(isEmpty(prevProps.rentBasisData) && !isEmpty(this.props.rentBasisData)) {
      const storedContactId = getSessionStorageItem('rentBasisId');
      if(Number(rentBasisId) === Number(storedContactId)) {
        this.setState({isRestoreModalOpen: true});
      }
    }
    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !this.props.isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    window.removeEventListener('beforeunload', this.handleLeavePage);
    this.stopAutoSaveTimer();
    clearUnsavedChanges();
    hideEditMode();
  }

  handleLeavePage = (e) => {
    const {isEditMode, isFormDirty} = this.props;
    if(isFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  }

  saveUnsavedChanges = () => {
    const {
      editedRentBasis,
      isFormDirty,
      params: {rentBasisId},
    } = this.props;

    if(isFormDirty) {
      setSessionStorageItem(FormNames.RENT_BASIS, editedRentBasis);
      setSessionStorageItem('rentBasisId', rentBasisId);
    } else {
      removeSessionStorageItem(FormNames.RENT_BASIS);
      removeSessionStorageItem('rentBasisId');
    }
  };

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({isRestoreModalOpen: false});
  }

  restoreUnsavedChanges = () => {
    const {initializeRentBasis, rentBasisData, showEditMode} = this.props;

    showEditMode();
    initializeRentBasis(rentBasisData);

    setTimeout(() => {
      const storedFormValues = getSessionStorageItem(FormNames.RENT_BASIS);
      if(storedFormValues) {
        this.bulkChange(FormNames.RENT_BASIS, storedFormValues);
      }

      this.startAutoSaveTimer();
    }, 20);

    this.setState({isRestoreModalOpen: false});
  }

  bulkChange = (formName: string, obj: Object) => {
    const {change} = this.props;
    const fields = Object.keys(obj);
    fields.forEach(field => {
      change(formName, field, obj[field]);
    });
  }

  copyRentBasis = () => {
    const {initializeRentBasis, rentBasisData, router} = this.props;
    const rentBasis = getContentCopiedRentBasis(rentBasisData);
    const {router: {location: {query}}} = this.props;

    initializeRentBasis(rentBasis);

    return router.push({
      pathname: getRouteById('newrentbasis'),
      query,
    });
  }

  editRentBasis = () => {
    const {editRentBasis, editedRentBasis} = this.props;
    editRentBasis(editedRentBasis);
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentbasis')}`,
      query,
    });
  }

  handleCancel = () => {
    const {hideEditMode} = this.props;

    this.setState({isCancelModalOpen: false});
    hideEditMode();
  }

  showEditMode = (rentBasis: Object) => {
    const {initializeRentBasis, showEditMode} = this.props;

    initializeRentBasis(rentBasis);
    showEditMode();
    this.startAutoSaveTimer();
  }

  render() {
    const {
      hideEditMode,
      isEditMode,
      isFetching,
      isFormDirty,
      isFormValid,
      rentBasisData,
    } = this.props;

    const {isCancelModalOpen, isRestoreModalOpen} = this.state;

    const rentBasis = getContentRentBasis(rentBasisData);

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={() => this.setState({isCancelModalOpen: false})}
          onClose={() => this.setState({isCancelModalOpen: false})}
          onSave={this.handleCancel}
          title='Hylkää muutokset'
        />

        <ConfirmationModal
          confirmButtonLabel='Palauta muutokset'
          isOpen={isRestoreModalOpen}
          label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
          onCancel={this.cancelRestoreUnsavedChanges}
          onClose={this.restoreUnsavedChanges}
          onSave={this.restoreUnsavedChanges}
          title='Palauta tallentamattomat muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={!isFormValid}
              onCancelClick={isFormDirty ? () => this.setState({isCancelModalOpen: true}) : hideEditMode}
              onCopyClick={this.copyRentBasis}
              onEditClick={() => this.showEditMode(rentBasis)}
              onSaveClick={this.editRentBasis}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={
            <RentBasisInfo
              identifier={rentBasis.id}
            />
          }
          onBack={this.handleBack}
        />
        {isEditMode
          ? <RentBasisEdit />
          : <RentBasisReadonly
            rentBasis={rentBasis}
          />
        }
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    rentBasisData: getRentBasis(state),
  };
};

export default flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      change,
      editRentBasis,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      initializeRentBasis,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentBasisPage);
