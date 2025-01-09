import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import Divider from "@/components/content/Divider";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import SearchForm from "@/creditDecision/components/SearchForm";
import CreditDecisionTemplate from "@/creditDecision/components/CreditDecisionTemplate";
import { ContactTypes } from "@/contacts/enums";
import { CreditDecisionText } from "@/creditDecision/enums";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { FormNames, PermissionMissingTexts } from "@/enums";
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
  initialize: (...args: Array<any>) => any;
  isFetchingUsersPermissions: boolean;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  contactType: String;
  keyword: String;
};

class CreditDecisionSearchPage extends PureComponent<Props, State> {
  state = {
    contactType: "",
    keyword: "",
  };

  componentDidMount() {
    const {
      initialize,
      location: { search },
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);
    setPageTitle("Asiakastieto");
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CREDIT_DECISION),
      pageTitle: "Asiakastieto",
      showSearch: false,
    });

    if (query.contact_type) {
      this.setState({
        contactType: query.contact_type,
      });
    }

    if (query.keyword) {
      this.setState({
        keyword: query.keyword,
      });
    }

    initialize(FormNames.CREDIT_DECISION_SEARCH, query);
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: currentSearch },
      initialize,
    } = this.props;
    const {
      location: { search: prevSearch },
    } = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.setState(
        {
          contactType: searchQuery.contact_type || "",
          keyword: searchQuery.keyword || "",
        },
        () => {
          initialize(FormNames.CREDIT_DECISION_SEARCH, {
            contact_type: searchQuery.contact_type || "",
            keyword: searchQuery.keyword || "",
          });
        },
      );
    }
  }

  handleSearchChange = (query) => {
    const { history } = this.props;
    this.setState(
      {
        contactType: query.contact_type,
        keyword: query.keyword,
      },
      history.push({
        pathname: getRouteById(Routes.CREDIT_DECISION),
        search: getSearchQuery(query),
      }),
    );
  };

  render() {
    const { isFetchingUsersPermissions, usersPermissions } = this.props;
    const { contactType, keyword } = this.state;
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
          <SearchForm onSearch={this.handleSearchChange} />

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
      </PageContainer>
    );
  }
}

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
      initialize,
      receiveTopNavigationSettings,
    },
  ),
)(CreditDecisionSearchPage);
