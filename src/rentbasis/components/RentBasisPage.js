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
  fetchAttributes,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {scrollToTopPage} from '$util/helpers';
import {FormNames} from '$src/rentbasis/enums';
import {
  clearUnsavedChanges,
  formatRentBasisForDb,
  getContentCopiedRentBasis,
  getContentRentBasis,
} from '$src/rentbasis/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {
  getAttributes,
  getIsEditMode,
  getIsFetching,
  getIsFormValid,
  getIsSaveClicked,
  getRentBasis,
} from '$src/rentbasis/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';

import type {AreaNoteList} from '$src/areaNote/types';
import type {Attributes, RentBasis} from '$src/rentbasis/types';
import type {RootState} from '$src/root/types';

type Props = {
  areaNotes: AreaNoteList,
  attributes: Attributes,
  change: Function,
  editedRentBasis: Object,
  editRentBasis: Function,
  fetchAreaNoteList: Function,
  fetchAttributes: Function,
  fetchSingleRentBasis: Function,
  hideEditMode: Function,
  initializeRentBasis: Function,
  isEditMode: boolean,
  isFetching: boolean,
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  location: Object,
  params: Object,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
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
      attributes,
      fetchAreaNoteList,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      location,
      params: {rentBasisId},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    if (location.query.tab) {
      this.setState({
        activeTab: location.query.tab,
      });
    }

    fetchSingleRentBasis(rentBasisId);

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    if(isEmpty(areaNotes)) {
      fetchAreaNoteList();
    }

    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {params: {rentBasisId}} = this.props;

    if(isEmpty(prevProps.rentBasisData) && !isEmpty(this.props.rentBasisData)) {
      const storedContactId = getSessionStorageItem('rentBasisId');
      if(Number(rentBasisId) === storedContactId) {
        this.setState({isRestoreModalOpen: true});
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
      params: {rentBasisId},
      router: {location: {pathname}},
    } = this.props;

    hideEditMode();
    if(pathname !== `${getRouteById('rentBasis')}/${rentBasisId}`) {
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
    const {initializeRentBasis, rentBasisData, router, router: {location: {query}}} = this.props,
      rentBasis = getContentCopiedRentBasis(rentBasisData);

    initializeRentBasis(rentBasis);

    return router.push({
      pathname: getRouteById('newRentBasis'),
      query,
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
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentBasis')}`,
      query,
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
      isFetching,
      isFormDirty,
      isFormValid,
      isSaveClicked,
      rentBasisData,
    } = this.props;
    const {activeTab, isRestoreModalOpen} = this.state;

    const rentBasis = getContentRentBasis(rentBasisData);

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <div style={{width: '100%'}}>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
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
          infoComponent={
            <RentBasisInfo
              identifier={rentBasis.id}
            />
          }
          onBack={this.handleBack}
        />

        <PageContainer className='with-control-bar'>
          <ConfirmationModal
            confirmButtonLabel='Palauta muutokset'
            isOpen={isRestoreModalOpen}
            label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
            onCancel={this.cancelRestoreUnsavedChanges}
            onClose={this.restoreUnsavedChanges}
            onSave={this.restoreUnsavedChanges}
            title='Palauta tallentamattomat muutokset'
          />

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {label: 'Perustiedot', isDirty: isFormDirty, hasError: isSaveClicked && !isFormValid},
              {label: 'Kartta'},
            ]}
            onTabClick={this.handleTabClick}
          />
          <TabContent active={activeTab}>
            <TabPane>
              {isEditMode
                ? <RentBasisEdit />
                : <RentBasisReadonly rentBasis={rentBasis} />
              }
            </TabPane>
            <TabPane>
              <SingleRentBasisMap />
            </TabPane>
          </TabContent>
        </PageContainer>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    areaNotes: getAreaNoteList(state),
    attributes: getAttributes(state),
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
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
      fetchAreaNoteList,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      initializeRentBasis,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentBasisPage);
