// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {change, getFormValues, isDirty} from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import RentBasisEdit from './sections/basicInfo/RentBasisEdit';
import RentBasisInfo from './RentBasisInfo';
import RentBasisReadonly from './sections/basicInfo/RentBasisReadonly';
import SingleRentBasisMap from './sections/map/SingleRentBasisMap';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {
  editRentBasis,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  scrollToTopPage,
} from '$util/helpers';
import {FormNames, RentBasisFieldPaths} from '$src/rentbasis/enums';
import {
  clearUnsavedChanges,
  formatRentBasisForDb,
  getContentCopiedRentBasis,
  getContentRentBasis,
} from '$src/rentbasis/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getIsEditMode,
  getIsFetching,
  getIsFormValid,
  getIsSaveClicked,
  getIsSaving,
  getRentBasis,
} from '$src/rentbasis/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Attributes, Methods} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {RentBasis} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';

type Props = {
  areaNotes: AreaNoteList,
  change: Function,
  editedRentBasis: Object,
  editRentBasis: Function,
  fetchAreaNoteList: Function,
  fetchSingleRentBasis: Function,
  hideEditMode: Function,
  history: Object,
  initializeRentBasis: Function,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // Get via withCommonAttributes HOC
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  location: Object,
  match: {
    params: Object,
  },
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  rentBasisAttributes: Attributes, // Get via withCommonAttributes HOC
  rentBasisMethods: Methods, // Get via withCommonAttributes HOC
  rentBasisData: RentBasis,
  router: Object,
  showEditMode: Function,
}

type State = {
  activeTab: number,
  isCancelModalOpen: boolean,
  isRestoreModalOpen: boolean,
}

class RentBasisPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isCancelModalOpen: false,
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
      fetchSingleRentBasis,
      hideEditMode,
      location: {search},
      match: {params: {rentBasisId}},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    receiveIsSaveClicked(false);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    if(query.tab) {
      this.setState({
        activeTab: query.tab,
      });
    }

    fetchSingleRentBasis(rentBasisId);

    if(isEmpty(areaNotes)) {
      fetchAreaNoteList();
    }

    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      fetchSingleRentBasis,
      location,
      location: {search},
      match: {params: {rentBasisId}},
    } = this.props;

    if(isEmpty(prevProps.rentBasisData) && !isEmpty(this.props.rentBasisData)) {
      const storedContactId = getSessionStorageItem('rentBasisId');
      if(Number(rentBasisId) === storedContactId) {
        this.setState({isRestoreModalOpen: true});
      }
    }

    if (prevProps.location !== location) {
      const query = getUrlParams(search);

      this.setState({
        activeTab: query.tab,
      });
    }

    if(prevState.activeTab !== this.state.activeTab) {
      scrollToTopPage();
    }

    // Fetch rent basis when getting new comment methods and user is authorisized to read content
    if(prevProps.rentBasisMethods !== this.props.rentBasisMethods && this.props.rentBasisMethods.GET) {
      fetchSingleRentBasis(rentBasisId);
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      location: {pathname},
      match: {params: {rentBasisId}},
    } = this.props;

    hideEditMode();
    if(pathname !== `${getRouteById(Routes.RENT_BASIS)}/${rentBasisId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    window.removeEventListener('beforeunload', this.handleLeavePage);
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
      match: {params: {rentBasisId}},
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
    const {
      history,
      initializeRentBasis,
      location: {search},
      rentBasisData,
    } = this.props;
    const rentBasis = getContentCopiedRentBasis(rentBasisData);

    initializeRentBasis(rentBasis);

    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: search,
    });
  }

  saveChanges = () => {
    const {editRentBasis, editedRentBasis, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      editRentBasis(formatRentBasisForDb(editedRentBasis));
    }
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: search,
    });
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    this.setState({isCancelModalOpen: false});
    hideEditMode();
  }

  showEditMode = () => {
    const {initializeRentBasis, rentBasisData, receiveIsSaveClicked, showEditMode} = this.props,
      rentBasis = getContentRentBasis(rentBasisData);

    receiveIsSaveClicked(false);
    initializeRentBasis(rentBasis);
    showEditMode();
    this.startAutoSaveTimer();
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
      isEditMode,
      isFetching,
      isFetchingCommonAttributes,
      isFormDirty,
      isFormValid,
      isSaveClicked,
      isSaving,
      rentBasisData,
      rentBasisAttributes,
      rentBasisMethods,
    } = this.props;
    const {activeTab, isRestoreModalOpen} = this.state;
    const rentBasis = getContentRentBasis(rentBasisData);

    if(isFetching || isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!rentBasisMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.RENT_BASIS} /></PageContainer>;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowCopy={rentBasisMethods.POST}
              allowEdit={rentBasisMethods.PATCH}
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={this.cancelChanges}
              onCopy={this.copyRentBasis}
              onEdit={this.showEditMode}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<RentBasisInfo identifier={rentBasis.id}/>}
          onBack={this.handleBack}
        />

        <PageContainer className='with-control-bar'>
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <Authorization allow={rentBasisMethods.PATCH}>
            <ConfirmationModal
              confirmButtonLabel='Palauta muutokset'
              isOpen={isRestoreModalOpen}
              label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
              onCancel={this.cancelRestoreUnsavedChanges}
              onClose={this.restoreUnsavedChanges}
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
                isDirty: isFormDirty,
                hasError: isSaveClicked && !isFormValid,
              },
              {
                label: 'Kartta',
                allow: isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY),
              },
            ]}
            onTabClick={this.handleTabClick}
          />
          <TabContent active={activeTab}>
            <TabPane>
              {isEditMode
                ? <Authorization
                  allow={rentBasisMethods.PATCH}
                  errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                >
                  <RentBasisEdit />
                </Authorization>
                : <RentBasisReadonly rentBasis={rentBasis} />
              }
            </TabPane>
            <TabPane>
              <Authorization
                allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)}
                errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
              >
                <SingleRentBasisMap />
              </Authorization>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    areaNotes: getAreaNoteList(state),
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state),
    rentBasisData: getRentBasis(state),
  };
};

export default flowRight(
  withCommonAttributes,
  withRouter,
  connect(
    mapStateToProps,
    {
      change,
      editRentBasis,
      fetchAreaNoteList,
      fetchSingleRentBasis,
      hideEditMode,
      initializeRentBasis,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentBasisPage);
