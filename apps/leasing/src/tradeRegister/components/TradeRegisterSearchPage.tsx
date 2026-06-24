import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Row, Column } from "@/components/grid/Grid";
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
import type { RootState } from "@/root/types";

const TradeRegisterSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isFetchingUsersPermissions = useSelector((state: RootState) =>
    getIsFetchingUsersPermissions(state),
  );
  const usersPermissions = useSelector((state: RootState) =>
    getUsersPermissions(state),
  );

  const [businessId, setBusinessId] = useState<string>("");
  const [searchFormInitialValues, setSearchFormInitialValues] = useState<
    Record<string, any>
  >({});

  // On mount
  useEffect(() => {
    setPageTitle("Kaupparekisterihaku");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.TRADE_REGISTER),
        pageTitle: "Kaupparekisterihaku",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  // On location.search change (includes initial mount)
  useEffect(() => {
    const query = getUrlParams(location.search);
    setBusinessId(query.business_id || "");
    setSearchFormInitialValues({ business_id: query.business_id || "" });
  }, [location.search]);

  const handleSearchChange = useCallback(
    (query) => {
      setBusinessId(query.business_id);
      setSearchFormInitialValues({ business_id: query.business_id });
      navigate({
        pathname: getRouteById(Routes.TRADE_REGISTER),
        search: getSearchQuery(query),
      });
    },
    [navigate],
  );

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

export default TradeRegisterSearchPage;
