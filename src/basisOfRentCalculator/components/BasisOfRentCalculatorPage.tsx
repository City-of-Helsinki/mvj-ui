import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import AuthorizationError from "src/components/authorization/AuthorizationError";
import BasisOfRentCalculatorForm from "./BasisOfRentCalculatorForm";
import ContentContainer from "src/components/content/ContentContainer";
import Loader from "src/components/loader/Loader";
import PageContainer from "src/components/content/PageContainer";
import { receiveTopNavigationSettings } from "src/components/topNavigation/actions";
import { PermissionMissingTexts } from "src/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { hasPermissions, setPageTitle } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "src/usersPermissions/selectors";
import { withLeaseAttributes } from "src/components/attributes/LeaseAttributes";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  isFetchingLeaseAttributes: boolean;
  isFetchingUsersPermissions: boolean;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

class BasisOfRentCalculatorPage extends PureComponent<Props> {
  componentDidMount() {
    const {
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Vuokralaskuri');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.BASIS_OF_RENT_CALCULATOR),
      pageTitle: 'Vuokralaskuri',
      showSearch: false
    });
  }

  render() {
    const {
      isFetchingLeaseAttributes,
      isFetchingUsersPermissions,
      usersPermissions
    } = this.props;
    if (isFetchingLeaseAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!usersPermissions) return null;
    if (!hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.BASIS_OF_RENT_CALCULATOR} /></PageContainer>;
    return <PageContainer hasTabs>
        <ContentContainer>
          <BasisOfRentCalculatorForm initialValues={{
          basis_of_rents: [{}]
        }} />
        </ContentContainer>
      </PageContainer>;
  }

}

export default flowRight(withLeaseAttributes, connect(state => {
  return {
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  receiveTopNavigationSettings
}))(BasisOfRentCalculatorPage);