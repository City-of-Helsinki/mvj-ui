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
import InfillDevelopmentTemplate from './sections/basicInfo/InfillDevelopmentTemplate';
import PageContainer from '$components/content/PageContainer';
import SingleInfillDevelopmentMap from './sections/map/SingleInfillDevelopmentMap';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import {fetchAreaNoteList} from '$src/areaNote/actions';
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
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {
  clearUnsavedChanges,
  getContentInfillDevelopment,
  getContentInfillDevelopmentCopy,
  getContentInfillDevelopmentForDb,
} from '$src/infillDevelopment/helpers';
import {scrollToTopPage} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getAttributes,
  getCurrentInfillDevelopment,
  getIsEditMode,
  getIsFormValidById,
  getIsSaveClicked,
} from '$src/infillDevelopment/selectors';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '$util/storage';

import type {AreaNoteList} from '$src/areaNote/types';
import type {Attributes, InfillDevelopment} from '$src/infillDevelopment/types';
import type {Attributes as LeaseAttributes} from '$src/leases/types';

type Props = {
  areaNotes: AreaNoteList,
  attributes: Attributes,
  change: Function,
  clearFormValidFlags: Function,
  currentInfillDevelopment: InfillDevelopment,
  destroy: Function,
  editInfillDevelopment: Function,
  fetchAreaNoteList: Function,
  fetchInfillDevelopmentAttributes: Function,
  fetchLeaseAttributes: Function,
  fetchSingleInfillDevelopment: Function,
  hideEditMode: Function,
  infillDevelopmentFormValues: Object,
  isEditMode: boolean,
  isFormValid: boolean,
  isInfillDevelopmentFormDirty: boolean,
  isSaveClicked: boolean,
  leaseAttributes: LeaseAttributes,
  location: Object,
  params: Object,
  receiveFormInitialValues: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

type State = {
  activeTab: number,
  currentInfillDevelopment: InfillDevelopment,
  formatedInfillDevelopment: Object,
  isRestoreModalOpen: boolean,
}

class InfillDevelopmentPage extends Component<Props, State> {
  state = {
    activeTab: 0,
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
      areaNotes,
      attributes,
      fetchAreaNoteList,
      fetchInfillDevelopmentAttributes,
      fetchLeaseAttributes,
      fetchSingleInfillDevelopment,
      hideEditMode,
      leaseAttributes,
      location,
      params: {infillDevelopmentId},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });


    if (location.query.tab) {
      this.setState({
        activeTab: location.query.tab,
      });
    }

    if(isEmpty(attributes)) {
      fetchInfillDevelopmentAttributes();
    }

    if(isEmpty(leaseAttributes)) {
      fetchLeaseAttributes();
    }

    fetchSingleInfillDevelopment(infillDevelopmentId);
    receiveIsSaveClicked(false);

    if(isEmpty(areaNotes)) {
      fetchAreaNoteList();
    }

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

  componentDidUpdate(prevProps: Props, prevState: State) {
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

    if (prevProps.location !== this.props.location) {
      this.setState({
        activeTab: this.props.location.query.tab,
      });
    }

    if(prevState.activeTab !== this.state.activeTab) {
      scrollToTopPage();
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

    delete query.lease;
    delete query.tab;

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

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;
    const {router: {location: {query}}} = this.props;

    this.setState({activeTab: tabId}, () => {
      query.tab = tabId;
      return router.push({
        ...location,
        query,
      });
    });
  };

  render() {
    const {
      isEditMode,
      isFormValid,
      isInfillDevelopmentFormDirty,
      isSaveClicked,
    } = this.props;
    const {activeTab} = this.state;

    const {formatedInfillDevelopment, isRestoreModalOpen} = this.state;

    return (
      <div style={{width: '100%'}}>
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

        <PageContainer className='with-small-control-bar'>
          <ConfirmationModal
            confirmButtonLabel='Palauta muutokset'
            isOpen={isRestoreModalOpen}
            label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
            onCancel={this.cancelRestoreUnsavedChanges}
            onClose={this.cancelRestoreUnsavedChanges}
            onSave={this.restoreUnsavedChanges}
            title='Palauta tallentamattomat muutokset'
          />

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {label: 'Perustiedot', isDirty: isInfillDevelopmentFormDirty, hasError: isSaveClicked && !isFormValid},
              {label: 'Kartta'},
            ]}
            onTabClick={this.handleTabClick}
          />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <InfillDevelopmentForm
                    infillDevelopment={formatedInfillDevelopment}
                  />
                  : <InfillDevelopmentTemplate
                    infillDevelopment={formatedInfillDevelopment}
                  />
                }
              </ContentContainer>
            </TabPane>
            <TabPane>
              <ContentContainer>
                <SingleInfillDevelopmentMap />
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        attributes: getAttributes(state),
        currentInfillDevelopment: getCurrentInfillDevelopment(state),
        infillDevelopmentFormValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
        isEditMode: getIsEditMode(state),
        isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
        isInfillDevelopmentFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      editInfillDevelopment,
      fetchAreaNoteList,
      fetchInfillDevelopmentAttributes,
      fetchLeaseAttributes,
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
