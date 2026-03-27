import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  withRouterLegacy,
  type WithRouterProps,
} from "@/root/withRouterLegacy";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
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
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  isFetchingUsersPermissions: boolean;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  activeTab: number;
};

class BatchJobsPage extends PureComponent<Props & WithRouterProps, State> {
  state = {
    activeTab: 0,
  };

  componentDidMount() {
    const { receiveTopNavigationSettings } = this.props;
    setPageTitle("Eräajot");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.BATCH_RUN),
      pageTitle: "Eräajot",
      showSearch: false,
    });
    this.setStateFromUrl();
    window.addEventListener("popstate", this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
  }

  handlePopState = () => {
    this.setStateFromUrl();
  };
  setStateFromUrl = () => {
    const {
      location: { search },
    } = this.props;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;
    this.setState({
      activeTab: tab,
    });
  };
  handleTabClick = (tab: number) => {
    const {
      navigate,
      location,
      location: { search },
    } = this.props;
    const query = getUrlParams(search);
    this.setState(
      {
        activeTab: tab,
      },
      () => {
        query.tab = tab;
        return navigate({ ...location, search: getSearchQuery(query) });
      },
    );
  };

  render() {
    const { isFetchingUsersPermissions, usersPermissions } = this.props;
    const { activeTab } = this.state;
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
            onTabClick={this.handleTabClick}
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
  }
}

export default flowRight(
  withRouterLegacy,
  connect(
    (state) => {
      return {
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveTopNavigationSettings,
    },
  ),
)(BatchJobsPage) as React.ComponentType;
