import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import Divider from "@/components/content/Divider";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import Search from "@/tradeRegister/components/Search";
import TradeRegisterTemplate from "@/tradeRegister/components/TradeRegisterTemplate";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { PermissionMissingTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  hasPermissions,
  getSearchQuery,
  getUrlParams,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type Props = {
  history: Record<string, any>;
  isFetchingUsersPermissions: boolean;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const TradeRegisterSearchPage: React.FC<Props> = ({
  history,
  isFetchingUsersPermissions,
  location,
  receiveTopNavigationSettings,
  usersPermissions,
}) => {
  const [businessId, setBusinessId] = useState<string>("");
  const [searchFormInitialValues, setSearchFormInitialValues] = useState<Record<string, any>>({});

  // On mount
  useEffect(() => {
    const query = getUrlParams(location.search);
    setPageTitle("Kaupparekisterihaku");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.TRADE_REGISTER),
      pageTitle: "Kaupparekisterihaku",
      showSearch: false,
    });

    if (query.business_id) {
      setBusinessId(query.business_id);
      setSearchFormInitialValues({ business_id: query.business_id });
    } else {
      setSearchFormInitialValues({});
    }
  }, []);

  // On location.search change
  useEffect(() => {
    const query = getUrlParams(location.search);
    setBusinessId(query.business_id || "");
    setSearchFormInitialValues({ business_id: query.business_id || "" });
  }, [location.search]);

  const handleSearchChange = useCallback((query) => {
    setBusinessId(query.business_id);
    setSearchFormInitialValues({ business_id: query.business_id });
    history.push({
      pathname: getRouteById(Routes.TRADE_REGISTER),
      search: getSearchQuery(query),
    });
  }, [history]);

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
        <AuthorizationError text={PermissionMissingTexts.TRADE_REGISTER} />
      </PageContainer>
    );
  return (
    <PageContainer>
      <Row>
        <Column small={12} medium={6} large={8}></Column>
        <Column small={12} medium={6} large={4}>
          <Search
            onSearch={handleSearchChange}
            initialValues={searchFormInitialValues}
          />
        </Column>
      </Row>

      {businessId && (
        <ContentContainer>
          <h2>{businessId}</h2>
          <Divider />

          <TradeRegisterTemplate businessId={businessId} />
        </ContentContainer>
      )}
    </PageContainer>
  );
};

export default flowRight(
  withRouter,
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
)(TradeRegisterSearchPage);
