import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import BasisOfRentCalculatorForm from "./BasisOfRentCalculatorForm";
import ContentContainer from "@/components/content/ContentContainer";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { PermissionMissingTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import { getIsFetchingAttributes } from "@/leases/selectors";

const BasisOfRentCalculatorPage: React.FC = () => {
  const dispatch = useDispatch();
  const isFetchingLeaseAttributes = useSelector(getIsFetchingAttributes);
  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const usersPermissions = useSelector(getUsersPermissions);

  useEffect(() => {
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.BASIS_OF_RENT_CALCULATOR),
        pageTitle: "Vuokralaskuri",
        showSearch: false,
      }),
    );
    setPageTitle("Vuokralaskuri");
  }, [dispatch]);

  if (isFetchingLeaseAttributes || isFetchingUsersPermissions)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!usersPermissions) return null;
  if (!hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT))
    return (
      <PageContainer>
        <AuthorizationError
          text={PermissionMissingTexts.BASIS_OF_RENT_CALCULATOR}
        />
      </PageContainer>
    );
  return (
    <PageContainer hasTabs>
      <ContentContainer>
        <BasisOfRentCalculatorForm
          initialValues={{
            basis_of_rents: [{}],
          }}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default BasisOfRentCalculatorPage;
