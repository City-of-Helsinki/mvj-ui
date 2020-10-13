// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import FullWidthContainer from '$components/content/FullWidthContainer';
import PageContainer from '$components/content/PageContainer';
import {ButtonColors} from '$components/enums';
import Loader from '$components/loader/Loader';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import Tabs from '$components/tabs/Tabs';
import ContentContainer from '$components/content/ContentContainer';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import {withPlotApplicationsAttributes} from '$components/attributes/PlotApplicationsAttributes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById, Routes} from '$src/root/routes';
import {ConfirmationModalTexts, Methods, PermissionMissingTexts} from '$src/enums';
import {
  getIsFetching,
  getCurrentPlotApplication,
  getIsEditMode,
  getIsSaveClicked,
} from '$src/plotApplications/selectors';
import {
  fetchSinglePlotSearch,
  showEditMode,
  receiveIsSaveClicked,
  hideEditMode,
} from '$src/plotApplications/actions';
import type {
  PlotApplication as PlotApplicationType,
} from '$src/plotApplications/types';
import {
  getUrlParams,
  setPageTitle,
  isMethodAllowed,
  getSearchQuery,
  scrollToTopPage,
} from '$util/helpers';
import type {Attributes, Methods as MethodsType} from '$src/types';
import PlotApplicationInfo from './PlotApplicationInfo';
import PlotApplication from './PlotApplication';

type Props = {
  currentPlotApplication: PlotApplicationType,
  fetchSinglePlotSearch: Function,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
  hideEditMode: Function,
  location: Object,
  match: {
    params: Object,
  },
  plotApplicationsMethods: MethodsType,
  plotApplicationsAttributes: Attributes,
  isFetchingPlotApplicationsAttributes: boolean,
  usersPermissions: UsersPermissionsType,
  isFetchingUsersPermissions: boolean,
  isFetching: boolean,
  isEditMode: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  history: Object,
}

type State = {
  activeTab: number,
}

class PlotApplicationsPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
      fetchSinglePlotSearch,
      match: {params: {plotApplicationId}},
      location: {search},
      receiveIsSaveClicked,

    } = this.props;

    const query = getUrlParams(search);

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    receiveIsSaveClicked(false);
    setPageTitle('Test 123');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_SEARCH),
      pageTitle: 'Tonttihakemukset',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    fetchSinglePlotSearch(plotApplicationId);
  }

  handleShowEditMode = () => {
    const {showEditMode, receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(false);
    showEditMode();
  }

  // TODO
  getAreFormsValid = () => {
    return (
      true
    );
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    // Remove page specific url parameters when moving to lease list page
    delete query.tab;
    delete query.lease_area;
    delete query.plan_unit;
    delete query.plot;
    delete query.opened_invoice;


    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}`,
      search: getSearchQuery(query),
    });
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

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {
      location: {search},
    } = this.props;
    const {activeTab} = this.state;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;

    
    if(tab != activeTab) {
      this.setState({activeTab: tab});
    }
    
    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }
  }

  render() {
    const {
      activeTab,
    } = this.state;
    
    const {
      currentPlotApplication,
      isFetchingPlotApplicationsAttributes,
      plotApplicationsMethods,
      plotApplicationsAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
      isFetching,
      isEditMode,
      isSaveClicked,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if(isFetching || isFetchingUsersPermissions || isFetchingPlotApplicationsAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!plotApplicationsAttributes || isEmpty(usersPermissions)) return null;

    if(!plotApplicationsMethods) return null;

    if(!isMethodAllowed(plotApplicationsMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowDelete={isMethodAllowed(plotApplicationsMethods, Methods.DELETE)}
                allowEdit={isMethodAllowed(plotApplicationsMethods, Methods.PATCH)}
                isCancelDisabled={false}
                isCopyDisabled={true}
                isEditDisabled={false}
                isEditMode={isEditMode}
                isSaveDisabled={isSaveClicked && !areFormsValid}
                onCancel={this.cancelChanges}
                onEdit={this.handleShowEditMode}
                onSave={this.saveChanges}
                showCommentButton={false}
                showCopyButton={false}
                onDelete={this.handleDelete}
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.BUTTON,
                  label: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.LABEL,
                  title: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.TITLE,
                }}
              />
            }
            infoComponent={<PlotApplicationInfo title={currentPlotApplication.name}/>}
            onBack={this.handleBack}
          />
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Hakemus',
                allow: true,
                isDirty: false, //isBasicInformationFormDirty,
                hasError: false, // isSaveClicked && !isBasicInformationFormValid,
              },
              {
                label: 'Muutoshistoria',
                allow: true,
              },
            ]}
            onTabClick={this.handleTabClick}
          />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? 'Hakemus edit'
                  : <PlotApplication/>
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {'Muutoshistoria'}
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

export default flowRight(
  withRouter,
  withPlotApplicationsAttributes,
  connect(
    (state) => {
      return {
        currentPlotApplication: getCurrentPlotApplication(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetching(state),
        isEditMode: getIsEditMode(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      fetchSinglePlotSearch,
      receiveTopNavigationSettings,
      showEditMode,
      hideEditMode,
      receiveIsSaveClicked,
    }
  ),
)(PlotApplicationsPage);
