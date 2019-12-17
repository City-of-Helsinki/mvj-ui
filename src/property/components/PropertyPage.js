// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Loader from '$components/loader/Loader';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import Tabs from '$components/tabs/Tabs';
import {ButtonColors} from '$components/enums';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import {ConfirmationModalTexts} from '$src/enums';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getIsEditMode,
} from '$src/property/selectors';
import {
  hideEditMode,
  showEditMode,
  fetchSingleProperty,
} from '$src/property/actions';

import {
  getUrlParams,
  getSearchQuery,
  setPageTitle,
} from '$util/helpers';

import type {Attributes} from '$src/types';

import PropertyInfo from './propertySections/propertyInfo/PropertyInfo';
import BasicInfo from './propertySections/basicInfo/BasicInfo';
import BasicInfoEdit from './propertySections/basicInfo/BasicInfoEdit';
// import Application from './propertySections/application/Application';
import ApplicationEdit from './propertySections/application/ApplicationEdit';
import {withPropertyAttributes} from '$components/attributes/PropertyAttributes';

type Props = {
  hideEditMode: Function,
  isEditMode: boolean,
  location: Object,
  history: Object,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
  fetchSingleProperty: Function,
  usersPermissions: UsersPermissionsType,
  isFetchingPropertyAttributes: boolean,
  isFetchingUsersPermissions: boolean,
  propertyAttributes: Attributes,
  match: {
    params: Object,
  },
}

type State = {
  activeTab: number,
}

class PropertyPage extends Component<Props, State> {
  state = {
    activeTab: 0,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
      fetchSingleProperty,
      match: {params: {propertyId}},
    } = this.props;
    
    setPageTitle('Kruununvuorenrannan kortteleiden 49288 ja 49289 laatu- ja hintakilpailu');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PROPERTY),
      pageTitle: 'Tonttihaut',
      showSearch: true,
    });

    fetchSingleProperty(propertyId);

    // hideEditMode(); create action
  }

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
      // scrollToTopPage();
    }
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }
  
  openEditMode = () => {
    const {showEditMode} = this.props;

    // this.destroyAllForms();

    showEditMode();
    // this.startAutoSaveTimer(); TODO
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
      pathname: `${getRouteById(Routes.PROPERTY)}`,
      search: getSearchQuery(query),
    });
  }

  render() {
    const {
      activeTab,
    } = this.state;
    const {
      isEditMode,
      propertyAttributes,
      isFetchingPropertyAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
    } = this.props;

    if(isFetchingPropertyAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!propertyAttributes || isEmpty(usersPermissions)) return null;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowComments={true} // TODO
                allowDelete={true}  // TODO
                allowEdit={true}  // TODO
                commentAmount={0} // TODO
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: ConfirmationModalTexts.DELETE_PROPERTY.BUTTON,
                  label: ConfirmationModalTexts.DELETE_PROPERTY.LABEL,
                  title: ConfirmationModalTexts.DELETE_PROPERTY.TITLE,
                }}
                isCancelDisabled={activeTab == 6}
                isEditDisabled={activeTab == 6}
                isEditMode={isEditMode}
                isSaveDisabled={false}
                onCancel={this.cancelChanges}
                onComment={this.toggleCommentPanel}
                onDelete={this.handleDelete}
                onEdit={this.openEditMode}
                onSave={this.saveChanges}
              />
            }
            infoComponent={<PropertyInfo/>}
            onBack={this.handleBack}
          />

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Perustiedot',
                allow: true,
                /* isDirty: isSummaryFormDirty, // TODO */ 
                /* hasError: isSaveClicked && !isSummaryFormValid, */
              },
              {
                label: 'Hakemuslomake',
                allow: true, // TODO
                /* isDirty: isLeaseAreasFormDirty, // TODO */
                /* hasError: isSaveClicked && !isLeaseAreasFormValid, */
              },
              {
                label: 'Kartta',
                allow: true, // TODO
              },
              {
                label: 'Muutoshistoria',
                allow: true, // TODO
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
                  ? <BasicInfoEdit />
                  : <BasicInfo />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <ApplicationEdit />
                  : null // <Application />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {/* <SingleLeaseMap /> */}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {/* <LeaseAuditLog leaseId={leaseId}/> */}
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
  withPropertyAttributes,
  connect(
    (state) => {
      return {
        isEditMode: getIsEditMode(state),
        usersPermissions: getUsersPermissions(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
      };
    },
    {
      hideEditMode,
      receiveTopNavigationSettings,
      showEditMode,
      fetchSingleProperty,
    }
  ),
)(PropertyPage);
