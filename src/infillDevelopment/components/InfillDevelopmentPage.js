// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {change, destroy, getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import InfillDevelopmentForm from './forms/InfillDevelopmentForm';
import InfillDevelopmentTemplate from './sections/basicInfo/InfillDevelopmentTemplate';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import SingleInfillDevelopmentMap from './sections/map/SingleInfillDevelopmentMap';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {
  clearFormValidFlags,
  editInfillDevelopment,
  fetchSingleInfillDevelopment,
  hideEditMode,
  receiveFormInitialValues,
  receiveSingleInfillDevelopment,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/infillDevelopment/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {FormNames, InfillDevelopmentCompensationLeasesFieldPaths} from '$src/infillDevelopment/enums';
import {
  clearUnsavedChanges,
  getContentInfillDevelopment,
  getContentInfillDevelopmentCopy,
  getContentInfillDevelopmentForDb,
} from '$src/infillDevelopment/helpers';
import {
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getCurrentInfillDevelopment,
  getIsEditMode,
  getIsFetching,
  getIsFormValidById,
  getIsSaveClicked,
  getIsSaving,
} from '$src/infillDevelopment/selectors';
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '$util/storage';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withInfillDevelopmentPageAttributes} from '$components/attributes/InfillDevelopmentPageAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  areaNotes: AreaNoteList,
  change: Function,
  clearFormValidFlags: Function,
  currentInfillDevelopment: InfillDevelopment,
  destroy: Function,
  editInfillDevelopment: Function,
  fetchAreaNoteList: Function,
  fetchSingleInfillDevelopment: Function,
  hideEditMode: Function,
  history: Object,
  infillDevelopmentAttributes: Attributes, // get via withCommonAttributes HOC
  infillDevelopmentFormValues: Object,
  infillDevelopmentMethods: MethodsType, // get via withCommonAttributes HOC
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  isFetchingInfillDevelopmentPageAttributes: boolean, // get via withInfillDevelopmentPageAttributes
  isFormValid: boolean,
  isInfillDevelopmentFormDirty: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  location: Object,
  match: {
    params: Object,
  },
  receiveFormInitialValues: Function,
  receiveSingleInfillDevelopment: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
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
      fetchAreaNoteList,
      fetchSingleInfillDevelopment,
      hideEditMode,
      location: {search},
      match: {params: {infillDevelopmentId}},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    this.setPageTitle();

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false,
    });


    if(query.tab) {
      this.setState({
        activeTab: query.tab,
      });
    }

    receiveIsSaveClicked(false);

    fetchSingleInfillDevelopment(infillDevelopmentId);

    if(isEmpty(areaNotes)) {
      fetchAreaNoteList({});
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
    const {
      currentInfillDevelopment,
      isEditMode,
      location,
      location: {search},
      match: {params: {infillDevelopmentId}},
    } = this.props;
    const {activeTab} = this.state;

    if(prevProps.currentInfillDevelopment !== currentInfillDevelopment) {
      this.setPageTitle();
    }

    if(isEmpty(prevProps.currentInfillDevelopment) && !isEmpty(currentInfillDevelopment)) {
      const storedInfillDevelopmentId = getSessionStorageItem('infillDevelopmentId');

      if(Number(infillDevelopmentId) === storedInfillDevelopmentId) {
        this.setState({
          isRestoreModalOpen: true,
        });
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }

    if (prevProps.location !== location) {
      const query = getUrlParams(search);

      this.setState({
        activeTab: query.tab,
      });
    }

    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      match: {params: {infillDevelopmentId}},
      location: {pathname},
      receiveSingleInfillDevelopment,
    } = this.props;

    if(pathname !== `${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${infillDevelopmentId}`) {
      clearUnsavedChanges();
    }

    this.stopAutoSaveTimer();

    // Clear current infill development compensation
    receiveSingleInfillDevelopment({});

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  setPageTitle = () => {
    const {currentInfillDevelopment} = this.props;
    const name = (currentInfillDevelopment && currentInfillDevelopment.name) || '';

    setPageTitle(`${name
      ? `${name} | `
      : ''}Täydennysrakentamiskorvaus`);
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
      match: {params: {infillDevelopmentId}},
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
      history,
      location: {search},
      receiveFormInitialValues,
    } = this.props;

    const infillDevelopment = {...currentInfillDevelopment};

    infillDevelopment.id = undefined;
    receiveFormInitialValues(getContentInfillDevelopmentCopy(infillDevelopment));
    hideEditMode();
    clearUnsavedChanges();

    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENT_NEW),
      search: search,
    });
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    delete query.lease;
    delete query.tab;

    return history.push({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: getSearchQuery(query),
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
    const {history, location, location: {search}} = this.props;
    const query = getUrlParams(search);

    this.setState({activeTab: tabId}, () => {
      query.tab = tabId;

      return history.push({
        ...location,
        search: getSearchQuery(query),
      });
    });
  };

  render() {
    const {
      infillDevelopmentAttributes,
      infillDevelopmentMethods,
      isEditMode,
      isFetching,
      isFetchingCommonAttributes,
      isFetchingInfillDevelopmentPageAttributes,
      isFormValid,
      isInfillDevelopmentFormDirty,
      isSaveClicked,
      isSaving,
    } = this.props;
    const {activeTab} = this.state;

    const {formatedInfillDevelopment, isRestoreModalOpen} = this.state;

    if(isFetching || isFetchingCommonAttributes || isFetchingInfillDevelopmentPageAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!infillDevelopmentMethods) return null;

    if(!isMethodAllowed(infillDevelopmentMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INFILL_DEVELOPMENT} /></PageContainer>;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowCopy={isMethodAllowed(infillDevelopmentMethods, Methods.POST)}
              allowEdit={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)}
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
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)}>
            <ConfirmationModal
              confirmButtonLabel='Palauta muutokset'
              isOpen={isRestoreModalOpen}
              label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
              onCancel={this.cancelRestoreUnsavedChanges}
              onClose={this.cancelRestoreUnsavedChanges}
              onSave={this.restoreUnsavedChanges}
              title='Palauta tallentamattomat muutokset'
            />
          </Authorization>

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Perustiedot',
                allow: true,
                isDirty: isInfillDevelopmentFormDirty,
                hasError: isSaveClicked && !isFormValid,
              },
              {
                label: 'Kartta',
                allow: isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE),
              },
            ]}
            onTabClick={this.handleTabClick}
          />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL}/>}
                  >
                    <InfillDevelopmentForm infillDevelopment={formatedInfillDevelopment}/>
                  </Authorization>
                  : <InfillDevelopmentTemplate infillDevelopment={formatedInfillDevelopment}/>
                }
              </ContentContainer>
            </TabPane>
            <TabPane>
              <ContentContainer>
                <Authorization
                  allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}
                  errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL}/>}
                >
                  <SingleInfillDevelopmentMap />
                </Authorization>
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withUiDataList,
  withInfillDevelopmentPageAttributes,
  connect(
    (state) => {
      return {
        areaNotes: getAreaNoteList(state),
        currentInfillDevelopment: getCurrentInfillDevelopment(state),
        infillDevelopmentFormValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
        isEditMode: getIsEditMode(state),
        isFetching: getIsFetching(state),
        isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
        isInfillDevelopmentFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
        isSaveClicked: getIsSaveClicked(state),
        isSaving: getIsSaving(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      editInfillDevelopment,
      fetchAreaNoteList,
      fetchSingleInfillDevelopment,
      hideEditMode,
      receiveFormInitialValues,
      receiveSingleInfillDevelopment,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
  withRouter,
)(InfillDevelopmentPage);
