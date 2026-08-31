import React, { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { isEmpty } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import IndexTable from "./IndexTable";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import { fetchIndexList } from "@/index/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { PermissionMissingTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentYearlyIndexes } from "@/index/helpers";
import { hasPermissions, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import { getIndexList, getIsFetching } from "@/index/selectors";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";

const IndexListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const indexList = useAppSelector(getIndexList);
  const isFetching = useAppSelector(getIsFetching);
  const isFetchingUsersPermissions = useAppSelector(
    getIsFetchingUsersPermissions,
  );
  const usersPermissions = useAppSelector(getUsersPermissions);

  useEffect(() => {
    setPageTitle("Elinkustannusindeksit");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.INDEX),
        pageTitle: "Elinkustannusindeksit",
        showSearch: false,
      }),
    );
    dispatch(
      fetchIndexList({
        limit: 10000,
      }),
    );
  }, [dispatch]);

  const yearlyIndexes = getContentYearlyIndexes(indexList);

  if (isFetching || isFetchingUsersPermissions)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (isEmpty(usersPermissions)) return null;
  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INDEX))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INDEX} />
      </PageContainer>
    );

  return (
    <PageContainer>
      <IndexTable yearlyIndexes={yearlyIndexes} />
    </PageContainer>
  );
};

export default memo(IndexListPage);
