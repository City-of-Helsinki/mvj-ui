import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
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
import { getReportTypeOptions } from "@/reports/helpers";
import LeaseReportsForm from "@/reports/components/LeaseReportsForm";
import LeaseReportsResults from "@/reports/components/LeaseReportsResults";
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
} from "@/reports/selectors";
import { getReportData } from "@/reports/selectors";
import { getLabelOfOption } from "@/util/helpers";

const LeaseReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const isFetchingUsersPermissions = useAppSelector(
    getIsFetchingUsersPermissions,
  );
  const usersPermissions = useAppSelector(getUsersPermissions);
  const reportData = useAppSelector(getReportData);
  const isFetchingReportData = useAppSelector(getIsFetchingReportData);
  const payload = useAppSelector(getPayload);
  const reports: Reports = useAppSelector(getReports);

  useEffect(() => {
    setPageTitle("Tilastot ja raportit");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.LEASE_REPORTS),
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
          <LeaseReportsForm />
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
            <LeaseReportsResults />
          </GreenBox>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default LeaseReportsPage;
