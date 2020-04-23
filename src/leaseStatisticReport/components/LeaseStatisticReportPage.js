// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasPermissions, setPageTitle} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';

import LeaseStatisticReportForm from './LeaseStatisticReportForm';
import LeaseInvoicingConfirmationReport from './LeaseInvoicingConfirmationReport';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import GreenBox from '$components/content/GreenBox';
import SubTitle from '$components/content/SubTitle';
import {
  getIsFetchingReportData,
} from '$src/leaseStatisticReport/selectors';
import {
  LeaseStatisticReportTitles,
} from '$src/leaseStatisticReport/enums';
import {
  getReportData,
} from '$src/leaseStatisticReport/selectors';

type Props = {
  isFetchingUsersPermissions: boolean,
  isFetchingReportData: boolean,
  receiveTopNavigationSettings: Function,
  usersPermissions: UsersPermissionsType,
  reportData: Object,
  reportType: String,
};

type State = {
}


class LeaseStatisticReportPage extends PureComponent<Props, State> {
  state = {
  }

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;

    setPageTitle('Tilastot ja raportit');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASE_STATISTIC_REPORT),
      pageTitle: 'Tilastot ja raportit',
      showSearch: false,
    });
  }

  render() {
    const {isFetchingUsersPermissions, usersPermissions, reportData, isFetchingReportData} = this.props;

    if(isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(isEmpty(usersPermissions)) return null;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.STATISTICS_AND_REPORTS} /></PageContainer>;

    return (
      <PageContainer>
        <ContentContainer>
          <h2>RAPORTIT</h2>
          <Divider />
          <GreenBox>
            <SubTitle style={{textTransform: 'uppercase'}} >
              {LeaseStatisticReportTitles.LEASE_STATISTICS_REPORT}
            </SubTitle>
            <LeaseStatisticReportForm/>
          </GreenBox>
          {(!!reportData || isFetchingReportData) && <GreenBox className='with-top-margin'>
            <SubTitle style={{textTransform: 'uppercase'}} >
              Vuokrauksen laskutustietojen tarkastusraportti
            </SubTitle>
            <LeaseInvoicingConfirmationReport/>
          </GreenBox>}

        </ContentContainer>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
        reportData: getReportData(state),
        isFetchingReportData: getIsFetchingReportData(state),
      };
    },
    {
      receiveTopNavigationSettings,
    }
  ),
)(LeaseStatisticReportPage);
