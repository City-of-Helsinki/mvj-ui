import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { isEmpty } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import Divider from "@/components/content/Divider";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import JobRuns from "@/batchrun/components/JobRuns";
import Loader from "@/components/loader/Loader";
import ScheduledJobs from "@/batchrun/components/ScheduledJobs";
import Tabs from "@/components/tabs/Tabs";
import TabContent from "@/components/tabs/TabContent";
import TabPane from "@/components/tabs/TabPane";
import Title from "@/components/content/Title";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { PermissionMissingTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";

const BatchJobsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const { tab } = getUrlParams(search);
  const parsedTab = Number(tab);
  const activeTab = tab != null && !Number.isNaN(parsedTab) ? parsedTab : 0;

  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const usersPermissions = useSelector(getUsersPermissions);

  useEffect(() => {
    setPageTitle("Eräajot");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.BATCH_RUN),
        pageTitle: "Eräajot",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  const handleTabClick = (tab: number) => {
    return navigate({
      ...location,
      search: getSearchQuery({ tab }),
    });
  };

  if (isFetchingUsersPermissions)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (isEmpty(usersPermissions)) return null;
  if (
    !hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN) &&
    !hasPermissions(usersPermissions, UsersPermissions.VIEW_SCHEDULEDJOB)
  )
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.BATCHRUN} />
      </PageContainer>
    );
  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <Tabs
          active={activeTab}
          tabs={[
            {
              label: "Ajot",
              allow: true,
            },
            {
              label: "Ajastukset",
              allow: true,
            },
          ]}
          onTabClick={handleTabClick}
        />
      </PageNavigationWrapper>

      <PageContainer className="with-tabs" hasTabs>
        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              <Title>Ajot</Title>
              <Divider />

              <JobRuns />
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <Title>Ajastukset</Title>
              <Divider />

              <ScheduledJobs />
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default memo(BatchJobsPage);
