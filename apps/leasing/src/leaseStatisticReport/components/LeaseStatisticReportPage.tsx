import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import Divider from "@/components/content/Divider";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { PermissionMissingTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import { getReportTypeOptions } from "@/leaseStatisticReport/helpers";
import LeaseStatisticReportForm from "./LeaseStatisticReportForm";
import LeaseInvoicingConfirmationReport from "./LeaseInvoicingConfirmationReport";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import type { Reports } from "types";
import GreenBox from "@/components/content/GreenBox";
import SubTitle from "@/components/content/SubTitle";
import {
  getIsFetchingReportData,
  getPayload,
  getReports,
} from "@/leaseStatisticReport/selectors";
import { getReportData } from "@/leaseStatisticReport/selectors";
import { getLabelOfOption } from "@/util/helpers";

const LeaseStatisticReportPage: React.FC = () => {
  const dispatch = useDispatch();

  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const usersPermissions = useSelector(getUsersPermissions);
  const reportData = useSelector(getReportData);
  const isFetchingReportData = useSelector(getIsFetchingReportData);
  const payload = useSelector(getPayload);
  const reports: Reports = useSelector(getReports);

  useEffect(() => {
    setPageTitle("Tilastot ja raportit");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.LEASE_STATISTIC_REPORT),
        pageTitle: "Tilastot ja raportit",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  const reportTypeOptions = getReportTypeOptions(reports);
  if (isFetchingUsersPermissions)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (isEmpty(usersPermissions)) return null;
  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE))
    return (
      <PageContainer>
        <AuthorizationError
          text={PermissionMissingTexts.STATISTICS_AND_REPORTS}
        />
      </PageContainer>
    );
  return (
    <PageContainer>
      <ContentContainer>
        <h2>RAPORTIT</h2>
        <Divider />
        <GreenBox>
          <LeaseStatisticReportForm />
        </GreenBox>
        {(!!reportData || isFetchingReportData) && (
          <GreenBox className="with-top-margin">
            <SubTitle
              style={{
                textTransform: "uppercase",
              }}
            >
              {getLabelOfOption(reportTypeOptions, payload.report_type)}
            </SubTitle>
            <LeaseInvoicingConfirmationReport />
          </GreenBox>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default LeaseStatisticReportPage;
