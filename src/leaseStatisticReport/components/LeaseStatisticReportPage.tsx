import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import ContentContainer from "/src/components/content/ContentContainer";
import Divider from "/src/components/content/Divider";
import Loader from "/src/components/loader/Loader";
import PageContainer from "/src/components/content/PageContainer";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { PermissionMissingTexts } from "enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { hasPermissions, setPageTitle } from "/src/util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getReportTypeOptions } from "/src/leaseStatisticReport/helpers";
import LeaseStatisticReportForm from "./LeaseStatisticReportForm";
import LeaseInvoicingConfirmationReport from "./LeaseInvoicingConfirmationReport";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "/src/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
import type { Reports } from "types";
import GreenBox from "/src/components/content/GreenBox";
import SubTitle from "/src/components/content/SubTitle";
import { getIsFetchingReportData, getPayload, getReports } from "/src/leaseStatisticReport/selectors";
import { getReportData } from "/src/leaseStatisticReport/selectors";
import { getLabelOfOption } from "/src/util/helpers";
type Props = {
  isFetchingUsersPermissions: boolean;
  isFetchingReportData: boolean;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  reportData: Record<string, any>;
  payload: Record<string, any>;
  reports: Reports;
};
type State = {};

class LeaseStatisticReportPage extends PureComponent<Props, State> {
  state = {};

  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Tilastot ja raportit');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASE_STATISTIC_REPORT),
      pageTitle: 'Tilastot ja raportit',
      showSearch: false
    });
  }

  render() {
    const {
      isFetchingUsersPermissions,
      usersPermissions,
      reportData,
      isFetchingReportData,
      payload,
      reports
    } = this.props;
    const reportTypeOptions = getReportTypeOptions(reports);
    if (isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (isEmpty(usersPermissions)) return null;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.STATISTICS_AND_REPORTS} /></PageContainer>;
    return <PageContainer>
        <ContentContainer>
          <h2>RAPORTIT</h2>
          <Divider />
          <GreenBox>
            <LeaseStatisticReportForm />
          </GreenBox>
          {(!!reportData || isFetchingReportData) && <GreenBox className='with-top-margin'>
            <SubTitle style={{
            textTransform: 'uppercase'
          }}>
              {getLabelOfOption(reportTypeOptions, payload.report_type)}
            </SubTitle>
            <LeaseInvoicingConfirmationReport />
          </GreenBox>}

        </ContentContainer>
      </PageContainer>;
  }

}

export default flowRight(withRouter, connect(state => {
  return {
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state),
    reportData: getReportData(state),
    isFetchingReportData: getIsFetchingReportData(state),
    payload: getPayload(state),
    reports: getReports(state)
  };
}, {
  receiveTopNavigationSettings
}))(LeaseStatisticReportPage);