import React, { useEffect, useRef } from "react";
import arrayMutators from "final-form-arrays";
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
import { useDispatch, useSelector } from "react-redux";
import { getAttributes, getIsFetchingAttributes } from "@/leases/selectors";
import { fetchAttributes } from "@/leases/actions";
import { createForm, setIn } from "final-form";
import { validateRentBasisForm } from "@/rentbasis/formValidators";

const BasisOfRentCalculatorPage: React.FC = () => {
  const dispatch = useDispatch();
  const isFetchingLeaseAttributes = useSelector(getIsFetchingAttributes);
  const leaseAttributes = useSelector(getAttributes);
  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const usersPermissions = useSelector(getUsersPermissions);

  const leaseBasisOfRentsFormRef = useRef(
    createForm({
      onSubmit: () => {},
      validate: validateRentBasisForm,
      initialValues: {
        basis_of_rents: [{}],
      },
      mutators: {
        ...arrayMutators,
        // Mutator to re-initialize one fieldArray object without re-initializing the whole form.
        rebaseField: ([name, value]: [string, unknown], state: any) => {
          state.formState.values = setIn(state.formState.values, name, value);
          state.formState.initialValues = setIn(
            state.formState.initialValues ?? {},
            name,
            value,
          );
        },
      },
    }),
  );

  useEffect(() => {
    setPageTitle("Vuokralaskuri");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.BASIS_OF_RENT_CALCULATOR),
        pageTitle: "Vuokralaskuri",
        showSearch: false,
      }),
    );
    if (!isFetchingLeaseAttributes && !leaseAttributes) {
      dispatch(fetchAttributes());
    }
  }, [dispatch, isFetchingLeaseAttributes, leaseAttributes]);

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
        <BasisOfRentCalculatorForm formApi={leaseBasisOfRentsFormRef.current} />
      </ContentContainer>
    </PageContainer>
  );
};

export default BasisOfRentCalculatorPage;
