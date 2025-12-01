import React, { Fragment, useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
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
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type Props = {
  isFetchingUsersPermissions: boolean;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const CreditDecisionSearchPage: React.FC<Props> = ({
  isFetchingUsersPermissions,
  receiveTopNavigationSettings,
  usersPermissions,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contactType, setContactType] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchFormInitialValues, setSearchFormInitialValues] = useState<
    Record<string, any>
  >({});

  useEffect(() => {
    const query = getUrlParams(location.search);
    setPageTitle("Asiakastieto");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CREDIT_DECISION),
      pageTitle: "Asiakastieto",
      showSearch: false,
    });

    setContactType(query.contact_type || "");
    setKeyword(query.keyword || "");
    setSearchFormInitialValues({
      contact_type: query.contact_type || "",
      keyword: query.keyword || "",
    });
  }, [location.search, receiveTopNavigationSettings]);

  useEffect(() => {
    const query = getUrlParams(location.search);
    setContactType(query.contact_type || "");
    setKeyword(query.keyword || "");
    setSearchFormInitialValues({
      contact_type: query.contact_type || "",
      keyword: query.keyword || "",
    });
  }, [location.search]);

  const handleSearchChange = useCallback(
    (query) => {
      setContactType(query.contact_type);
      setKeyword(query.keyword);
      setSearchFormInitialValues({
        contact_type: query.contact_type,
        keyword: query.keyword,
      });
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

export default flowRight(
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
)(CreditDecisionSearchPage) as React.FC;
