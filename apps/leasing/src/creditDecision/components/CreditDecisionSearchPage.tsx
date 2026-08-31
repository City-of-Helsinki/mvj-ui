import React, { Fragment, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useNavigate, useLocation } from "react-router";
import { isEmpty } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import Divider from "@/components/content/Divider";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import SearchForm from "@/creditDecision/components/SearchForm";
import { SanctionsCheckForm } from "@/creditDecision/components/SanctionsCheckForm";
import CreditDecisionTemplate from "@/creditDecision/components/CreditDecisionTemplate";
import { ContactTypes } from "@/contacts/enums";
import { CreditDecisionText, SanctionsCheckText } from "@/creditDecision/enums";
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

const CreditDecisionSearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isFetchingUsersPermissions = useAppSelector(
    getIsFetchingUsersPermissions,
  );
  const usersPermissions = useAppSelector(getUsersPermissions);

  const query = useMemo(() => getUrlParams(location.search), [location.search]);
  const contactType = query.contact_type || "";
  const keyword = query.keyword || "";
  const searchFormInitialValues = useMemo(
    () => ({
      contact_type: contactType,
      keyword: keyword,
    }),
    [contactType, keyword],
  );

  useEffect(() => {
    setPageTitle("Asiakastieto");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.CREDIT_DECISION),
        pageTitle: "Asiakastieto",
        showSearch: false,
      }),
    );
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (query) => {
      navigate({
        pathname: getRouteById(Routes.CREDIT_DECISION),
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
  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_CREDITDECISION))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.CREDIT_DECISION} />
      </PageContainer>
    );
  return (
    <PageContainer>
      <ContentContainer>
        <h2>{CreditDecisionText.SEARCH_TITLE}</h2>
        <Divider />
        <SearchForm
          onSearch={handleSearchChange}
          initialValues={searchFormInitialValues}
        />

        {contactType && (
          <Fragment>
            {contactType === ContactTypes.BUSINESS && (
              <Fragment>
                <h2>
                  {CreditDecisionText.BUSINESS_TITLE}: {keyword}
                </h2>
                <Divider />
                <CreditDecisionTemplate
                  businessId={keyword}
                  contactType={ContactTypes.BUSINESS}
                />
              </Fragment>
            )}

            {contactType === ContactTypes.PERSON && (
              <Fragment>
                <h2>
                  {CreditDecisionText.PERSON_TITLE}: {keyword}
                </h2>
                <Divider />
                <CreditDecisionTemplate
                  nin={keyword}
                  contactType={ContactTypes.PERSON}
                />
              </Fragment>
            )}
          </Fragment>
        )}
      </ContentContainer>
      <Divider />
      <ContentContainer>
        <h2>{SanctionsCheckText.SEARCH_TITLE}</h2>
        <Divider />
        <SanctionsCheckForm />
      </ContentContainer>
    </PageContainer>
  );
};

export default CreditDecisionSearchPage;
